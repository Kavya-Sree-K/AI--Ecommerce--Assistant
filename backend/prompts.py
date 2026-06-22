product_prompt = """
Use ONLY the shopping_data provided.

STRICT RULES:
1. Do NOT add assumptions.
2. Do NOT create imaginary products.
3. Do NOT infer missing values.
4. If data is missing, write "Not Available".
5. Pick only from provided shopping_data.


Return EXACTLY in this format:

Best Product:
Name: ...
Marketplace: ...
Rating: ...
Reviews: ...
Best Price: ...
Recommendation: ...
"""


youtube_prompt = """
Use ONLY youtube_data provided.

STRICT RULES:
1. Only extract available video links.
2. Do NOT summarize.
3. Do NOT generate opinions.

Return top 5 video links only.
"""


news_prompt = """
Use ONLY news_data provided.

STRICT RULES:
1. Do NOT add assumptions.
2. Do NOT create market trends on your own.
3. Do NOT infer stock market impact.
4. Do NOT generate opportunities or risks unless explicitly present.
5. If data missing, write "Not Available".

Return EXACTLY:

Executive Summary:
...

Latest News Highlights:
...

Market Trends:
...

Competitive Analysis:
...

Stock Market Impact:
...

Opportunities:
...

Risks:
...

Final Verdict:
...
"""