from fastapi import APIRouter, Depends, HTTPException
from ..database.database import get_db
from ..database import research_db, profile_db
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
from datetime import datetime
import traceback
import time
from auth.dependencies import get_current_user

router = APIRouter()

class ResearchIn(BaseModel):
    title: str
    description: str
    type: str
    image_urls: Optional[List[str]] = None   # new images (uploaded by client)
    remove_images: Optional[List[str]] = None  # existing image URLs to remove when editing



async def require_admin(user = Depends(get_current_user), db_dep=Depends(get_db)):
    cursor, conn = db_dep
    account_type = await profile_db.check_account_type(cursor, conn, user['uid'])
    if account_type != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    return user

# @router.post("/create-research")
# async def create_research(item: ResearchIn, user=Depends(require_admin), db_dep=Depends(get_db)):
#     try:
#         cursor, conn = db_dep
#         research_id = await research_db.create_research(
#             cursor, conn, item.type, item.title, item.description, item.image_url
#         )
#         return {"status": "success", "id": research_id}
#     except Exception as e:
#         print(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


# # Get all
# @router.get("/get-all-research-project")
# async def get_all_research_project(db_dep=Depends(get_db)):
#     try:
#         cursor, conn = db_dep
#         return {"status": "success", "data": await research_db.get_all_research(cursor)}
#     except Exception as e:
#         print(traceback.format_exc())
#         raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

# # Update
# @router.put("/update-research/{id}")
# async def update_research_endpoint(id: int, item: dict, user=Depends(require_admin), db_dep=Depends(get_db)):
#     cursor, conn = db_dep
#     return await research_db.update_research(
#         cursor, conn,
#         id,
#         item.get("type"),
#         item.get("title"),
#         item.get("description"),
#         item.get("image_url"),
#         item.get("remove_image").lower()
#     )

@router.post("/create-research")
async def create_research(item: ResearchIn, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        research_id = await research_db.create_research(
            cursor, conn, item.type, item.title, item.description, item.image_urls or []
        )
        return {"status": "success", "id": research_id}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@router.get("/get-all-research-project")
async def get_all_research_project(db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        return {"status": "success", "data": await research_db.get_all_research(cursor)}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@router.put("/update-research/{id}")
async def update_research_endpoint(id: int, item: ResearchIn, user=Depends(require_admin), db_dep=Depends(get_db)):
    cursor, conn = db_dep
    # item.image_urls contains new images to add
    # item.remove_images contains existing image URLs to remove
    return await research_db.update_research(
        cursor, conn,
        id,
        item.type,
        item.title,
        item.description,
        item.image_urls or [],
        item.remove_images or []
    )


# Delete
@router.delete("/delete-research/{id}")
async def delete_research_endpoint(id: int, user=Depends(require_admin), db_dep=Depends(get_db)):

    try:
        cursor, conn = db_dep
        return await research_db.delete_research(cursor, conn, id)
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")