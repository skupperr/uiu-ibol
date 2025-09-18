# backend/src/lib/firebase_admin.py
import firebase_admin
from firebase_admin import credentials

# Initialize only once
if not firebase_admin._apps:
    cred = credentials.Certificate("uiu-ibol-firebase-adminsdk-fbsvc-099f11a7c7.json")
    firebase_admin.initialize_app(cred)
