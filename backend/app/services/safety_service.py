import logging
from typing import Any, Dict, List
from datetime import datetime, timezone
from app.db.queries import get_safety_constraints, get_all_trains

logger = logging.getLogger("retrack.safety")


class SafetyConstraintEngine:
    """
    Configurable Safety Rule Engine for Indian Railways operations.
    Validates activity compatibility and detects dynamic train path spatial-temporal conflicts.
    """

    def validate_safety(
        self,
        section_id: str,
        start_km: float,
        end_km: float,
        scheduled_start_time: str,
        scheduled_end_time: str,
        activities: List[str],
        affected_departments: List[str]
    ) -> Dict[str, Any]:
        conflicts = []
        activities_upper = [a.upper() for a in activities]
        constraints = get_safety_constraints()

        # 1. Rule Matrix Inter-Activity Conflict Validation
        for rule in constraints:
            p_act = rule["primary_activity"].upper()
            c_act = rule["conflicting_activity"].upper()

            # Direct match or keyword substring match
            p_match = any(p_act in act or act in p_act for act in activities_upper)
            c_match = any(c_act in act or act in c_act for act in activities_upper)

            if p_match and c_match:
                conflicts.append({
                    "rule_code": rule["rule_code"],
                    "severity": rule["severity"],
                    "message": f"Conflict between '{rule['primary_activity']}' and '{rule['conflicting_activity']}': {rule.get('description', 'Safety conflict detected.')}",
                    "primary_activity": rule["primary_activity"],
                    "conflicting_activity": rule["conflicting_activity"],
                })

        # 2. Dynamic Spatial-Temporal Train Path Conflict Validation
        trains = get_all_trains()
        block_start_str = scheduled_start_time.split("T")[-1].replace("Z", "")[:5]
        block_end_str = scheduled_end_time.split("T")[-1].replace("Z", "")[:5]

        for train in trains:
            t_arr = train.get("scheduled_arrival", "02:40")
            t_dep = train.get("scheduled_departure", "02:50")
            t_skm = train.get("start_km", 115.0)
            t_ekm = train.get("end_km", 130.0)

            # Spatial overlap check: max(start_km, t_skm) <= min(end_km, t_ekm)
            spatial_overlap = max(start_km, t_skm) <= min(end_km, t_ekm)

            # Temporal overlap check: max(block_start, t_arr) <= min(block_end, t_dep)
            temporal_overlap = max(block_start_str, t_arr) < min(block_end_str, t_dep)

            if spatial_overlap and temporal_overlap:
                conflicts.append({
                    "rule_code": "TRAIN_PATH_OVERLAP",
                    "severity": "CRITICAL",
                    "message": f"Maintenance block window ({block_start_str}-{block_end_str}) overlaps passing Train {train['train_number']} ({train['train_name']}) at KM {start_km}-{end_km}.",
                    "primary_activity": "MAINTENANCE_BLOCK",
                    "conflicting_activity": f"TRAIN_{train['train_number']}"
                })

        is_safe = len(conflicts) == 0

        return {
            "success": True,
            "section_id": section_id,
            "safe": is_safe,
            "conflicts_count": len(conflicts),
            "conflicts": conflicts
        }


safety_engine = SafetyConstraintEngine()
