from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Dict, Any
from app.core.security import get_current_user

router = APIRouter(prefix="/appearance", tags=["Appearance & Theme Settings"])


class AppearancePreferences(BaseModel):
    theme: str = "light"  # light | dark | system
    density: str = "comfortable"  # comfortable | compact
    font_size: str = "medium"  # small | medium | large
    sidebar_state: str = "expanded"  # expanded | collapsed
    animations: str = "enabled"  # enabled | reduced
    map_style: str = "standard"  # standard | satellite | dark


USER_APPEARANCE_STORE: Dict[str, Dict[str, Any]] = {}


@router.get("", response_model=AppearancePreferences)
async def get_appearance_settings(current_user: dict = Depends(get_current_user)):
    uid = current_user.get("id", "default")
    stored = USER_APPEARANCE_STORE.get(uid, {
        "theme": "light",
        "density": "comfortable",
        "font_size": "medium",
        "sidebar_state": "expanded",
        "animations": "enabled",
        "map_style": "standard",
    })
    return AppearancePreferences(**stored)


@router.post("", response_model=AppearancePreferences)
async def update_appearance_settings(
    payload: AppearancePreferences,
    current_user: dict = Depends(get_current_user)
):
    uid = current_user.get("id", "default")
    USER_APPEARANCE_STORE[uid] = payload.model_dump()
    return payload
