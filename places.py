import pandas as pd
from google.oauth2 import service_account
import googleapiclient.discovery

client_secret_file = 'foodinator_secret.json'
API_NAME = 'places'
API_VERSION = 'v1'
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

credentials = service_account.Credentials.from_service_account_file(
        client_secret_file, scopes=SCOPES)

service = googleapiclient.discovery.build(API_NAME, API_VERSION, credentials=credentials)


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