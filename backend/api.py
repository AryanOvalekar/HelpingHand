from fastapi import FastAPI
from fastapi import Depends
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os


load_dotenv()

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
uri = os.getenv('MONGO_URI')
print(uri)
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
"""
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.conn = globals.connPool.getConnection()
    yield
    globals.connPool.pool.putconn(app.state.conn)
"""
app = FastAPI()

@app.get("/")
async def pingApi():
    return {"ping": "pong"}