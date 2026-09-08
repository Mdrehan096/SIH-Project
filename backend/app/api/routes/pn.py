from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.pn import PNGenerateRequest, PNVerifyRequest, PNResponse
from app.services.pn_service import pn_service
from app.core.security import get_current_user, require_roles
from app.core.constants import ROLE_CONTROLLER, ROLE_STATION_MASTER, ROLE_ADMIN

router = APIRouter(prefix="/pn", tags=["Digital Private Number (PN)"])


@router.post("/generate", response_model=PNResponse)
async def generate_pn(
    payload: PNGenerateRequest,
    current_user: dict = Depends(require_roles([ROLE_CONTROLLER, ROLE_ADMIN]))
):
    res = pn_service.generate_pn(
        block_id=payload.block_id,
        user_name=current_user.get("full_name", "Section Controller")
    )
    return res


@router.post("/verify", response_model=PNResponse)
async def verify_pn(
    payload: PNVerifyRequest,
    current_user: dict = Depends(require_roles([ROLE_STATION_MASTER, ROLE_ADMIN]))
):
    res = pn_service.verify_pn(
        block_id=payload.block_id,
        pn_code=payload.pn_code,
        station_code=payload.station_code,
        user_name=current_user.get("full_name", "Station Master")
    )
    return res


@router.get("/{block_id}", response_model=PNResponse)
async def get_pn_status(block_id: str, current_user: dict = Depends(get_current_user)):
    res = pn_service.get_pn_status(block_id)
    return res
