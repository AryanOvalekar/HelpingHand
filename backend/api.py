from fastapi import FastAPI, status, Request, Body, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from models import articleModel
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

@asynccontextmanager
async def lifespan(app: FastAPI):
    uri = os.getenv('MONGO_URI')
    # Create a new client and connect to the server
    app.client = MongoClient(uri, server_api=ServerApi('1'))
    # Send a ping to confirm a successful connection
    try:
        app.client.admin.command('ping')
        
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    app.db = app.client["articles"]
    yield
    app.db["articles"].close()

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],  # Common React dev server ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def pingApi():
    return {"ping": "pong"}

@app.post("/create", response_description="Creating new article", status_code=status.HTTP_201_CREATED, response_model=articleModel.articleModel)
def create_article(request: Request, article: articleModel.articleModel = Body(...)):
    article = jsonable_encoder(article)
    new_article = request.app.db["articles"].insert_one(article)
    created_article = request.app.db["articles"].find_one(
        {"_id": new_article.inserted_id}
    )

    return created_article

@app.get("/recent", response_description="Getting all recent articles", status_code=status.HTTP_200_OK)
def get_recent_article(request: Request):
    results = request.app.db["articles"].find()
    return [document for document in results] #no longer hardcoded :)