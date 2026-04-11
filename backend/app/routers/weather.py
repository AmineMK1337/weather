from fastapi import APIRouter, HTTPException, Query
from app.services.weather_service import get_current_weather, get_forecast

router = APIRouter()


@router.get("/current")
async def current_weather(
    location: str = Query(..., description="City name, ZIP code, or coordinates"),
    units: str = Query("metric", description="Units: metric, imperial, standard"),
):
    try:
        return await get_current_weather(location, units)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/forecast")
async def weather_forecast(
    location: str = Query(..., description="City name, ZIP code, or coordinates"),
    days: int = Query(5, ge=1, le=10, description="Number of forecast days"),
    units: str = Query("metric", description="Units: metric, imperial, standard"),
):
    try:
        return await get_forecast(location, days, units)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
