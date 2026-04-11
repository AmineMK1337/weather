import os
import httpx
from typing import Optional
import anthropic

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"


async def get_current_weather(location: str, units: str = "metric") -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{BASE_URL}/weather",
            params={"q": location, "appid": OPENWEATHER_API_KEY, "units": units},
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
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{BASE_URL}/forecast",
            params={"q": location, "appid": OPENWEATHER_API_KEY, "units": units, "cnt": days * 8},
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
    """Generate AI-powered weather summary and recommendations using Claude."""
    try:
        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
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
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=150,
            messages=[{"role": "user", "content": prompt}],
        )
        return message.content[0].text
    except Exception:
        return f"Currently {weather_data['weather_condition']} in {weather_data['location']} with a temperature of {weather_data['temperature']}°C."
