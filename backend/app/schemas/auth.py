from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400
    user: dict


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    department_id: Optional[str] = None
    station_code: Optional[str] = None
