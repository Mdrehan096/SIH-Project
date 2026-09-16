from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.coa import COARouteResponse, COATrainResponse, COATrainUpdatePayload
from app.controllers.coa_controller import coa_controller
from app.core.security import get_current_user

router = APIRouter(prefix="/coa", tags=["COA — Control Office Application Train Operations"])


@router.get("/routes", response_model=List[COARouteResponse])
async def get_coa_routes(current_user: dict = Depends(get_current_user)):
    return coa_controller.get_routes()


@router.get("/trains", response_model=List[COATrainResponse])
async def get_coa_trains(
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    return coa_controller.get_trains(status=status_filter, search=search)


@router.get("/trains/{train_id}")
async def get_coa_train_details(
    train_id: str,
    current_user: dict = Depends(get_current_user)
):
    details = coa_controller.get_train_details(train_id)
    if not details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"COA train '{train_id}' not found.")
    return details


@router.post("/feed", response_model=COATrainResponse)
async def post_coa_feed_update(
    payload: COATrainUpdatePayload,
    current_user: dict = Depends(get_current_user)
):
    data = payload.model_dump(exclude_unset=True)
    return coa_controller.process_coa_feed_update(data)
