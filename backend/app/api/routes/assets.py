from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.assets import AssetResponse
from app.db.queries import get_all_assets, get_asset_by_id
from app.core.security import get_current_user

router = APIRouter(prefix="/assets", tags=["Railway Assets"])


@router.get("", response_model=List[AssetResponse])
async def list_assets(current_user: dict = Depends(get_current_user)):
    return get_all_assets()


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(asset_id: str, current_user: dict = Depends(get_current_user)):
    asset = get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Asset '{asset_id}' not found.")
    return asset
