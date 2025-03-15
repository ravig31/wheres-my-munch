from google import genai
from google.genai import types

from dotenv import load_dotenv
from os import getenv

load_dotenv()
GEMINI_TOKEN = getenv("GEMINI_API_KEY")


sys_instruct=""
client = genai.Client(api_key="GEMINI_API_KEY")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    config=types.GenerateContentConfig(
        system_instruction=sys_instruct),
    contents=["your prompt here"]
)