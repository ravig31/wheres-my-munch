import pandas as pd
from google_api import create_service

client_secret_file = 'client_secret.json'
API_NAME = 'places'
API_VERSION = 'v1'
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

service = create_service(client_secret_file, API_NAME, API_VERSION, SCOPES)

request_body = {
    "includedTypes": "restaurant",
    "locationRestriction": {
        "circle" : {
            "center" : {
                "latitude": -37.8136,
                "longitude": 144.9631
            },
            "radius" : 500
        }
    }   
}

response = service.places().searchNearby(
    body = request_body,
    fields = "*"
).execute()


places_list = response['places']

places_list[0]

df = pd.DataFrame(places_list)
df.to_csv('places_results.csv', index=False)