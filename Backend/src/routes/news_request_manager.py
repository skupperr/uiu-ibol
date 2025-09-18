from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List
from pydantic import BaseModel
import traceback
# from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import news_db, profile_db
import time, json
from auth.dependencies import get_current_user

router = APIRouter()

class NewsCreate(BaseModel):
    type: str
    title: str
    description: str
    link_title: str
    link: str
    authors: str

class NewsUpdate(BaseModel):
    type: str
    title: str
    description: str
    link_title: str
    link: str
    authors: str

async def require_admin(user = Depends(get_current_user), db_dep=Depends(get_db)):
    cursor, conn = db_dep
    account_type = await profile_db.check_account_type(cursor, conn, user['uid'])
    if account_type != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    return user


@router.get("/get-all-news")
async def get_all_news(request: Request = None, db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep

        all_news = await news_db.get_all_news(cursor)

        return {"status": "success", "data": all_news}

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    
@router.post("/create-news")
async def create_news_api(news: NewsCreate, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep

        news_id = await news_db.create_news(
            cursor,
            conn,
            (news.type).upper(),
            news.title,
            news.description,
            news.link_title,
            news.link,
            news.authors,
        )
        return {"status": "success", "id": news_id}
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.put("/update-news/{id}")
async def update_news_api(id: int, news: NewsUpdate, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        result = await news_db.update_news(
            cursor,
            conn,
            id,
            news.type,
            news.title,
            news.description,
            news.link_title,
            news.link,
            news.authors,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.delete("/delete-news/{id}")
async def delete_news_api(id: int, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        result = await news_db.delete_news(cursor, conn, id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")