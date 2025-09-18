from fastapi import APIRouter, Depends
from auth.dependencies import get_current_user
from firebase_admin import auth
from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List
from pydantic import BaseModel
import traceback
# from ..utils import authenticate_and_get_user_details
from ..database.database import get_db
from ..database import profile_db

router = APIRouter()

class ProfileUpdate(BaseModel):
    name: str | None = None
    img_link: str | None = None
    linkedin: str | None = None
    github: str | None = None
    research_gate: str | None = None
    google_scholar: str | None = None


async def require_admin(user = Depends(get_current_user), db_dep=Depends(get_db)):
    cursor, conn = db_dep
    account_type = await profile_db.check_account_type(cursor, conn, user['uid'])
    if account_type != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    return user


@router.post("/insert-profile")
async def insert_profile(user = Depends(get_current_user), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        await profile_db.insert_user(cursor, conn, user["uid"], user["email"])
        return {"status": "success", "user": user}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.get("/get-profile")
async def get_profile(user=Depends(get_current_user), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        user_profile = await profile_db.get_profile(cursor, conn, user['uid'])


        return {"status": "success", "user": user_profile}

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.put("/update-profile")
async def update_profile(
    item: dict,
    user=Depends(get_current_user),
    db_dep=Depends(get_db)
):
    try:
        print(item)
        cursor, conn = db_dep
        result = await profile_db.update_profile(cursor, conn, user["uid"], item.get("name"), item.get("profile_tag"), item.get("img_link"), item.get("linkedin"), item.get("github"), item.get("scholar"), item.get("researchgate"))

        return result
    except Exception as e:
        await conn.rollback()
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.delete("/delete-account")
async def delete_account(user = Depends(get_current_user), db_dep=Depends(get_db)):
    cursor, conn = db_dep
    try:
        # Remove user from MySQL
        old_img_link = await profile_db.delete_user(cursor, conn, user["uid"])

        # Optionally, return uid/email for logging purposes
        return {"status": "success", "old_img_link": old_img_link}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.put("/update-profile-email")
async def update_profile_email(
    data: dict, 
    user=Depends(get_current_user), 
    db_dep=Depends(get_db)
):
    cursor, conn = db_dep
    new_email = data.get("email")
    if not new_email:
        raise HTTPException(status_code=400, detail="Email is required")

    try:
        await cursor.execute(
            "UPDATE users SET email=%s WHERE uid=%s",
            (new_email, user["uid"])
        )
        await conn.commit()
        return {"status": "success", "email": new_email}
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# Admin end work

@router.post("/create-user")
async def create_user(data: dict, user=Depends(require_admin), db_dep=Depends(get_db)):
    cursor, conn = db_dep
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    try:
        # Create user in Firebase Auth
        fb_user = auth.create_user(
            email=email,
            password=password
        )
        print(fb_user)

        await profile_db.insert_user(cursor, conn, fb_user.uid, email)

        return {"status": "success", "user": {"uid": fb_user.uid, "email": email}}

    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="Email is already in use.")

    except Exception as e:
        print("Unexpected error:", e)
        raise HTTPException(status_code=500, detail="Failed to create user")

    

@router.get("/get-all-users")
async def get_all_users(db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        users = await profile_db.get_all_users(cursor, conn)
        return {"status": "success", "users": users}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.delete("/delete-user/{uid}")
async def delete_user(uid: str, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        auth.delete_user(uid)
        old_img_link = await profile_db.delete_user(cursor, conn, uid)
        return {"status": "success", "old_img_link": old_img_link}
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.put("/toggle-account-type/{uid}")
async def toggle_account_type(uid: str, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        res = await profile_db.toggle_account_type(cursor, conn, uid)
        return res
    except Exception as e:
        await conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
