import os
import requests
import time
import json
from datetime import datetime
from dotenv import load_dotenv

import pymongo
import newsapi
from google import genai
from google.genai import types

import grabutil

load_dotenv()
newsClient = newsapi.NewsApiClient(api_key = os.getenv("NEWS_API_KEY"))
geminiClient = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
backendUrl = "http://localhost:8000"

def getArticles():
    wordList = grabutil.create_word_list("news_keywords.json", 500)
    response = newsClient.get_everything(q=wordList, sort_by="relevancy", domains="")

    return response

def classifyData(response):

    goodResponses = [curr for curr in response['articles'] if type(curr) == dict and "title" in curr]

    response = geminiClient.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents="This is a test. Say hello to the terminal!",
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0) # Disables thinking
        )
    )

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

    return total

def addGeolocation(total):
    pass

#TODO
def add_newsapi_to_mongodb(newsArticle):
    print(newsArticle)

    prompt = f"The text after the newline is the title and description of an article that is most likely tied to a volunteering opportunity. Output only a 4-digit binary string indicating if anything in in the title or description indicates that the situation calls for someone to donate clothes, food, manpower, or funding, in that order.\nTitle: {newsArticle["title"]}\nDescription: {newsArticle["description"]}"

    volunteerContext = geminiClient.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(thinking_config=types.ThinkingConfig(thinking_budget=0))
    )

    response = volunteerContext.text
    print(response)
    donateClothes = response[0] == '1'
    donateFood = response[1] == '1'
    donateManpower = response[2] == '1'
    donateFunding = response[3] == '1'

    prompt = f"The text after the newline is the title and description of an article. Try to output a location on the first line, as well as latitude and longitude separated by a space on the second. If you cannot do this, simply output \"UNKNOWN\" on whichever line(s) you are not sure about.\nTitle: {newsArticle["title"]}\nDescription: {newsArticle["description"]}"

    volunteerContext = geminiClient.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(thinking_config=types.ThinkingConfig(thinking_budget=0))
    )

    print(volunteerContext.text)
    response = volunteerContext.text.splitlines()
    
    location = "UNKNOWN"
    latitude = None
    longitude = None

    if not "UNKNOWN" in response[0]:
        location = response[0]

    if not "UNKNOWN" in response[1]:
        posPair = response[1].split(' ')
        latitude = float(posPair[0])
        longitude = float(posPair[1])

    pushArticle = {
        "title": newsArticle["title"],
        "description": newsArticle["description"],
        "linkToImage": newsArticle["urlToImage"],
        "link": newsArticle["url"],
        "time": newsArticle["publishedAt"],
        "needClothes": donateClothes,
        "needFood": donateFood,
        "needManpower": donateManpower,
        "needFunding": donateFunding,
        "location": location,
        "latitude": latitude,
        "longitude": longitude,
    }

    httpResponse = requests.post(backendUrl + "/create/", json=pushArticle)
    if(httpResponse.status_code != 200):
        print(httpResponse)
