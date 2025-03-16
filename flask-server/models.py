import json
from dataclasses import dataclass
from typing import Optional, List
from datetime import datetime


@dataclass
class RestaurantInfo:
    displayName: str
    primaryType: str
    rating: float
    openNow: bool
    weekdayDescription: str
    startPrice: Optional[float]
    endPrice: Optional[float]
    priceLevel: Optional[str]
    editorialSummary: Optional[str]
    longitude: float
    latitude: float
    mapLink: str


def parse_restaurant_json(restaurant_data: dict) -> RestaurantInfo:
    """Parses a single restaurant dictionary and returns a RestaurantInfo object."""
    latitude = restaurant_data["location"]["latitude"]
    longitude = restaurant_data["location"]["longitude"]
    rating = restaurant_data.get('rating', 0)
    map_link = restaurant_data["googleMapsUri"]
    price_level = restaurant_data.get("priceLevel")
    display_name = restaurant_data["displayName"]["text"]
    current_opening_hours = restaurant_data["currentOpeningHours"]
    primary_type = restaurant_data["primaryType"]
    editorial_summary = restaurant_data.get("editorialSummary", {}).get("text")
    price_range = restaurant_data.get("priceRange")

    today = datetime.now()
    index = today.weekday()
    open_now = current_opening_hours.get("openNow", False)
    weekday_description = current_opening_hours.get(
        "weekdayDescriptions",
    )[index]

    start_price = (
        float(price_range["startPrice"]["units"])
        if price_range and price_range.get("startPrice")
        else None
    )
    end_price = (
        float(price_range["endPrice"]["units"])
        if price_range and price_range.get("endPrice")
        else None
    )

    return RestaurantInfo(
        displayName=display_name,
        primaryType=primary_type,
        rating=rating,
        openNow=open_now,
        weekdayDescription=weekday_description,
        startPrice=start_price,
        endPrice=end_price,
        priceLevel=price_level,
        editorialSummary=editorial_summary,
        longitude=longitude,
        latitude=latitude,
        mapLink=map_link,
    )


def parse_restaurants_from_json(json_data: List[dict]) -> List[RestaurantInfo]:
    """Parses a JSON string containing multiple restaurants and returns a list of RestaurantInfo objects."""
    restaurants = []
    for i in range(len(json_data)):
        try:
            restaurant = parse_restaurant_json(json_data[i])
            restaurants.append(restaurant)
        except (KeyError, TypeError, ValueError) as e:
            print(f"Error parsing restaurant {i}: {e}")
            pass

    return restaurants


def filter_open_now(restaurants: List[RestaurantInfo]) -> List[RestaurantInfo]:
    res = []
    for restaurant in restaurants:
        if restaurant.openNow:
            res.append(restaurant)
    return res


def get_restaurant_info_string(restaurants: List[RestaurantInfo]) -> str:
    """
    Formats a list of RestaurantInfo objects into a single string,
    where each restaurant's information is separated by a delimiter.

    Args:
        restaurants: A list of RestaurantInfo objects.

    Returns:
        A single string containing the information for all restaurants.
    """
    all_info = ""
    delimiter = "\n\n"  # Use double newline to separate restaurant info

    for restaurant in restaurants:
        info_string = (
            f"Name: {restaurant.displayName}\n"
            f"Type: {restaurant.primaryType}\n"
            f"Open Now: {'Yes' if restaurant.openNow else 'No'}\n"
            f"Today's Hours: {restaurant.weekdayDescription}\n"
            f"Price Level: {restaurant.priceLevel}\n"
            f"Map Link: {restaurant.mapLink}\n"
            f"Latitude: {restaurant.latitude}\n"
            f"Longitude: {restaurant.longitude}\n"
        )
        if restaurant.editorialSummary:
            info_string += f"Summary: {restaurant.editorialSummary}\n"
        if restaurant.startPrice is not None and restaurant.endPrice is not None:
            info_string += (
                f"Price Range: ${restaurant.startPrice} - ${restaurant.endPrice}\n"
            )

        all_info += info_string + delimiter

    return all_info.rstrip(delimiter)  # Remove trailing delimiter
