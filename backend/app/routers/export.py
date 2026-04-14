from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, StreamingResponse, PlainTextResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.weather import WeatherRecord
from pathlib import Path
import csv
import io
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Image, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors

router = APIRouter()
PM_ACCELERATOR_LINK = "https://www.linkedin.com/school/pmaccelerator/"
PM_ACCELERATOR_LOGO = Path(__file__).resolve().parents[1] / "assets" / "pm-accelerator-logo.jpg"


def get_all_records(db: Session):
    return db.query(WeatherRecord).all()


@router.get("/json")
def export_json(db: Session = Depends(get_db)):
    records = get_all_records(db)
    data = [
        {
            "id": r.id,
            "location": r.location,
            "country": r.country,
            "temperature": r.temperature,
            "humidity": r.humidity,
            "wind_speed": r.wind_speed,
            "weather_condition": r.weather_condition,
            "ai_summary": r.ai_summary,
            "queried_at": str(r.queried_at),
        }
        for r in records
    ]
    return JSONResponse(content=data)


@router.get("/csv")
def export_csv(db: Session = Depends(get_db)):
    records = get_all_records(db)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Location", "Country", "Temp (°C)", "Humidity (%)", "Wind (m/s)", "Condition", "AI Summary", "Queried At"])
    for r in records:
        writer.writerow([r.id, r.location, r.country, r.temperature, r.humidity, r.wind_speed, r.weather_condition, r.ai_summary, r.queried_at])
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=weather_records.csv"},
    )


@router.get("/pdf")
def export_pdf(db: Session = Depends(get_db)):
    records = get_all_records(db)
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = [Paragraph("Weather Records Export", styles["Title"]), Spacer(1, 10)]

    if PM_ACCELERATOR_LOGO.exists():
        elements.append(Image(str(PM_ACCELERATOR_LOGO), width=180, height=90))
        elements.append(Spacer(1, 6))

    elements.append(
        Paragraph(
            "PM Accelerator supports PM professionals from aspiring talent to product leaders.",
            styles["BodyText"],
        )
    )
    elements.append(
        Paragraph(
            f'LinkedIn: <a href="{PM_ACCELERATOR_LINK}" color="blue">{PM_ACCELERATOR_LINK}</a>',
            styles["BodyText"],
        )
    )
    elements.append(Spacer(1, 12))

    table_data = [["ID", "Location", "Country", "Temp", "Humidity", "Wind", "Condition"]]
    for r in records:
        table_data.append([str(r.id), r.location or "", r.country or "", f"{r.temperature}°C", f"{r.humidity}%", f"{r.wind_speed} m/s", r.weather_condition or ""])
    table = Table(table_data)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
    ]))
    elements.append(table)
    doc.build(elements)
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=weather_records.pdf"},
    )


@router.get("/md")
def export_markdown(db: Session = Depends(get_db)):
    records = get_all_records(db)
    lines = ["# Weather Records Export\n", "| ID | Location | Country | Temp | Humidity | Wind | Condition | Queried At |", "|---|---|---|---|---|---|---|---|"]
    for r in records:
        lines.append(f"| {r.id} | {r.location} | {r.country} | {r.temperature}°C | {r.humidity}% | {r.wind_speed} m/s | {r.weather_condition} | {r.queried_at} |")
    return PlainTextResponse("\n".join(lines), headers={"Content-Disposition": "attachment; filename=weather_records.md"})
