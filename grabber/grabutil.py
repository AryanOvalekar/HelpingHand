import random
import json
import datetime

def yesterday() -> str:
    return (datetime.datetime.today() - datetime.timedelta(days = 1)).strftime('%Y-%m-%d')

def create_word_list(wordFilePath, maxLength = 500):
    includeKeywords = []
    with open("news_keywords.json") as keywordFile:
        keyJson = json.load(keywordFile)
        includeKeywords = keyJson["include"]

    random.shuffle(includeKeywords)
    
    result = []
    currentLength = 0
    
    for word in includeKeywords:
        separator = " OR " if result else ""
        addedLength = len(separator) + len(word)
        
        if currentLength + addedLength > maxLength:
            break
        
        result.append(word)
        currentLength += addedLength
    
    return " OR ".join(result)