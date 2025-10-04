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
goodResponses = [curr for curr in response['articles'] if type(curr) == dict and "title" in curr]
#upload_article_to_mongo(article_to_db_entry(response["articles"][0]), mongoClient)
titles = [curr['title'] for curr in goodResponses]
print(len(titles))
response = geminiClient.models.generate_content(
    model="gemini-2.5-pro",
    contents=f"For each of the following lines, please determine if it is a situation where volunteers or donations of money, food, or clothes are required to help people in need. If they match the specified criteria, output a new line in the format <need> <category> <severity> <location>. need is 'food', 'clothing', 'money' or 'volunteers' based on what the situation seems to require the most. category is the type of situation the title is among 'naturalDisaster', 'warRelief', 'volunteerWork'. severity is the estimated severity of the situation and urgency of the aid, either 'low' or 'high', be very strict with what you determine as high severity. location is the estimated Country, State, and City of the event based on the line. If the line does not match the specification return 'N/A'. Do not output any other words or text as part of your response, only the previously sepcified output. Here are the lines each of which for you to classify:\n {"\n".join(titles)}",
    config=types.GenerateContentConfig(
    )
)
print(response.text)
data = response.text.split('\n')
total = []
goodRespCount = min(len(data), len(titles))
for i in range(goodRespCount):
    if data[i] != 'N/A':
        curr = data[i].split(' ')
        goodResponses[i]['need'] = curr[0]
        goodResponses[i]['category'] = curr[1]
        goodResponses[i]['severity'] = curr[2]
        goodResponses[i]['location'] = " ".join(curr[3:])
        total.append(goodResponses[i])

print(total)
print(len(total))