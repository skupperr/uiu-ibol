from fastapi import APIRouter, Depends
from auth.dependencies import get_current_user
from fastapi import Depends, HTTPException, Request, APIRouter, Body
from typing import List
from pydantic import BaseModel
import traceback
from ..database.database import get_db
from ..database import people_db, profile_db
import time

router = APIRouter()

class RoleCreate(BaseModel):
    role_name: str

class AssignUser(BaseModel):
    role_id: int
    user_id: str


async def require_admin(user = Depends(get_current_user), db_dep=Depends(get_db)):
    cursor, conn = db_dep
    account_type = await profile_db.check_account_type(cursor, conn, user['uid'])
    if account_type != 'admin':
        raise HTTPException(status_code=403, detail="Admin only")
    return user


# Create role
@router.post("/roles")
async def create_role(role: RoleCreate, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        
        res = await people_db.create_role(cursor, conn, role)
        return res
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# Get all roles with hierarchy
@router.get("/roles")
async def get_roles(db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        res = await people_db.get_role(cursor)
        return res
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# Update role order (swap positions)
@router.put("/roles/reorder")
async def reorder_roles(roles: list[dict], user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        res = await people_db.reorder_roles(cursor, conn, roles)
        return res
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# Delete role
@router.delete("/roles/{role_id}")
async def delete_role(role_id: int, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        res = await people_db.delete_roles(cursor, conn, role_id)
        return res
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users/unassigned")
async def get_unassigned_users(db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        users = await people_db.get_unassigned_user(cursor, conn)
        return users
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# Assign a user to role
@router.post("/roles/assign")
async def assign_user_to_role(payload: AssignUser, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        res = await people_db.assign_user_to_role(cursor, conn, payload.role_id, payload.user_id)
        return res
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# Remove a user from a role
@router.delete("/roles/{role_id}/unassign/{user_id}")
async def unassign_user(role_id: int, user_id: str, user=Depends(require_admin), db_dep=Depends(get_db)):
    try:
        cursor, conn = db_dep
        res = await people_db.unassign_user_from_role(cursor, conn, role_id, user_id)
        return res
    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

