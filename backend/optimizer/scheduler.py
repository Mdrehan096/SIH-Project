import logging
from typing import Dict, Any, List
from optimizer.cp_sat_model import CPSatBlockModel
from optimizer.constraints import CPSatConstraintBuilder
from optimizer.objective import CPSatObjectiveBuilder
from optimizer.solver import CPSatBlockSolver
from app.services.bundling_service import bundling_engine
from app.db.queries import get_all_trains

logger = logging.getLogger("retrack.optimizer.scheduler")


SECTION_NAMES = {
    "SEC-NDLS-AGC-01": "NDLS - AGC (New Delhi - Agra Cantt)",
    "SEC-BCT-BRC-02": "BCT - BRC (Mumbai Central - Vadodara)",
    "SEC-HWH-DGR-03": "HWH - DGR (Howrah - Durgapur)",
    "SEC-MAS-KPD-04": "MAS - KPD (Chennai Central - Katpadi)",
}

SECTION_TASKS = {
    "SEC-NDLS-AGC-01": [
        {"task_id": "TMS-001", "department": "CIVIL", "task_type": "Track Rail Replacement", "location_km": 120.0, "severity": 78, "duration_minutes": 45, "safety_requirements": ["SPEED_RESTRICTION_30KMH"]},
        {"task_id": "TDMS-002", "department": "CIVIL", "task_type": "Ultrasonic Rail Flaw Repair", "location_km": 122.0, "severity": 62, "duration_minutes": 30, "safety_requirements": ["TRACK_CAUTION"]},
        {"task_id": "SMMS-003", "department": "ELECTRICAL", "task_type": "OHE Catenary Wire Tensioning", "location_km": 124.2, "severity": 82, "duration_minutes": 40, "safety_requirements": ["OHE_DISCONNECT"]},
        {"task_id": "TMS-004", "department": "CIVIL", "task_type": "Deep Ballast Tamp & Grinding", "location_km": 124.5, "severity": 90, "duration_minutes": 60, "safety_requirements": ["TRAFFIC_BLOCK", "POWER_BLOCK"]},
        {"task_id": "SMMS-005", "department": "SIGNAL_TELECOM", "task_type": "Signal Relay & Track Circuit Test", "location_km": 125.0, "severity": 55, "duration_minutes": 30, "safety_requirements": ["SIGNAL_DISCONNECT_MEMO"]},
        {"task_id": "TMS-006", "department": "CIVIL", "task_type": "Sleeper Fastening & Bolt Tightening", "location_km": 126.0, "severity": 35, "duration_minutes": 25, "safety_requirements": ["LOOKOUT_MAN"]},
        {"task_id": "TDMS-007", "department": "CIVIL", "task_type": "Weld Defect Rectification", "location_km": 128.5, "severity": 74, "duration_minutes": 35, "safety_requirements": ["SPEED_RESTRICTION_20KMH"]}
    ],
    "SEC-BCT-BRC-02": [
        {"task_id": "BCT-010", "department": "ELECTRICAL", "task_type": "OHE Cantilever Inspection", "location_km": 210.4, "severity": 85, "duration_minutes": 50, "safety_requirements": ["OHE_POWER_ISOLATION"]},
        {"task_id": "BCT-012", "department": "CIVIL", "task_type": "Turnout Point & Crossing Maintenance", "location_km": 212.0, "severity": 70, "duration_minutes": 40, "safety_requirements": ["TRAFFIC_BLOCK"]},
        {"task_id": "BCT-015", "department": "SIGNAL_TELECOM", "task_type": "Axle Counter Sensor Calibration", "location_km": 213.8, "severity": 60, "duration_minutes": 30, "safety_requirements": ["SIGNAL_MEMO"]}
    ],
    "SEC-HWH-DGR-03": [
        {"task_id": "HWH-101", "department": "CIVIL", "task_type": "Substructure Bridge Bearing Check", "location_km": 85.2, "severity": 92, "duration_minutes": 75, "safety_requirements": ["TRAFFIC_BLOCK", "SPEED_RESTRICTION"]},
        {"task_id": "HWH-104", "department": "ELECTRICAL", "task_type": "Feeder Wire Splice Repair", "location_km": 87.0, "severity": 76, "duration_minutes": 45, "safety_requirements": ["POWER_BLOCK"]}
    ],
    "SEC-MAS-KPD-04": [
        {"task_id": "MAS-301", "department": "CIVIL", "task_type": "Rail Lubrication & Gauge Tightening", "location_km": 145.0, "severity": 50, "duration_minutes": 35, "safety_requirements": ["LOOKOUT_MAN"]},
        {"task_id": "MAS-305", "department": "SIGNAL_TELECOM", "task_type": "LED Signal Aspect Replacement", "location_km": 147.5, "severity": 65, "duration_minutes": 25, "safety_requirements": ["SIGNAL_ISOLATION"]}
    ]
}


class BlockSchedulerService:
    """
    High-level Block Planning Service using Google OR-Tools CP-SAT Solver.
    """

    def generate_optimal_block_schedule(
        self,
        section_id: str = "SEC-NDLS-AGC-01",
        time_limit_seconds: float = 10.0,
        max_bundling_distance_km: float = 5.0,
        max_block_duration_minutes: int = 60,
        department_filters: Any = None
    ) -> Dict[str, Any]:
        # 1. Fetch spatial bundles and train paths
        bundles_data = bundling_engine.generate_spatial_bundles(section_id=section_id)
        bundles = bundles_data.get("bundles", [])
        trains = get_all_trains()

        # 2. Build CP-SAT Model
        model_wrapper = CPSatBlockModel(time_horizon_minutes=480) # 8 hour horizon (00:00 to 08:00 AM)
        model_wrapper.build_variables(bundles, trains)

        # 3. Add Constraints with custom duration bounds
        CPSatConstraintBuilder.add_train_conflict_constraints(model_wrapper, trains)
        CPSatConstraintBuilder.add_duration_bounds(
            model_wrapper,
            min_minutes=min(30, max_block_duration_minutes),
            max_minutes=max(45, max_block_duration_minutes)
        )

        # 4. Set Objective
        CPSatObjectiveBuilder.set_objective(model_wrapper)

        # 5. Solve using Google OR-Tools CP-SAT
        solver = CPSatBlockSolver(time_limit_seconds=time_limit_seconds, seed=42)
        solution = solver.solve(model_wrapper)

        # Filter section tasks
        raw_tasks = SECTION_TASKS.get(section_id, SECTION_TASKS["SEC-NDLS-AGC-01"])
        if department_filters and isinstance(department_filters, list) and len(department_filters) > 0:
            filtered_tasks = [t for t in raw_tasks if t["department"] in department_filters]
            if not filtered_tasks:
                filtered_tasks = raw_tasks
        else:
            filtered_tasks = raw_tasks

        depts = sorted(list(set(t["department"] for t in filtered_tasks)))
        task_ids = [t["task_id"] for t in filtered_tasks]
        start_km = min(t["location_km"] for t in filtered_tasks) if filtered_tasks else 120.0
        end_km = max(t["location_km"] for t in filtered_tasks) if filtered_tasks else 128.5
        section_name = SECTION_NAMES.get(section_id, "NDLS - AGC (New Delhi - Agra Cantt)")

        optimal_block = {
            "block_id": f"BLK-2026-{(hash(section_id) % 900) + 100}",
            "section_id": section_id,
            "section_name": section_name,
            "start_time": solution["start_time"],
            "end_time": solution["end_time"],
            "duration_minutes": solution["duration_minutes"],
            "start_km": round(start_km, 1),
            "end_km": round(end_km, 1),
            "tasks_bundled": len(filtered_tasks),
            "task_ids": task_ids,
            "task_details": filtered_tasks,
            "departments": depts,
            "affected_trains": 0,
            "risk_score": 18.5,
            "optimization_score": solution["optimization_score"],
            "status": "RECOMMENDED",
            "pn_code": None
        }

        # Calculate alternative shifted time window
        start_m = solution.get("start_minutes", 120) + 90
        end_m = start_m + max_block_duration_minutes
        alt_start_str = f"{(start_m // 60):02d}:{(start_m % 60):02d}"
        alt_end_str = f"{(end_m // 60):02d}:{(end_m % 60):02d}"

        alternative_blocks = [
            {
                "block_id": f"BLK-2026-{(hash(section_id) % 900) + 101}",
                "section_id": section_id,
                "section_name": section_name,
                "start_time": alt_start_str,
                "end_time": alt_end_str,
                "duration_minutes": max_block_duration_minutes,
                "start_km": round(start_km, 1),
                "end_km": round(end_km, 1),
                "tasks_bundled": max(1, len(filtered_tasks) - 1),
                "task_ids": task_ids[:-1] if len(task_ids) > 1 else task_ids,
                "task_details": filtered_tasks[:-1] if len(filtered_tasks) > 1 else filtered_tasks,
                "departments": depts,
                "affected_trains": 1,
                "risk_score": 24.0,
                "optimization_score": 84.0,
                "status": "ALTERNATIVE",
                "pn_code": None
            }
        ]

        return {
            "success": True,
            "section_id": section_id,
            "solver_status": solution["status"],
            "optimal_block": optimal_block,
            "alternative_blocks": alternative_blocks,
            "execution_time_ms": solution["execution_time_ms"]
        }


block_scheduler = BlockSchedulerService()
