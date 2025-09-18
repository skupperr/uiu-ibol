from fastapi import HTTPException
from datetime import datetime

# ----------------------------
# Create a publication
# ----------------------------
async def create_publication(cursor, conn, title, abstract, link, date, authors: list):
    try:
        # Insert into publications table
        sql_pub = "INSERT INTO publications (title, abstract, link, date) VALUES (%s, %s, %s, %s)"
        await cursor.execute(sql_pub, (title, abstract, link, date))
        pub_id = cursor.lastrowid

        # Insert authors
        if authors:
            sql_author = "INSERT INTO publication_authors (publication_id, author_name) VALUES (%s, %s)"
            for author in authors:
                await cursor.execute(sql_author, (pub_id, author))

        await conn.commit()
        return pub_id
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB error in create_publication: {e}")


# ----------------------------
# Get all publications (grouped by year)
# ----------------------------
async def get_all_publications(cursor):
    try:
        # Join publications and authors
        sql = """
        SELECT p.id, p.title, p.abstract, p.link, p.date, a.author_name
        FROM publications p
        LEFT JOIN publication_authors a ON p.id = a.publication_id
        ORDER BY p.date DESC, p.id DESC
        """
        await cursor.execute(sql)
        rows = await cursor.fetchall()

        # Group by publication ID first
        pubs_dict = {}
        for row in rows:
            pub_id = row["id"]
            if pub_id not in pubs_dict:
                pubs_dict[pub_id] = {
                    "id": row["id"],
                    "title": row["title"],
                    "desc": row["abstract"],
                    "link": row["link"],
                    "publish_date": row["date"].strftime("%b %d, %Y"),
                    "authors": [],
                    "year": str(row["date"].year)
                }
            if row["author_name"]:
                pubs_dict[pub_id]["authors"].append(row["author_name"])

        # Group by year for frontend
        year_dict = {}
        for pub in pubs_dict.values():
            year = pub.pop("year")
            if year not in year_dict:
                year_dict[year] = []
            year_dict[year].append(pub)

        # Convert to sorted list
        result = [{"year": y, "papers": year_dict[y]} for y in sorted(year_dict.keys(), reverse=True)]
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB error in get_all_publications: {e}")


# ----------------------------
# Update a publication
# ----------------------------
async def update_publication(cursor, conn, pub_id, title, abstract, link, date, authors: list):
    try:
        # Update publications table
        sql = "UPDATE publications SET title=%s, abstract=%s, link=%s, date=%s WHERE id=%s"
        await cursor.execute(sql, (title, abstract, link, date, pub_id))

        # Delete old authors
        await cursor.execute("DELETE FROM publication_authors WHERE publication_id=%s", (pub_id,))

        # Insert new authors
        if authors:
            sql_author = "INSERT INTO publication_authors (publication_id, author_name) VALUES (%s, %s)"
            for author in authors:
                await cursor.execute(sql_author, (pub_id, author))

        await conn.commit()
        return {"status": "success"}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB error in update_publication: {e}")


# ----------------------------
# Delete a publication
# ----------------------------
async def delete_publication(cursor, conn, pub_id):
    try:
        # Delete from publications; authors will cascade
        await cursor.execute("DELETE FROM publications WHERE id=%s", (pub_id,))
        await conn.commit()
        return {"status": "success"}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=f"DB error in delete_publication: {e}")
