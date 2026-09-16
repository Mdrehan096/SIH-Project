import logging
from typing import List, Dict, Set
from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user
from app.core.constants import (
    ROLE_SUPER_ADMIN,
    ROLE_ZONE_ADMIN,
    ROLE_DIVISION_ADMIN,
    ROLE_RAILWAY_OFFICER,
    ROLE_ADMIN,
    ROLE_CONTROLLER,
    ROLE_STATION_MASTER,
    ROLE_ENGINEER,
    ROLE_TRACTION_OFFICER,
    ROLE_SIGNAL_TELECOM_OFFICER,
    ROLE_MAINTENANCE_MANAGER,
    ROLE_PLANNER,
    ROLE_FIELD_OFFICER,
    ROLE_VIEWER,
)

logger = logging.getLogger("retrack.permissions")

# Fine-Grained Permissions
PERM_VIEW = "VIEW"
PERM_CREATE = "CREATE"
PERM_UPDATE = "UPDATE"
PERM_DELETE = "DELETE"
PERM_APPROVE = "APPROVE"
PERM_REJECT = "REJECT"
PERM_EXPORT = "EXPORT"
PERM_MANAGE_USERS = "MANAGE_USERS"
PERM_MANAGE_SYSTEM = "MANAGE_SYSTEM"
PERM_VIEW_AUDIT_LOGS = "VIEW_AUDIT_LOGS"

# Role Permission Matrix
ROLE_PERMISSIONS_MAP: Dict[str, Set[str]] = {
    ROLE_SUPER_ADMIN: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE, PERM_DELETE, PERM_APPROVE,
        PERM_REJECT, PERM_EXPORT, PERM_MANAGE_USERS, PERM_MANAGE_SYSTEM, PERM_VIEW_AUDIT_LOGS
    },
    ROLE_ADMIN: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE, PERM_DELETE, PERM_APPROVE,
        PERM_REJECT, PERM_EXPORT, PERM_MANAGE_USERS, PERM_MANAGE_SYSTEM, PERM_VIEW_AUDIT_LOGS
    },
    ROLE_ZONE_ADMIN: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE, PERM_APPROVE, PERM_REJECT,
        PERM_EXPORT, PERM_VIEW_AUDIT_LOGS
    },
    ROLE_DIVISION_ADMIN: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE, PERM_APPROVE, PERM_REJECT,
        PERM_EXPORT, PERM_VIEW_AUDIT_LOGS
    },
    ROLE_MAINTENANCE_MANAGER: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE, PERM_APPROVE, PERM_REJECT, PERM_EXPORT
    },
    ROLE_PLANNER: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE, PERM_EXPORT
    },
    ROLE_CONTROLLER: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE, PERM_APPROVE, PERM_REJECT, PERM_EXPORT
    },
    ROLE_STATION_MASTER: {
        PERM_VIEW, PERM_UPDATE, PERM_APPROVE, PERM_REJECT
    },
    ROLE_ENGINEER: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE
    },
    ROLE_RAILWAY_OFFICER: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE, PERM_EXPORT
    },
    ROLE_TRACTION_OFFICER: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE
    },
    ROLE_SIGNAL_TELECOM_OFFICER: {
        PERM_VIEW, PERM_CREATE, PERM_UPDATE
    },
    ROLE_FIELD_OFFICER: {
        PERM_VIEW, PERM_UPDATE
    },
    ROLE_VIEWER: {
        PERM_VIEW
    },
}


def user_has_permission(user: dict, permission: str) -> bool:
    role = user.get("role", ROLE_VIEWER)
    if role in [ROLE_SUPER_ADMIN, ROLE_ADMIN]:
        return True
    user_perms = ROLE_PERMISSIONS_MAP.get(role, {PERM_VIEW})
    return permission in user_perms


def require_permission(permission: str):
    def permission_checker(current_user: dict = Depends(get_current_user)):
        if not user_has_permission(current_user, permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user.get('role')}' lacks required permission '{permission}'.",
            )
        return current_user

    return permission_checker
