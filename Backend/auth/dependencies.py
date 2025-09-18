# dependencies.py
import firebase_admin  # ensure SDK is initialized
from firebase_admin import auth
from .firebase_admin import *  # this imports the init code

from fastapi import Header, HTTPException

def get_current_user(authorization: str = Header(None)):
    # print(">>> Backend Authorization header:", authorization) 
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")

        decoded_token = auth.verify_id_token(token)

        uid = decoded_token["uid"]
        email = decoded_token.get("email")
        return {"uid": uid, "email": email}

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {str(e)}")
