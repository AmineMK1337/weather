import os
import httpx
import re
from typing import Optional, Dict, Any
from google import genai

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"


def parse_location(location: str) -> Dict[str, Any]:
    """Parse location string and return appropriate API parameters.
    
    Supports:
    - City name: "New York" or "Berlin, Germany"
    - Coordinates: "36.88987,10.16907" (lat,lon)
    
    Returns dict with 'param_type' and the actual parameters.
    """
    # Check if it looks like coordinates (number,number)
    coord_pattern = r'^[-+]?\d+\.?\d*\s*,\s*[-+]?\d+\.?\d*$'
    if re.match(coord_pattern, location.strip()):
        try:
            parts = location.split(',')
            lat = float(parts[0].strip())
            lon = float(parts[1].strip())
            return {
                "param_type": "coords",
                "params": {"lat": lat, "lon": lon}
            }
        except (ValueError, IndexError):
            pass
    
    # Otherwise treat as city name/query
    return {
        "param_type": "city",
        "params": {"q": location}
    }


async def get_current_weather(location: str, units: str = "metric") -> dict:
    location_info = parse_location(location)
    params = {**location_info["params"], "appid": OPENWEATHER_API_KEY, "units": units}
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{BASE_URL}/weather",
            params=params,
        )
        resp.raise_for_status()
        data = resp.json()

    result = {
        "location": data["name"],
        "country": data["sys"]["country"],
        "latitude": data["coord"]["lat"],
        "longitude": data["coord"]["lon"],
        "temperature": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "weather_condition": data["weather"][0]["description"],
        "weather_icon": data["weather"][0]["icon"],
        "pressure": data["main"]["pressure"],
        "visibility": data.get("visibility", 0),
        "raw_data": data,
    }
    result["ai_summary"] = await generate_ai_summary(result)
    return result


async def get_forecast(location: str, days: int = 5, units: str = "metric") -> dict:
    location_info = parse_location(location)
    params = {**location_info["params"], "appid": OPENWEATHER_API_KEY, "units": units, "cnt": days * 8}
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{BASE_URL}/forecast",
            params=params,
        )
        resp.raise_for_status()
        data = resp.json()

    daily = {}
    for item in data["list"]:
        date = item["dt_txt"].split(" ")[0]
        if date not in daily:
            daily[date] = {
                "date": date,
                "temp_min": item["main"]["temp_min"],
                "temp_max": item["main"]["temp_max"],
                "humidity": item["main"]["humidity"],
                "condition": item["weather"][0]["description"],
                "icon": item["weather"][0]["icon"],
                "hourly": [],
            }
        daily[date]["temp_min"] = min(daily[date]["temp_min"], item["main"]["temp_min"])
        daily[date]["temp_max"] = max(daily[date]["temp_max"], item["main"]["temp_max"])
        daily[date]["hourly"].append({
            "time": item["dt_txt"].split(" ")[1][:5],
            "temp": item["main"]["temp"],
            "condition": item["weather"][0]["description"],
            "icon": item["weather"][0]["icon"],
        })

    return {
        "location": data["city"]["name"],
        "country": data["city"]["country"],
        "forecast": list(daily.values())[:days],
    }


async def generate_ai_summary(weather_data: dict) -> str:
    """Generate AI-powered weather summary and recommendations using Gemini."""
    try:
        client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
        prompt = f"""
        Given this weather data for {weather_data['location']}, {weather_data['country']}:
        - Temperature: {weather_data['temperature']}°C (feels like {weather_data['feels_like']}°C)
        - Condition: {weather_data['weather_condition']}
        - Humidity: {weather_data['humidity']}%
        - Wind: {weather_data['wind_speed']} m/s

        Write a concise 2-sentence weather summary with practical clothing/activity recommendations.
        Be friendly and helpful. Example style: "Expect mild temperatures with partly cloudy skies today.
        A light jacket is recommended, and it's a great day for outdoor activities."
        """
        response = await client.aio.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gemini Error: {e}")
        return f"Currently {weather_data['weather_condition']} in {weather_data['location']} with a temperature of {weather_data['temperature']}°C."
