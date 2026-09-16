from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.tms import TMSMessageCreate, TMSMessageUpdate, TMSMessageResponse
from app.controllers.tms_controller import tms_controller
from app.core.security import get_current_user

router = APIRouter(prefix="/tms", tags=["TMS — Track Management System Feed"])


@router.get("/feed", response_model=List[TMSMessageResponse])
async def get_tms_feed(
    priority: Optional[str] = None,
    status_filter: Optional[str] = None,
    section: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    return tms_controller.get_tms_feed(priority=priority, status=status_filter, section=section, search=search)


@router.post("/feed", response_model=TMSMessageResponse, status_code=status.HTTP_201_CREATED)
async def post_tms_message(
    payload: TMSMessageCreate,
    current_user: dict = Depends(get_current_user)
):
    data = payload.model_dump()
    return tms_controller.process_tms_ingestion(data)


@router.get("/feed/{message_id}", response_model=TMSMessageResponse)
async def get_tms_message(
    message_id: str,
    current_user: dict = Depends(get_current_user)
):
    msg = tms_controller.get_tms_message(message_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"TMS message '{message_id}' not found.")
    return msg


@router.patch("/feed/{message_id}", response_model=TMSMessageResponse)
async def update_tms_message(
    message_id: str,
    payload: TMSMessageUpdate,
    current_user: dict = Depends(get_current_user)
):
    msg = tms_controller.get_tms_message(message_id)
    if not msg:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"TMS message '{message_id}' not found.")
    
    new_status = payload.status or msg.get("status", "NEW")
    updated = tms_controller.update_tms_message(message_id, new_status, payload.priority)
    return updated or msg
