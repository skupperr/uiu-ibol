from fastapi import HTTPException
from datetime import datetime


async def create_role(cursor, conn, role):
    try:
        await cursor.execute("SELECT MAX(position) as max_pos FROM roles")
        row = await cursor.fetchone()
        new_pos = (row['max_pos'] or 0) + 1

        await cursor.execute(
            "INSERT INTO roles (role_name, position) VALUES (%s, %s)",
            (role.role_name, new_pos)
        )
        await conn.commit()
        return {
            "status": "success",
            "id": cursor.lastrowid, 
            "role_name": role.role_name,
            "position": new_pos
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

async def get_role(cursor):
    try:
        # Fetch roles
        await cursor.execute("SELECT id, role_name, position FROM roles ORDER BY position ASC")
        roles = await cursor.fetchall()

        # Fetch users assigned to roles
        await cursor.execute("""
            SELECT ra.role_id, u.uid, u.name, u.email, u.img_link, u.profile_tag, u.linkedin, u.github, u.research_gate, u.google_scholar
            FROM role_assignments ra
            JOIN users u ON ra.user_id = u.uid
        """)
        assigned_users = await cursor.fetchall()

        # Map users into their roles
        role_dict = {r["id"]: {**r, "peoples": []} for r in roles}
        for user in assigned_users:
            role_dict[user["role_id"]]["peoples"].append({
                "id": user["uid"],
                "name": user["name"],
                "email": user["email"],
                "photo": user["img_link"] or "/images/default-avatar.png",
                "position": user["profile_tag"],
                "linkedin": user["linkedin"],
                "github": user["github"],
                "research_gate": user["research_gate"],
                "google_scholar": user["google_scholar"],
            })

        return {"status": "success", "roles": list(role_dict.values())}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

async def reorder_roles(cursor, conn, roles):
    """
    roles = [{ "id": 1, "position": 1 }, { "id": 2, "position": 2 }]
    """
    try:
        for role in roles:
            await cursor.execute(
                "UPDATE roles SET position=%s WHERE id=%s",
                (role["position"], role["id"])
            )
        await conn.commit()
        return {"status": "success"}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

async def delete_roles(cursor, conn, role_id):
    try:
        await cursor.execute("DELETE FROM roles WHERE id=%s", (role_id,))
        await conn.commit()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

async def get_unassigned_user(cursor, conn):
    try:
        await cursor.execute("""
        SELECT u.uid, u.name, u.email, u.img_link
        FROM users u
        LEFT JOIN role_assignments ra ON u.uid = ra.user_id
        WHERE ra.user_id IS NULL
        """)
        users = await cursor.fetchall()
        return {"status": "success", "users": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

async def assign_user_to_role(cursor, conn, role_id, user_id):
    try:
        await cursor.execute(
            "INSERT INTO role_assignments (role_id, user_id) VALUES (%s, %s)",
            (role_id, user_id)
        )
        await conn.commit()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def unassign_user_from_role(cursor, conn, role_id, user_id):
    try:
        await cursor.execute(
            "DELETE FROM role_assignments WHERE role_id=%s AND user_id=%s",
            (role_id, user_id)
        )
        await conn.commit()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))