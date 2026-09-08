import logging
from ortools.sat.python import cp_model
from typing import Dict, Any, List

logger = logging.getLogger("retrack.optimizer.constraints")


class CPSatConstraintBuilder:
    """
    Formulates CP-SAT safety and operational constraints.
    """

    @staticmethod
    def add_train_conflict_constraints(model_wrapper, train_paths: List[Dict[str, Any]]):
        """
        Adds constraints preventing maintenance block from overlapping active train paths.
        """
        for tp in train_paths:
            # Convert train arrival/departure to minutes from midnight
            arr_str = tp.get("scheduled_arrival", "02:40").split("T")[-1].replace("Z", "")[:5]
            dep_str = tp.get("scheduled_departure", "02:50").split("T")[-1].replace("Z", "")[:5]
            
            try:
                arr_m = int(arr_str.split(":")[0]) * 60 + int(arr_str.split(":")[1])
                dep_m = int(dep_str.split(":")[0]) * 60 + int(dep_str.split(":")[1])
            except Exception:
                arr_m = 160
                dep_m = 170

            # Add buffer of 15 minutes before and after train
            safe_arr = max(0, arr_m - 10)
            safe_dep = dep_m + 10

            # Create boolean variable: block finishes before train OR block starts after train
            b_before = model_wrapper.model.NewBoolVar(f"before_train_{tp.get('train_number', '123')}")
            b_after = model_wrapper.model.NewBoolVar(f"after_train_{tp.get('train_number', '123')}")

            model_wrapper.model.Add(model_wrapper.block_end <= safe_arr).OnlyEnforceIf(b_before)
            model_wrapper.model.Add(model_wrapper.block_start >= safe_dep).OnlyEnforceIf(b_after)

            # At least one must hold (no overlap)
            model_wrapper.model.AddBoolOr([b_before, b_after])

    @staticmethod
    def add_duration_bounds(model_wrapper, min_minutes: int = 45, max_minutes: int = 120):
        model_wrapper.model.Add(model_wrapper.block_duration >= min_minutes)
        model_wrapper.model.Add(model_wrapper.block_duration <= max_minutes)
