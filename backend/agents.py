from crewai import Agent
from config import llm


product_agent = Agent(
    role="Senior Product Recommendation Expert",
    goal="""
Find the best product from shopping results
and provide factual recommendations only.
""",
    backstory="""
You are an expert ecommerce analyst.
You compare products from multiple marketplaces
and recommend the best one for users.
""",
    verbose=True,
    llm=llm,
    max_iter=1
)


youtube_agent = Agent(
    role="Senior YouTube Review Expert",
    goal="""
Find top product review videos from YouTube
and provide best review links.
""",
    backstory="""
You are an expert in analyzing product review videos
and finding the most useful reviews for customers.
""",
    verbose=True,
    llm=llm,
    max_iter=1
)


news_agent = Agent(
    role="Senior Market Intelligence Expert",
    goal="""
Analyze latest product market news
and provide only factual summaries.
""",
    backstory="""
You are a market research expert.
You summarize product-related news
without adding assumptions.
""",
    verbose=True,
    llm=llm,
    max_iter=1
)