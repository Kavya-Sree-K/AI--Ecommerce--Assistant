from tools.serp_shopping import (
    search_google,
    search_amazon,
    search_walmart,
    search_ebay
)

product = "iphone 15 pro"

print("\nGOOGLE")
print(search_google(product))

print("\nAMAZON")
print(search_amazon(product))

print("\nWALMART")
print(search_walmart(product))

print("\nEBAY")
print(search_ebay(product))
