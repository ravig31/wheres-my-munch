from dataclasses import dataclass

@dataclass
class RestaurantInfo:
    diplayName: str 
    primaryType: str
    openNow: str
    openTime: str
    closeTime: str
    description: str
    longitude: str
    latitude: str
    mapLink: str

