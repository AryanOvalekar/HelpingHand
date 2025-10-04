import random
import json
import datetime

def yesterday() -> str:
    return (datetime.datetime.today() - datetime.timedelta(days = 1)).strftime('%Y-%m-%d')

def create_word_list(wordFilePath, maxLength = 500):
    includeKeywords = []
    excludeKeywords = []
    with open("news_keywords.json") as keywordFile:
        keyJson = json.load(keywordFile)
        includeKeywords = keyJson["include"]
        excludeKeywords = keyJson["exclude"]

    random.shuffle(includeKeywords)
    
    #excludeString = " OR ".join(excludeKeywords)
    #excludeString = "NOT (" + excludeString + ") AND ("

    result = []
    currentLength = 0#len(excludeString) + 1 # count ending parenthesis
    
    for word in includeKeywords:
        # Add " OR " before every word after the first
        separator = " OR " if result else ""
        addedLength = len(separator) + len(word)
        
        if currentLength + addedLength > maxLength:
            break
        
        result.append(word)
        currentLength += addedLength
    
    includeString = " OR ".join(result)
    return includeString