from flask import Flask, request 
from typing import Dict
from google.oauth2 import service_account
import google.generativeai as genai
import googleapiclient.discovery
from dotenv import load_dotenv
import os
from prompt import SYS_INSTRUCT
import json
from flask_cors import CORS, cross_origin
from datetime import datetime
import models

global model
global chat_session
global response


app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = "Content-Type"
load_dotenv()

# Configure Places API
client_secret_file = 'keys/google_places_secret.json'
API_NAME = 'places'
API_VERSION = 'v1'
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

credentials = service_account.Credentials.from_service_account_file(
        client_secret_file, scopes=SCOPES)
service = googleapiclient.discovery.build(API_NAME, API_VERSION, credentials=credentials)


# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  # Configure API key.
model = genai.GenerativeModel(model_name="gemini-2.0-flash", )  # Initialize model.
chat_session = model.start_chat(history=[])  # Start a chat session.

# Construct Plaes API request
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


def process_location_data(location_data: Dict):
    lat = location_data.get('latitude', 0)
    lng = location_data.get('longitude', 0)
    radius = location_data.get('radius', 0)

    return lat, lng, radius


def process_restaurant_data(restaurant_data : Dict) -> str:
    restaurants = models.parse_restaurants_from_json(restaurant_data)
    open_restaurants = models.filter_open_now(restaurants)
    return  models.get_restaurant_info_string(open_restaurants) 


def serialize_response(text):
    """
    Serializes a multi-line prompt string into a dictionary.

    Args:
        text: A multi-line string where the first line is the prompt
              and the following lines are the options.

    Returns:
        A dictionary with the 'prompt' and 'options' keys, or None
        if the input is invalid.
    """
    lines = text.strip().split('\n')
    if len(lines) < 2:  # Need at least a prompt and one option
        return {"answer" : lines[0]}

    prompt = lines[0].strip()
    options = [line.strip() for line in lines[1:]]

    return {"prompt": prompt, "options": options}

@app.route("/initialPrompt",methods=['GET','POST'])
def sendInitial(): 
    response = ""
    try:
        lat, lng, radius = process_location_data(request.json) # process user's selected coordinates 
        request_body = requestContructor(lat, lng, 10000)
        restaurant_data = service.places().searchNearby(
            body = request_body,
            fields = "places.displayName,places.primaryType,places.currentOpeningHours,places.currentOpeningHours,places.editorialSummary,places.location,places.googleMapsUri,places.priceLevel,places.priceRange,places.rating"
        ).execute()        
        
        tod_str = datetime.now().strftime("%H:%M:%S")
        restaurants_str = process_restaurant_data(restaurant_data.get('places', {}))
        final_sys_instruct = SYS_INSTRUCT.format(restaurants=restaurants_str, time_of_day=tod_str)
        response = chat_session.send_message(final_sys_instruct)
        response = serialize_response(response.text)
        print(response)
        print("Gemini:", response) #TODO: remove
    except Exception as e:
        print(f"An error occurred: {e}")
    
    return {"response": response}


@app.route("/processSelection",methods=['GET','POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def processChoice(): ##TODO: add parameter to add in previous choises
    response = ""
    data = request.json
    try:
        response = chat_session.send_message(data["selectedOption"])
        print("parsing to")
        # print(type(response.text))
        print("unsearialise:" , response.text)
        response = serialize_response(response.text)
        print(response)
        print("successful connection")
        print("response")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    print("console output: ", response)
    return {"response": response}
    # return {"test":"Successful"}
    


# Everything will be running on localhost:5000 -> just specify additional part to route to 
# In this case we access post requests
@app.route("/tester", methods=["POST", "GET"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def testFunc():

    data = request.json
    if data is None:
        return {"error": "Invalid JSON format or missing Content-Type header"}, 400
    
    print("Received data:", data["data"])  # Debugging
    return "Processed"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)