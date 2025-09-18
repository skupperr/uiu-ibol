from fastapi import APIRouter, Depends, HTTPException
from ..database.database import get_db
from ..database import publications_db, profile_db
from pydantic import BaseModel
from typing import List
import traceback
import time
from auth.dependencies import get_current_user


router = APIRouter()

class PublicationCreate(BaseModel):
    title: str
    abstract: str
    link: str
    date: str  # "YYYY-MM-DD"
    authors: List[str]

class PublicationUpdate(PublicationCreate):
    pass

async def require_admin(user = Depends(get_current_user), db_dep=Depends(get_db)):
    cursor, conn = db_dep
    account_type = await profile_db.check_account_type(cursor, conn, user['uid'])
    if account_type != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    return user

@router.post("/create-publication")
async def create_publication_api(pub: PublicationCreate, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        pub_id = await publications_db.create_publication(
            cursor, conn, pub.title, pub.abstract, pub.link, pub.date, pub.authors
        )
        return {"status": "success", "id": pub_id}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.get("/get-all-publications")
async def get_all_publications_api(db_dep=Depends(get_db)):
    try:
        cursor, _ = db_dep
        data = await publications_db.get_all_publications(cursor)
        return {"status": "success", "data": data}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.put("/update-publication/{id}")
async def update_publication_api(id: int, pub: PublicationUpdate, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        result = await publications_db.update_publication(
            cursor, conn, id, pub.title, pub.abstract, pub.link, pub.date, pub.authors
        )
        return result
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.delete("/delete-publication/{id}")
async def delete_publication_api(id: int, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        result = await publications_db.delete_publication(cursor, conn, id)
        return result
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
