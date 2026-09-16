from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.smms import SMMSMessageCreate, SMMSMessageUpdate, SMMSMessageResponse
from app.controllers.smms_controller import smms_controller
from app.core.security import get_current_user

router = APIRouter(prefix="/smms", tags=["SMMS — Electrical & Signal/Telecom Feed"])


@router.get("/feed", response_model=List[SMMSMessageResponse])
async def get_smms_feed(
    department: Optional[str] = None,
    severity: Optional[str] = None,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    return smms_controller.get_smms_feed(department=department, severity=severity, status=status_filter, search=search)


@router.post("/feed", response_model=SMMSMessageResponse, status_code=status.HTTP_201_CREATED)
async def post_smms_message(
    payload: SMMSMessageCreate,
    current_user: dict = Depends(get_current_user)
):
    data = payload.model_dump()
    return smms_controller.process_smms_ingestion(data)


@router.get("/feed/{message_id}", response_model=SMMSMessageResponse)
async def get_smms_message(
    message_id: str,
    current_user: dict = Depends(get_current_user)
):
    msg = smms_controller.get_smms_message(message_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"SMMS message '{message_id}' not found.")
    return msg


@router.patch("/feed/{message_id}", response_model=SMMSMessageResponse)
async def update_smms_message(
    message_id: str,
    payload: SMMSMessageUpdate,
    current_user: dict = Depends(get_current_user)
):
    msg = smms_controller.get_smms_message(message_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"SMMS message '{message_id}' not found.")
    
    new_status = payload.status or msg.get("status", "NEW")
    updated = smms_controller.update_smms_message(message_id, new_status, payload.severity)
    return updated or msg
