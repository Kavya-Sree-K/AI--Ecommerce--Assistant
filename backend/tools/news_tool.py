import os
from serpapi import GoogleSearch
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

def get_news(product):

    params = {
        "engine": "google_news",
        "q": f"{product} latest product news",
        "num": 20,
        "api_key": SERPAPI_KEY
    }

    search = GoogleSearch(params)

    results = search.get_dict()

    return results