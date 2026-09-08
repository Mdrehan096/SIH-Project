import logging
from ortools.sat.python import cp_model
from typing import Dict, Any, List

logger = logging.getLogger("retrack.optimizer.model")


class CPSatBlockModel:
    """
    Constructs Google OR-Tools CP-SAT model variables for maintenance block planning.
    """

    def __init__(self, time_horizon_minutes: int = 480):
        self.model = cp_model.CpModel()
        self.time_horizon = time_horizon_minutes
        
        # Decision variables
        self.block_start = None
        self.block_end = None
        self.block_duration = None
        self.block_interval = None
        self.task_vars: Dict[str, Any] = {}

    def build_variables(self, bundles: List[Dict[str, Any]], trains: List[Dict[str, Any]]):
        # Time variables in minutes from 00:00 AM (0 to 480 minutes representing 8 hours)
        self.block_start = self.model.NewIntVar(0, self.time_horizon, "block_start")
        self.block_end = self.model.NewIntVar(0, self.time_horizon, "block_end")
        self.block_duration = self.model.NewIntVar(30, 180, "block_duration")

        self.model.Add(self.block_end == self.block_start + self.block_duration)
        self.block_interval = self.model.NewIntervalVar(
            self.block_start, self.block_duration, self.block_end, "block_interval"
        )

        for b in bundles:
            bid = b["bundle_id"]
            self.task_vars[bid] = {
                "selected": self.model.NewBoolVar(f"select_{bid}"),
                "start": self.model.NewIntVar(0, self.time_horizon, f"start_{bid}"),
                "duration": b["estimated_duration_minutes"],
                "tasks_count": b.get("tasks_count", 1),
                "priority_weight": b.get("priority_weight", 3),
                "risk_score": b.get("risk_score", 20.0),
                "start_km": b["start_km"],
                "end_km": b["end_km"],
            }
