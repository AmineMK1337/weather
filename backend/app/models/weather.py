from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base


class WeatherRecord(Base):
    __tablename__ = "weather_records"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, nullable=False)
    country = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    temperature = Column(Float)
    feels_like = Column(Float)
    humidity = Column(Integer)
    wind_speed = Column(Float)
    weather_condition = Column(String)
    weather_icon = Column(String)
    ai_summary = Column(String)
    raw_data = Column(JSON)
    queried_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
