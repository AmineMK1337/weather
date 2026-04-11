from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import weather, records, export
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Weather App API",
    description="Full-stack Weather Application REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(weather.router, prefix="/weather", tags=["Weather"])
app.include_router(records.router, prefix="/records", tags=["Records"])
app.include_router(export.router, prefix="/export", tags=["Export"])


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Weather App API is running", "docs": "/docs"}
