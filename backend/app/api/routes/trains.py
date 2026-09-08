from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.trains import TrainResponse, TrainPathResponse
from app.db.queries import get_all_trains
from app.core.security import get_current_user

router = APIRouter(prefix="/trains", tags=["Trains & COA Timetable"])


@router.get("", response_model=List[TrainResponse])
async def list_trains(current_user: dict = Depends(get_current_user)):
    trains = get_all_trains()
    return trains


@router.get("/paths", response_model=List[TrainPathResponse])
async def list_train_paths(current_user: dict = Depends(get_current_user)):
    trains = get_all_trains()
    paths = []
    for t in trains:
        paths.append({
            "id": f"path-{t['id']}",
            "train_id": t["id"],
            "train_number": t["train_number"],
            "section_id": "SEC-NDLS-AGC-01",
            "start_km": t.get("start_km", 115.0),
            "end_km": t.get("end_km", 130.0),
            "scheduled_arrival": f"2026-09-07T{t.get('scheduled_arrival', '02:00')}:00Z",
            "scheduled_departure": f"2026-09-07T{t.get('scheduled_departure', '02:10')}:00Z",
            "delay_minutes": t.get("delay_minutes", 0),
        })
    return paths


@router.get("/{train_id}", response_model=TrainResponse)
async def get_train(train_id: str, current_user: dict = Depends(get_current_user)):
    trains = get_all_trains()
    for t in trains:
        if t["id"] == train_id or t["train_number"] == train_id:
            return t
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Train '{train_id}' not found.")
