from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List
from app.core.security import get_current_user, DEMO_USERS
from app.core.permissions import require_permission, PERM_MANAGE_SYSTEM, PERM_MANAGE_USERS

router = APIRouter(prefix="/admin", tags=["Admin Dashboard & System Management"])


@router.get("/metrics", response_model=Dict[str, Any])
async def get_admin_metrics(current_user: dict = Depends(get_current_user)):
    return {
        "total_users": 120,
        "active_users": 114,
        "inactive_users": 6,
        "total_trains": 1200,
        "total_stations": 850,
        "total_assets": 5000,
        "total_maintenance_tasks": 10000,
        "total_blocks": 3000,
        "critical_risks": 14,
        "system_health": "100% OPERATIONAL",
    }


@router.get("/users", response_model=List[Dict[str, Any]])
async def list_admin_users(current_user: dict = Depends(get_current_user)):
    user_list = []
    for email, u in DEMO_USERS.items():
        user_list.append({
            "id": u["id"],
            "email": u["email"],
            "full_name": u["full_name"],
            "role": u["role"],
            "department_id": u["department_id"],
            "zone": u.get("zone", "NR"),
            "division": u.get("division", "Delhi Division"),
            "employee_id": u.get("employee_id", "IR-001"),
            "is_active": True,
        })
    return user_list


@router.get("/system", response_model=Dict[str, Any])
async def get_system_diagnostics(current_user: dict = Depends(get_current_user)):
    return {
        "database_engine": "Supabase PostgreSQL / High-Performance Memory Fallback",
        "api_version": "v1.0.0",
        "solver_engine": "Google OR-Tools CP-SAT 9.9",
        "risk_ml_model": "Scikit-Learn Random Forest 1.4",
        "active_connections": 24,
        "cpu_utilization_percent": 14.2,
        "memory_usage_mb": 312.4,
        "uptime_seconds": 86400,
    }
