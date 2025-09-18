# # backend/src/lib/firebase_admin.py
# import firebase_admin
# from firebase_admin import credentials
# import os
# import json
# from dotenv import load_dotenv

# load_dotenv()

# # Initialize only once
# if not firebase_admin._apps:
#     # cred = credentials.Certificate("uiu-ibol-firebase-adminsdk-fbsvc-099f11a7c7.json")
#     # firebase_admin.initialize_app(cred)
#     firebase_creds = json.loads(os.environ["FIREBASE_CREDENTIALS"])
#     cred = credentials.Certificate(firebase_creds)
#     firebase_admin.initialize_app(cred)

import os
import json
import base64
import firebase_admin
from firebase_admin import credentials
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    b64_str = os.environ["FIREBASE_CREDENTIALS_BASE64"]
    json_str = base64.b64decode(b64_str).decode("utf-8")
    firebase_creds = json.loads(json_str)
    cred = credentials.Certificate(firebase_creds)
    firebase_admin.initialize_app(cred)
