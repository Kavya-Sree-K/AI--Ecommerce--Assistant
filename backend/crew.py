from crewai import Crew
from agents import product_agent, youtube_agent, news_agent
from tasks import product_task, youtube_task, news_task

crew = Crew(
    agents=[
        product_agent,
        youtube_agent,
        news_agent
    ],
    tasks=[
        product_task,
        youtube_task,
        news_task
    ],
    verbose=True
)