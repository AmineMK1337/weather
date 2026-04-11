from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.weather import WeatherRecord
from app.schemas.weather import WeatherRecordCreate, WeatherRecordUpdate, WeatherRecordOut

router = APIRouter()


@router.post("/", response_model=WeatherRecordOut, status_code=201)
def create_record(record: WeatherRecordCreate, db: Session = Depends(get_db)):
    db_record = WeatherRecord(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


@router.get("/", response_model=List[WeatherRecordOut])
def get_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(WeatherRecord).offset(skip).limit(limit).all()


@router.get("/{record_id}", response_model=WeatherRecordOut)
def get_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(WeatherRecord).filter(WeatherRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.put("/{record_id}", response_model=WeatherRecordOut)
def update_record(record_id: int, update: WeatherRecordUpdate, db: Session = Depends(get_db)):
    record = db.query(WeatherRecord).filter(WeatherRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    for field, value in update.model_dump(exclude_unset=True).items():
        setattr(record, field, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}", status_code=204)
def delete_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(WeatherRecord).filter(WeatherRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(record)
    db.commit()
