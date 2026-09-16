import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, List
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from app.core.config import settings
from app.core.constants import ROLE_ADMIN, ROLE_CONTROLLER, ROLE_STATION_MASTER, ROLE_ENGINEER

logger = logging.getLogger("retrack.security")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)


class TokenData(BaseModel):
    user_id: str
    email: str
    role: str


# Pre-configured demo users for quick hackathon and government portal authentication
DEMO_USERS = {
    "admin@retrack.gov.in": {
        "id": "00000000-0000-0000-0000-000000000001",
        "email": "admin@retrack.gov.in",
        "full_name": "Chief Operations Admin (IRHQ)",
        "role": "SUPER_ADMIN",
        "password": "admin123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-SUPER-001",
        "station_code": "HQ-NDLS",
    },
    "zoneadmin@retrack.gov.in": {
        "id": "00000000-0000-0000-0000-000000000002",
        "email": "zoneadmin@retrack.gov.in",
        "full_name": "Zonal Principal Chief Engineer (NR)",
        "role": "ZONE_ADMIN",
        "password": "zone123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-ZONE-102",
        "station_code": "NR-HQ",
    },
    "officer@retrack.gov.in": {
        "id": "00000000-0000-0000-0000-000000000003",
        "email": "officer@retrack.gov.in",
        "full_name": "Senior Divisional Operations Manager",
        "role": "DIVISION_ADMIN",
        "password": "officer123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-OFF-204",
        "station_code": "NDLS",
    },
    "engineer@retrack.gov.in": {
        "id": "00000000-0000-0000-0000-000000000004",
        "email": "engineer@retrack.gov.in",
        "full_name": "Senior Track & P-Way Engineer",
        "role": "ENGINEER",
        "password": "engineer123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-ENG-308",
        "station_code": "MT-120",
    },
    "viewer@retrack.gov.in": {
        "id": "00000000-0000-0000-0000-000000000005",
        "email": "viewer@retrack.gov.in",
        "full_name": "Auditor & Operations Inspector",
        "role": "VIEWER",
        "password": "viewer123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-VW-401",
        "station_code": "NDLS",
    },
    "controller@railsync.ir": {
        "id": "00000000-0000-0000-0000-000000000006",
        "email": "controller@railsync.ir",
        "full_name": "Section Controller (NDLS-AGC)",
        "role": ROLE_CONTROLLER,
        "password": "controller123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-CNTRL-002",
        "station_code": "CNTRL-NDLS",
    },
    "stationmaster@railsync.ir": {
        "id": "00000000-0000-0000-0000-000000000007",
        "email": "stationmaster@railsync.ir",
        "full_name": "Station Master (New Delhi)",
        "role": ROLE_STATION_MASTER,
        "password": "station123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-SM-003",
        "station_code": "NDLS",
    },
    "admin@retrack.demo": {
        "id": "00000000-0000-0000-0000-000000000001",
        "email": "admin@retrack.demo",
        "full_name": "Chief Operations Admin (IRHQ)",
        "role": "SUPER_ADMIN",
        "password": "admin123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-SUPER-001",
        "station_code": "HQ-NDLS",
    },
    "zoneadmin@retrack.demo": {
        "id": "00000000-0000-0000-0000-000000000002",
        "email": "zoneadmin@retrack.demo",
        "full_name": "Zonal Principal Chief Engineer (NR)",
        "role": "ZONE_ADMIN",
        "password": "zone123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-ZONE-102",
        "station_code": "NR-HQ",
    },
    "divisionadmin@retrack.demo": {
        "id": "00000000-0000-0000-0000-000000000003",
        "email": "divisionadmin@retrack.demo",
        "full_name": "Senior Divisional Operations Manager",
        "role": "DIVISION_ADMIN",
        "password": "officer123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-OFF-204",
        "station_code": "NDLS",
    },
    "planner@retrack.demo": {
        "id": "00000000-0000-0000-0000-000000000008",
        "email": "planner@retrack.demo",
        "full_name": "Chief Maintenance Planner",
        "role": "PLANNER",
        "password": "planner123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-PLN-501",
        "station_code": "NDLS",
    },
    "engineer@retrack.demo": {
        "id": "00000000-0000-0000-0000-000000000004",
        "email": "engineer@retrack.demo",
        "full_name": "Senior Track & P-Way Engineer",
        "role": "ENGINEER",
        "password": "engineer123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-ENG-308",
        "station_code": "MT-120",
    },
    "viewer@retrack.demo": {
        "id": "00000000-0000-0000-0000-000000000005",
        "email": "viewer@retrack.demo",
        "full_name": "Auditor & Operations Inspector",
        "role": "VIEWER",
        "password": "viewer123",
        "department_id": "CIVIL",
        "zone": "NR",
        "division": "Delhi Division",
        "employee_id": "IR-VW-401",
        "station_code": "NDLS",
    },
}


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[TokenData]:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        role: str = payload.get("role")
        if user_id is None or email is None:
            return None
        return TokenData(user_id=user_id, email=email, role=role)
    except Exception as e:
        logger.warning(f"Failed to decode token: {e}")
        return None


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> dict:
    if not token:
        # Fallback to default controller role for quick unauthenticated hackathon testing
        return DEMO_USERS["controller@railsync.ir"]
    token_data = decode_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    for u in DEMO_USERS.values():
        if u["email"] == token_data.email:
            return u
    return {
        "id": token_data.user_id,
        "email": token_data.email,
        "full_name": "Railway Controller",
        "role": token_data.role or ROLE_CONTROLLER,
        "department_id": "CIVIL",
        "station_code": "NDLS",
    }


def require_roles(allowed_roles: List[str]):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in allowed_roles and current_user.get("role") != ROLE_ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.get('role')}' does not have permission to access this resource.",
            )
        return current_user

    return role_checker
