import random
import datetime

def yesterday() -> str:
    return (datetime.datetime.today() - datetime.timedelta(days = 1)).strftime('%Y-%m-%d')

def create_word_list(words, max_length = 500):
    """
    Randomly fills a string with words from the given list until either:
    - the string reaches (or slightly exceeds) max_length, or
    - all words are used.
    
    Ensures no duplicate words are added.
    
    Args:
        words (list[str]): The list of words to sample from.
        max_length (int): The maximum allowed length of the output string.
    
    Returns:
        str: The resulting space-separated string.
    """
    words = words.copy()  # avoid mutating original
    random.shuffle(words)
    
    result = []
    current_length = 0
    
    for word in words:
        # Add " OR " before every word after the first
        separator = " OR " if result else ""
        added_length = len(separator) + len(word)
        
        if current_length + added_length > max_length:
            break
        
        result.append(word)
        current_length += added_length
    
    return " OR ".join(result)