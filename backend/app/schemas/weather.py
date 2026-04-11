from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime


class WeatherRecordCreate(BaseModel):
    location: str
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    temperature: Optional[float] = None
    feels_like: Optional[float] = None
    humidity: Optional[int] = None
    wind_speed: Optional[float] = None
    weather_condition: Optional[str] = None
    weather_icon: Optional[str] = None
    ai_summary: Optional[str] = None
    raw_data: Optional[Any] = None


class WeatherRecordUpdate(BaseModel):
    location: Optional[str] = None
    temperature: Optional[float] = None
    humidity: Optional[int] = None
    wind_speed: Optional[float] = None
    weather_condition: Optional[str] = None
    ai_summary: Optional[str] = None


class WeatherRecordOut(WeatherRecordCreate):
    id: int
    queried_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CurrentWeatherQuery(BaseModel):
    location: str
    units: Optional[str] = "metric"


class ForecastQuery(BaseModel):
    location: str
    days: Optional[int] = 5
    units: Optional[str] = "metric"
