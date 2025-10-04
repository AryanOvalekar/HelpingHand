from fastapi import FastAPI
from fastapi import Depends
from dotenv import load_dotenv
from contextlib import asynccontextmanager


load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.conn = globals.connPool.getConnection()
    yield
    globals.connPool.pool.putconn(app.state.conn)

app = FastAPI(lifespan=lifespan)

@app.get("/")
async def pingApi():
    return {"ping": "pong"}