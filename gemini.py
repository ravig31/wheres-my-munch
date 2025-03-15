from google import genai

from dotenv import load_dotenv
from os import getenv

load_dotenv()
GEMINI_TOKEN = getenv("GEMINI_API_TOKEN")
client = genai.Client(api_key="YOUR_API_KEY")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="Explain how AI works",
)

print(response.text)
