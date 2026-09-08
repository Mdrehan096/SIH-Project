import logging
from typing import Any, Dict, List
from app.db.queries import get_all_maintenance_requests
from app.services.normalization_service import normalization_service

logger = logging.getLogger("retrack.bundling")


class SpatialBundlingEngine:
    """
    Core 5 KM Spatial and Temporal Bundling Engine.
    Groups compatible maintenance tasks within a 5 km corridor across Civil, Electrical, and S&T departments.
    """

    MAX_DISTANCE_KM = 5.0

    def generate_spatial_bundles(self, section_id: str = "SEC-NDLS-AGC-01", max_dist_km: float = 5.0) -> Dict[str, Any]:
        raw_requests = get_all_maintenance_requests()
        normalized_reqs = normalization_service.normalize_request_list(raw_requests)

        # Filter active pending requests for the target section
        pending = [r for r in normalized_reqs if r["section_id"] == section_id and r["status"] == "PENDING"]
        
        # Sort by location_km ascending
        pending.sort(key=lambda x: x["location_km"])

        bundles = []
        visited = set()

        for i, req in enumerate(pending):
            if req["request_id"] in visited:
                continue

            current_cluster = [req]
            visited.add(req["request_id"])

            for j in range(i + 1, len(pending)):
                candidate = pending[j]
                if candidate["request_id"] in visited:
                    continue

                # Check 1: Distance criterion (span between min and candidate <= max_dist_km)
                min_km = min(r["location_km"] for r in current_cluster)
                max_km = max(r["location_km"] for r in current_cluster)
                potential_span = max(max_km, candidate["location_km"]) - min(min_km, candidate["location_km"])

                if potential_span <= max_dist_km:
                    # Check 2: Task compatibility
                    if self._are_tasks_compatible(current_cluster, candidate):
                        current_cluster.append(candidate)
                        visited.add(candidate["request_id"])

            # Formulate bundle object
            start_km = min(r["location_km"] for r in current_cluster)
            end_km = max(r["location_km"] for r in current_cluster)
            span_km = round(end_km - start_km, 2)
            depts = sorted(list(set(r["department_id"] for r in current_cluster)))
            task_ids = [r["request_id"] for r in current_cluster]

            # Block type consolidation
            block_types = set(r["required_block_type"] for r in current_cluster)
            if "JOINT_POSSESSION" in block_types or len(depts) > 1:
                required_block = "JOINT_POSSESSION"
            elif "TRAFFIC_BLOCK" in block_types:
                required_block = "TRAFFIC_BLOCK"
            elif "POWER_BLOCK" in block_types:
                required_block = "POWER_BLOCK"
            else:
                required_block = "CAUTION"

            # Duration calculation: parallel execution with safety buffer
            total_single_durations = sum(r["estimated_duration_minutes"] for r in current_cluster)
            max_single_duration = max(r["estimated_duration_minutes"] for r in current_cluster)
            
            if len(current_cluster) > 1:
                bundled_duration = max(max_single_duration, int(total_single_durations * 0.45))
            else:
                bundled_duration = max_single_duration

            bundle_id = f"BND-2026-{len(bundles) + 1:03d}"

            bundles.append({
                "bundle_id": bundle_id,
                "start_km": start_km,
                "end_km": end_km,
                "span_km": span_km,
                "tasks_count": len(current_cluster),
                "task_ids": task_ids,
                "tasks": current_cluster,
                "departments": depts,
                "estimated_duration_minutes": bundled_duration,
                "required_block_type": required_block,
                "compatible": True,
                "compatibility_reason": f"Bundled {len(current_cluster)} tasks across {len(depts)} department(s) within {span_km} km span."
                if len(current_cluster) > 1 else "Single isolated maintenance task."
            })

        logger.info(f"Generated {len(bundles)} spatial bundles from {len(pending)} pending requests.")
        return {
            "success": True,
            "section_id": section_id,
            "total_requests_analyzed": len(pending),
            "bundles_created": len(bundles),
            "bundles": bundles
        }

    def _are_tasks_compatible(self, cluster: List[Dict[str, Any]], candidate: Dict[str, Any]) -> bool:
        # Prevent conflicting activities (e.g. heavy ballast grinding during delicate relay testing)
        candidate_task = candidate["task_type"].upper()
        for r in cluster:
            r_task = r["task_type"].upper()
            if "GRINDING" in candidate_task and "RELAY" in r_task:
                return False
            if "RELAY" in candidate_task and "GRINDING" in r_task:
                return False
        return True


bundling_engine = SpatialBundlingEngine()
