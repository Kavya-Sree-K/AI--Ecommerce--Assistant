import os
from serpapi import GoogleSearch
from dotenv import load_dotenv

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")


# Google Shopping Search
def search_google(product):
    params = {
        "engine": "google_shopping",
        "q": product,
        "num": 10,
        "api_key": SERPAPI_KEY
    }

    return GoogleSearch(params).get_dict()


# Amazon Search
def search_amazon(product):
    params = {
        "engine": "amazon",
        "k": product,
        "amazon_domain": "amazon.com",
        "api_key": SERPAPI_KEY
    }

    return GoogleSearch(params).get_dict()


# Walmart Search
def search_walmart(product):
    params = {
        "engine": "walmart",
        "query": product,
        "api_key": SERPAPI_KEY
    }

    return GoogleSearch(params).get_dict()


# Ebay Search
def search_ebay(product):
    params = {
        "engine": "ebay",
        "query": product,
        "api_key": SERPAPI_KEY
    }

    return GoogleSearch(params).get_dict()


# Combined Search Function
def search_product(product):

    google_results = search_google(product)
    amazon_results = search_amazon(product)
    walmart_results = search_walmart(product)
    ebay_results = search_ebay(product)

    final_results = {
        "google_shopping": google_results,
        "amazon": amazon_results,
        "walmart": walmart_results,
        "ebay": ebay_results
    }

    return final_results