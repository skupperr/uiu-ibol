from fastapi import HTTPException
from datetime import datetime

# Create 
# async def create_research(cursor, conn, type, title, description, img_link):
#     try:
#         sql = "INSERT INTO research (title, description, type, img_link, time_date) VALUES (%s,%s,%s,%s,%s)"
#         await cursor.execute(sql, (title, description, type, img_link, datetime.now()))
#         id = cursor.lastrowid
#         await conn.commit()
#         return {"status": "success", "id": id}
#     except Exception as e:
#         await conn.rollback()
#         raise HTTPException(status_code=500, detail=str(e))
    

# # Get all
# async def get_all_research(cursor):
#     try:
#         sql = "SELECT id, title, description, type, img_link, time_date FROM research ORDER BY time_date DESC"
#         await cursor.execute(sql)
#         rows = await cursor.fetchall()
#         return [
#             {
#                 "id": row["id"],
#                 "title": row["title"],
#                 "description": row["description"],
#                 "type": row["type"],
#                 "img_link": row["img_link"],
#                 "time_date": row["time_date"].strftime("%b %d, %Y") if row["time_date"] else None
#             }
#             for row in rows
#         ]
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))



# # Update
# async def update_research(cursor, conn, id, type, title, description, img_link, remove_image):
#     old_img_link = None
#     try:
#         if(img_link or remove_image=='yes'):

#             # 1. Get img_link before deleting
#             await cursor.execute("SELECT img_link FROM research WHERE id=%s", (id,))
#             row = await cursor.fetchone()
#             old_img_link = row['img_link']

#             sql = "UPDATE research SET title=%s, description=%s, type=%s, img_link=%s WHERE id=%s"
#             await cursor.execute(sql, (title, description, type, img_link, id))
#         else:
#             sql = "UPDATE research SET title=%s, description=%s, type=%s WHERE id=%s"
#             await cursor.execute(sql, (title, description, type, id))
#         await conn.commit()
#         return {"status": "success", "id": id, "old_img_link": old_img_link}
#     except Exception as e:
#         await conn.rollback()
#         raise HTTPException(status_code=500, detail=str(e))


# research_db.py
from datetime import datetime
from fastapi import HTTPException
from typing import List

async def create_research(cursor, conn, type_, title, description, img_links: List[str]):
    try:
        main_img = img_links[0] if img_links else None
        sql = "INSERT INTO research (title, description, type, img_link, time_date) VALUES (%s,%s,%s,%s,%s)"
        await cursor.execute(sql, (title, description, type_, main_img, datetime.now()))
        research_id = cursor.lastrowid

        if img_links:
            insert_sql = "INSERT INTO research_image (research_id, img_link) VALUES (%s,%s)"
            for link in img_links:
                await cursor.execute(insert_sql, (research_id, link))

        await conn.commit()
        return research_id
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


async def get_all_research(cursor):
    try:
        sql = "SELECT id, title, description, type, img_link, time_date FROM research ORDER BY time_date DESC"
        await cursor.execute(sql)
        rows = await cursor.fetchall()
        if not rows:
            return []

        ids = [row["id"] for row in rows]
        # build placeholders and args for IN clause
        placeholder = ",".join(["%s"] * len(ids))
        q = f"SELECT id, research_id, img_link FROM research_image WHERE research_id IN ({placeholder})"
        await cursor.execute(q, tuple(ids))
        img_rows = await cursor.fetchall()

        images_by_research = {}
        for r in img_rows:
            images_by_research.setdefault(r["research_id"], []).append({"id": r["id"], "img_link": r["img_link"]})

        result = []
        for row in rows:
            result.append({
                "id": row["id"],
                "title": row["title"],
                "description": row["description"],
                "type": row["type"],
                "img_link": row["img_link"],
                "images": images_by_research.get(row["id"], []),
                "time_date": row["time_date"].strftime("%b %d, %Y") if row["time_date"] else None
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def update_research(cursor, conn, id, type_, title, description, new_img_links: List[str], remove_img_links: List[str]):
    """
    - new_img_links: URLs to be added
    - remove_img_links: existing URLs to be removed
    Returns deleted_img_links so client can clean up storage.
    """
    deleted_links = []
    old_main_link = None
    try:
        # get current main link
        await cursor.execute("SELECT img_link FROM research WHERE id=%s", (id,))
        row = await cursor.fetchone()
        old_main_link = row["img_link"] if row else None

        # 1) Delete requested images from research_image (collect the actual links deleted)
        if remove_img_links:
            # Get matching rows (to find actual rows/ids)
            placeholder = ",".join(["%s"] * len(remove_img_links))
            q = f"SELECT id, img_link FROM research_image WHERE research_id=%s AND img_link IN ({placeholder})"
            await cursor.execute(q, tuple([id] + remove_img_links))
            to_delete = await cursor.fetchall()
            if to_delete:
                deleted_links = [r["img_link"] for r in to_delete]
                ids = [r["id"] for r in to_delete]
                ph = ",".join(["%s"] * len(ids))
                del_q = f"DELETE FROM research_image WHERE id IN ({ph})"
                await cursor.execute(del_q, tuple(ids))

        # 2) Insert new image links
        if new_img_links:
            insert_sql = "INSERT INTO research_image (research_id, img_link) VALUES (%s,%s)"
            for link in new_img_links:
                await cursor.execute(insert_sql, (id, link))

        # 3) Decide whether to update research.img_link (main)
        # If we deleted the main image or a new main is desired, compute a new main
        need_update_main = False
        if old_main_link and old_main_link in deleted_links:
            need_update_main = True
        if new_img_links and not old_main_link:
            need_update_main = True

        if need_update_main or new_img_links or remove_img_links:
            # pick the first remaining image (if any)
            await cursor.execute("SELECT img_link FROM research_image WHERE research_id=%s ORDER BY id LIMIT 1", (id,))
            r = await cursor.fetchone()
            new_main = r["img_link"] if r else (new_img_links[0] if new_img_links else None)
            sql = "UPDATE research SET title=%s, description=%s, type=%s, img_link=%s WHERE id=%s"
            await cursor.execute(sql, (title, description, type_, new_main, id))
        else:
            sql = "UPDATE research SET title=%s, description=%s, type=%s WHERE id=%s"
            await cursor.execute(sql, (title, description, type_, id))

        await conn.commit()
        return {"status": "success", "id": id, "deleted_img_links": deleted_links, "old_img_link": old_main_link}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))



# research_db.py
async def delete_research(cursor, conn, id):
    try:
        # 1. Get all associated image links
        await cursor.execute("SELECT img_link FROM research WHERE id=%s", (id,))
        row = await cursor.fetchone()
        main_img = row['img_link'] if row else None

        await cursor.execute("SELECT img_link FROM research_image WHERE research_id=%s", (id,))
        rows = await cursor.fetchall()
        extra_imgs = [r['img_link'] for r in rows]

        all_imgs = []
        if main_img:
            all_imgs.append(main_img)
        all_imgs.extend(extra_imgs)

        # 2. Delete the research row (cascade removes research_image entries)
        await cursor.execute("DELETE FROM research WHERE id=%s", (id,))
        await conn.commit()

        return {"status": "success", "id": id, "deleted_img_links": all_imgs}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))

