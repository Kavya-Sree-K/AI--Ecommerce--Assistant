from config import llm

response = llm.invoke(
    "What is Artificial Intelligence?"
)

print(response.content)