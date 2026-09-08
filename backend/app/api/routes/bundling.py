from fastapi import APIRouter, Depends
from app.schemas.bundling import BundlingRequest, BundlingResponse
from app.services.bundling_service import bundling_engine
from app.core.security import get_current_user

router = APIRouter(prefix="/bundling", tags=["5 KM Spatial Bundling"])


@router.post("/generate", response_model=BundlingResponse)
async def generate_bundles(payload: BundlingRequest, current_user: dict = Depends(get_current_user)):
    res = bundling_engine.generate_spatial_bundles(
        section_id=payload.section_id,
        max_dist_km=payload.max_distance_km
    )
    return res
