import os
import requests
import time
import json
from datetime import datetime
from dotenv import load_dotenv

import pymongo
from newsapi import NewsApiClient
from google import genai
from google.genai import types

import grabutil

load_dotenv()
newsClient = NewsApiClient(api_key = os.getenv("NEWS_API_KEY"))
mongoClient = pymongo.MongoClient(os.getenv("MONGO_URI"))
geminiClient = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

#def add_newsapi_to_mongodb()

# while True:
#     req = query_news(fill_with_random_words(keywords))
#     print(req.text)
#     time.sleep(60)

wordList = grabutil.create_word_list("news_keywords.json", 500)

response = newsClient.get_everything(q=wordList, sort_by="relevancy", domains="")
print(response["totalResults"])

#upload_article_to_mongo(article_to_db_entry(response["articles"][0]), mongoClient)
# print(response["articles"])

# response = geminiClient.models.generate_content(
#     model="gemini-2.5-flash-lite",
#     contents="This is a test. Say hello to the terminal!",
#     config=types.GenerateContentConfig(
#         thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
#     )
# )

# print(response.text)