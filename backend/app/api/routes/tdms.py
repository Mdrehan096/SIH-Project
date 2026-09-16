from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.tdms import TDMSDefectCreate, TDMSDefectUpdate, TDMSDefectResponse
from app.controllers.tdms_controller import tdms_controller
from app.core.security import get_current_user

router = APIRouter(prefix="/tdms", tags=["TDMS — Track Defect Management System Feed"])


@router.get("/feed", response_model=List[TDMSDefectResponse])
async def get_tdms_feed(
    severity: Optional[str] = None,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    return tdms_controller.get_tdms_feed(severity=severity, status=status_filter, search=search)


@router.post("/feed", response_model=TDMSDefectResponse, status_code=status.HTTP_201_CREATED)
async def post_tdms_defect(
    payload: TDMSDefectCreate,
    current_user: dict = Depends(get_current_user)
):
    data = payload.model_dump()
    return tdms_controller.process_tdms_ingestion(data)


@router.get("/feed/{message_id}", response_model=TDMSDefectResponse)
async def get_tdms_defect(
    message_id: str,
    current_user: dict = Depends(get_current_user)
):
    defect = tdms_controller.get_tdms_defect(message_id)
    if not defect:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"TDMS defect '{message_id}' not found.")
    return defect


@router.patch("/feed/{message_id}", response_model=TDMSDefectResponse)
async def update_tdms_defect(
    message_id: str,
    payload: TDMSDefectUpdate,
    current_user: dict = Depends(get_current_user)
):
    defect = tdms_controller.get_tdms_defect(message_id)
    if not defect:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"TDMS defect '{message_id}' not found.")
    
    new_status = payload.status or defect.get("status", "OPEN")
    updated = tdms_controller.update_tdms_defect(message_id, new_status, payload.severity)
    return updated or defect
