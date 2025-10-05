import os
import requests
import time
import json
from datetime import datetime
from dotenv import load_dotenv

import pymongo
import newsapi
import geopy
from google import genai
from google.genai import types

import grabutil

load_dotenv()
newsClient = newsapi.NewsApiClient(api_key = os.getenv("NEWS_API_KEY"))
geminiClient = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
geolocator = geopy.GoogleV3(api_key=os.getenv("GEOCODING_API_KEY"))
backendUrl = "http://localhost:8000"

def getArticles():
    wordList = grabutil.create_word_list("news_keywords.json", 500)
    response = newsClient.get_everything(q=wordList, sort_by="relevancy", domains="")
    print(f"got {response["totalResults"]} news articles")
    return response

def classifyData(response):
    goodResponses = [curr for curr in response['articles'] if type(curr) == dict and "title" in curr]

    titles = [curr['title'] for curr in goodResponses]
    response = geminiClient.models.generate_content(
        model="gemini-2.5-pro",
        contents=f"For each of the following lines, please determine if it is a situation where volunteers or donations of money, food, or clothes are required to help people in need. If they match the specified criteria, output a new line in the format <need> <category> <severity> <location>. need is 'food', 'clothing', 'money' or 'volunteers' based on what the situation seems to require the most. category is the type of situation the title is among 'naturalDisaster', 'warRelief', 'volunteerWork'. severity is the estimated severity of the situation and urgency of the aid, either 'low' or 'high', be very strict with what you determine as high severity. location is the estimated Country, State, and City of the event based on the line. If the line does not match the specification return 'N/A'. Do not output any other words or text as part of your response, only the previously sepcified output. Here are the lines each of which for you to classify:\n {"\n".join(titles)}",
        config=types.GenerateContentConfig(
        )
    )
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
    print(f"filtered and classified {len(total)} news articles")
    return total

def addGeolocation(total):
    for response in total:
        if response["location"].strip() != "UNKNOWN":
            location = geolocator.geocode(response["location"], exactly_one=True)
            response["latitude"] = location.latitude
            response["longitude"] = location.longitude

#TODO
def postNews(newsArticle):
    needMap = {"food":0, "clothing":1, "money":2, "volunteers": 3}
    severityMap = {"high":True, "low":False}
    pushArticle = {
        "title": newsArticle["title"],
        "description": newsArticle["description"],
        "url": newsArticle["url"],
        "urlToImage": newsArticle["urlToImage"],
        "location": newsArticle["location"],
        "publishedAt": newsArticle["publishedAt"],
        "severity": severityMap[newsArticle["severity"]],
        "need": needMap[newsArticle["need"]],
        "category": newsArticle["category"],
        "longitude": newsArticle["longitude"],
        "latitude": newsArticle["latitude"]
    }

    httpResponse = requests.post(backendUrl + "/create", json=pushArticle)
    if(httpResponse.status_code != 201):
        print(httpResponse.status_code)
        print(httpResponse.text)

articlesList = classifyData(getArticles())
for i in articlesList:
    i["longitude"] = 38.8977
    i["latitude"] = 77.0365
    postNews(i)
print(f"added {len(articlesList)} news articles")

