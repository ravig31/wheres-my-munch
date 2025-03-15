import pandas as pd
import csv
import models
from pprint import pprint
import json
from google.oauth2 import service_account
import googleapiclient.discovery

client_secret_file = 'keys/foodinator_secret.json'
API_NAME = 'places'
API_VERSION = 'v1'
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

credentials = service_account.Credentials.from_service_account_file(
        client_secret_file, scopes=SCOPES)

service = googleapiclient.discovery.build(API_NAME, API_VERSION, credentials=credentials)


def requestContructor(lat, lon, radius):
    request_body = {
        "includedPrimaryTypes": [ "cafe", "restaurant"],
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


request_body = requestContructor( -37.91117, 145.13667, 25000)

response = service.places().searchNearby(
    body = request_body,
    fields = "places.displayName,places.primaryType,places.currentOpeningHours,places.currentOpeningHours,places.editorialSummary,places.location,places.googleMapsUri,places.priceLevel,places.priceRange"
).execute()

restaurants = models.parse_restaurants_from_json(response['places'])



response = 1