"""
RETRACK – RailSync-AI Maintenance Controller (MVC: Controller Layer)
Manages maintenance request ingestion, updates, filtering, and Supabase synchronization.
"""

from typing import List, Dict, Any, Optional
from app.db.queries import (
    get_all_maintenance_requests,
    get_maintenance_request_by_id,
    update_maintenance_request_status,
)


class MaintenanceController:
    """Controller handling business logic for maintenance jobs."""

    def get_all_requests(self, department: Optional[str] = None) -> List[Dict[str, Any]]:
        reqs = get_all_maintenance_requests()
        if department and department != 'ALL':
            return [r for r in reqs if r.get("department_id") == department or r.get("department") == department]
        return reqs

    def get_request_by_id(self, request_id: str) -> Optional[Dict[str, Any]]:
        return get_maintenance_request_by_id(request_id)

    def update_request(self, request_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        status = updates.get("status", "COMPLETED")
        priority = updates.get("priority")
        return update_maintenance_request_status(request_id, new_status=status, priority=priority)


maintenance_controller = MaintenanceController()
