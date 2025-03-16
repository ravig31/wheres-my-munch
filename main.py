from google.oauth2 import service_account
import googleapiclient.discovery
import google.generativeai as genai
from dotenv import load_dotenv
import os
import datetime
import models
from prompt import SYS_INSTRUCT

client_secret_file = 'keys/foodinator_secret.json'
API_NAME = 'places'
API_VERSION = 'v1'
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

credentials = service_account.Credentials.from_service_account_file(
        client_secret_file, scopes=SCOPES)

service = googleapiclient.discovery.build(API_NAME, API_VERSION, credentials=credentials)
time = datetime.datetime.now().strftime("%H:%M:%S")


load_dotenv()  # Load environment variables from .env file.


def requestContructor(lat, lon, radius):
    request_body = {
        "includedPrimaryTypes": [ "cafe", "restaurant", ],
        "rankPreference": "POPULARITY",
        "locationRestriction": {
            "circle": {
                "center" :{
                    "latitude": lat,
                    "longitude": lon
                },
                "radius": radius
            }   
        }
    }
    
    return request_body


def main():
    """Runs a command-line chat interface with the Gemini AI model."""
    request_body = requestContructor( -37.91117, 145.13667, 25000)

    response = service.places().searchNearby(
        body = request_body,
        fields = "places.displayName,places.primaryType,places.currentOpeningHours,places.currentOpeningHours,places.editorialSummary,places.location,places.googleMapsUri,places.priceLevel,places.priceRange,places.rating"
    ).execute()

    restaurants = models.parse_restaurants_from_json(response['places'])
    open_restaurants = models.filter_open_now(restaurants)
    open_restaurants_str = models.get_restaurant_info_string(open_restaurants)

    final_sys_instruct = SYS_INSTRUCT.format(restaurants=open_restaurants_str)
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))  # Configure API key.
    model = genai.GenerativeModel(model_name="gemini-2.0-flash", )  # Initialize model.
    chat_session = model.start_chat(history=[])  # Start a chat session.
    response = chat_session.send_message(final_sys_instruct)
    print(response.text)

    choice = 0
    while True:
        if choice == 5:
            break

        user_input = input("You: ")
        if user_input.lower() == "exit":
            break

        try:
            response = chat_session.send_message(user_input)
            print("Gemini:", response.text)
        except Exception as e:
            print(f"An error occurred: {e}")

        choice += 1

if __name__ == "__main__":
    main()