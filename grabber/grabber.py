import os
import requests
import time
import json
from datetime import datetime
from dotenv import load_dotenv
import pymongo

import grabutil

load_dotenv()
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
MONGO_URI=os.getenv("MONGO_URI")
AI_STUDIO_KEY=os.getenv("AI_STUDIO_KEY")

keywords = []
with open("news_keywords.json") as keywordFile:
    keyJson = json.load(keywordFile)
    keywords = [word for word in keyJson["include"]]

def query_news(query, fromTime='', searchIn = ''):
    target = f'https://newsapi.org/v2/everything?q={query}'

    #if not fromTime: fromTime = grabutil.yesterday()
    #target += f'&from={fromTime}'

    if searchIn:
        target +=f'&searchIn={searchIn}'
        

    target += f'&apiKey={NEWS_API_KEY}'
    return requests.get(target)



# while True:
#     req = query_news(fill_with_random_words(keywords))
#     print(req.text)
#     time.sleep(60)


print(query_news(grabutil.create_word_list(keywords, 100)).text)