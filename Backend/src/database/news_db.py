# news_db.py
from datetime import datetime
from fastapi import HTTPException

# Create a new chat session
async def create_news(cursor, conn, type, title, description, link_title, link, authors):
    try:
        sql = """
            INSERT INTO news_and_event (type, title, description, link_title, link, authors, time_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        await cursor.execute(sql, (type, title, description, link_title, link, authors, datetime.now()))
        id = cursor.lastrowid
        await conn.commit()
        return id
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB error in create_chat_history: {e}")
    

from fastapi import HTTPException
from datetime import datetime

#  Update news
async def update_news(cursor, conn, id, type, title, description, link_title, link, authors):
    try:
        sql = """
            UPDATE news_and_event
            SET type = %s, title = %s, description = %s, link_title = %s, link = %s, authors = %s, time_date = %s
            WHERE id = %s
        """
        await cursor.execute(sql, (type, title, description, link_title, link, authors, datetime.now(), id))
        await conn.commit()
        return {"status": "success", "message": f"News with id {id} updated"}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB error in update_news: {e}")


#  Delete news
async def delete_news(cursor, conn, id):
    try:
        sql = "DELETE FROM news_and_event WHERE id = %s"
        await cursor.execute(sql, (id,))
        await conn.commit()
        return {"status": "success", "message": f"News with id {id} deleted"}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB error in delete_news: {e}")


#  Retrieve all news
async def get_all_news(cursor):
    try:
        sql = "SELECT id, type, title, description, link_title, link, authors, time_date FROM news_and_event ORDER BY time_date DESC"
        await cursor.execute(sql)
        rows = await cursor.fetchall()

        # Transform rows into frontend format
        result = []
        for row in rows:
            result.append({
                "id": row["id"],
                "title": row["title"],
                "desc": row["description"],
                "link": row["link"],
                "linkHeading": row["link_title"],
                "type": row["type"],
                "date": row["time_date"].strftime("%b %d, %Y"),  # e.g., Feb 09, 2024
                "by": row["authors"]
            })

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_all_news: {e}")

