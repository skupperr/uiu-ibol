from fastapi import HTTPException
from datetime import datetime


async def insert_user(cursor, conn, uid: str, email: str):
    try:
        await cursor.execute("SELECT id FROM users WHERE uid=%s", (uid,))
        result = await cursor.fetchone()
        if not result:
            await cursor.execute(
                "INSERT INTO users (uid, email) VALUES (%s, %s)", (uid, email)
            )
            await conn.commit()
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


async def get_profile(cursor, conn, uid: str):
    try:
        await cursor.execute(
            "SELECT uid, email, account_type, name, profile_tag, img_link, linkedin, github, research_gate, google_scholar FROM users WHERE uid=%s",
            (uid,),
        )
        row = await cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        # row is dict-like
        user = {
            "uid": row["uid"],
            "email": row["email"],
            "name": row["name"],
            "profile_tag": row["profile_tag"],
            "account_type": row["account_type"],
            "img_link": row["img_link"],
            "linkedin": row["linkedin"],
            "github": row["github"],
            "research_gate": row["research_gate"],
            "google_scholar": row["google_scholar"],
        }
        return user
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


async def check_account_type(cursor, conn, uid: str):
    try:
        await cursor.execute("SELECT account_type FROM users WHERE uid=%s", (uid,))
        row = await cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        account_type = row["account_type"]

        return account_type
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


async def update_profile(cursor, conn, id: str, name: str, profile_tag: str, img_link: str, linkedin: str, github: str, scholar: str, researchgate: str,
):
    try:
        old_img_link = None
        if img_link:
            await cursor.execute("SELECT img_link FROM users WHERE uid=%s", (id,))
            row = await cursor.fetchone()
            old_img_link = row['img_link']

            query = """
                UPDATE users 
                SET name = %s, profile_tag = %s, img_link = %s, linkedin = %s, github = %s, research_gate = %s, google_scholar = %s
                WHERE uid = %s
            """
            await cursor.execute(query,(name, profile_tag, img_link, linkedin, github, researchgate, scholar, id,),)
        else:
            query = """
                UPDATE users 
                SET name = %s, profile_tag = %s, linkedin = %s, github = %s, research_gate = %s, google_scholar = %s
                WHERE uid = %s
            """
            await cursor.execute(query,(name, profile_tag, linkedin, github, researchgate, scholar, id,),)
        await conn.commit()
        return {"status": "success", "old_img_link": old_img_link }
    
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


async def delete_user(cursor, conn, uid: str):
    try:
        old_img_link = None
        await cursor.execute("SELECT img_link FROM users WHERE uid=%s", (uid,))
        row = await cursor.fetchone()
        old_img_link = row['img_link']

        await cursor.execute("DELETE FROM users WHERE uid=%s", (uid,))
        await conn.commit()

        return old_img_link
    except Exception as e:
        await conn.rollback()
        raise


async def get_all_users(cursor, conn):
    try:
        await cursor.execute("""
            SELECT uid, name, email, account_type, img_link, linkedin, github, research_gate, google_scholar
            FROM users
        """)
        rows = await cursor.fetchall()
        return rows
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def toggle_account_type(cursor, conn, uid: str):
    try:
        await cursor.execute("SELECT account_type FROM users WHERE uid=%s", (uid,))
        row = await cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        new_type = "regular" if row["account_type"] == "admin" else "admin"

        await cursor.execute(
            "UPDATE users SET account_type=%s WHERE uid=%s", 
            (new_type, uid)
        )
        await conn.commit()

        return {"status": "success", "new_type": new_type}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))