from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.auth import LoginRequest, TokenResponse, UserProfile
from app.core.security import DEMO_USERS, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest):
    user = DEMO_USERS.get(credentials.email)
    if not user or user["password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    
    token = create_access_token(data={"sub": user["id"], "email": user["email"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": 86400,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "department_id": user["department_id"],
            "station_code": user["station_code"],
        },
    }


@router.get("/me", response_model=UserProfile)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return current_user
