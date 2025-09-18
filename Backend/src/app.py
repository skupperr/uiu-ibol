from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import news_request_manager, publications_request_manager, research_request_manager, profile_request_manager, people_request_manager
from .database.database import init_pool, close_pool


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

@app.on_event("startup")
async def startup():
    await init_pool()

@app.on_event("shutdown")
async def shutdown():
    await close_pool()


app.include_router(news_request_manager.router, prefix="/api")
app.include_router(publications_request_manager.router, prefix="/api")
app.include_router(research_request_manager.router, prefix="/api")
app.include_router(profile_request_manager.router, prefix="/api")
app.include_router(people_request_manager.router, prefix="/api")
