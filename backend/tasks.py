from crewai import Task
from agents import product_agent, youtube_agent, news_agent


product_task = Task(
    description="""
Product Name: {product}

Shopping Data:
{shopping_data}

STRICT RULES:

1. Use ONLY shopping_data.
2. Do NOT hallucinate.
3. Compare Google, Amazon, Walmart, Ebay.
4. Select best product based on:
    1. If rating exists → use rating
    2. If reviews exist → use reviews
    3. If price exists → use price
    4. If some fields missing, still extract available fields
    5. Never write "Not Available" if field exists in shopping_data
    6. Read price, rating, reviews from all marketplaces carefully
5. If product title does not match user product exactly, ignore it.
6. If no exact match found, return "No such products found".
Return EXACTLY in this format:

Best Product:
<Name>

Rating:
<Value>

Marketplace:
<Value>

Reviews:
<Value>

Best Price:
<Value>

Recommendation:
<Why this product is best based ONLY on provided shopping data>
""",
    expected_output="Structured product recommendation",
    agent=product_agent
)


youtube_task = Task(
    description="""
Product Name: {product}

Youtube Data:
{youtube_data}

Return top 5 review video links only.
""",
    expected_output="Top 5 youtube links",
    agent=youtube_agent
)


news_task = Task(
    description="""
Product Name: {product}

News Data:
{news_data}

STRICT RULES:
Use ONLY provided news_data.
If no data exists, write "Not Available"

Return EXACTLY:

Executive Summary:
Latest News Highlights:
Market Trends:
Competitive Analysis:
Stock Market Impact:
Opportunities:
Risks:
Final Verdict:
""",
    expected_output="Structured news analysis",
    agent=news_agent
)