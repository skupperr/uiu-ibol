import aiomysql
import asyncio
from typing import Optional, Tuple
from fastapi import HTTPException
from dotenv import load_dotenv
import os

load_dotenv()

_pool: Optional[aiomysql.Pool] = None

DB_CONFIG = {
    # "host": os.getenv('HOST'),
    # "port": int(os.getenv('DB_PORT')),
    # "user": os.getenv('USER'),
    # "password": os.getenv('PASSWORD'),
    # "db": os.getenv('DB'),
    "host": "localhost",
    "user": "root",
    "password": "",
    "db": "uiu_ibol",
    "minsize": 1,
    "maxsize": 5,
    "autocommit": True,  # we'll explicitly commit/rollback
    "charset": "utf8mb4",
}

async def init_pool() -> None:
    global _pool
    if _pool is None:
        _pool = await aiomysql.create_pool(**DB_CONFIG)

async def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.close()
        await _pool.wait_closed()
        _pool = None

async def get_db():
    """
    FastAPI async dependency that yields (cursor, conn).
    Cursor returns dict rows, e.g. {"col": value}
    """
    if _pool is None:
        # Safety net if startup hook wasn't called
        await init_pool()

    assert _pool is not None
    async with _pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            try:
                yield cursor, conn
            finally:
                # Always try to rollback on any exception
                # The context manager will handle the connection cleanup
                try:
                    await conn.rollback()
                except Exception:
                    pass
