from typing import Any, Dict, List
import pandas as pd
import numpy as np

FEATURE_COLUMNS = [
    "asset_age",
    "defect_severity",
    "defect_frequency",
    "previous_failures",
    "traffic_density",
    "maintenance_delay",
    "inspection_score",
    "environmental_factor",
]


def extract_risk_features(data: Dict[str, Any]) -> pd.DataFrame:
    """
    Extracts and prepares feature DataFrame for Scikit-Learn Risk Model inference.
    """
    feature_dict = {
        "asset_age": [int(data.get("asset_age", 10))],
        "defect_severity": [float(data.get("defect_severity", 50.0))],
        "defect_frequency": [int(data.get("defect_frequency", 2))],
        "previous_failures": [int(data.get("previous_failures", 1))],
        "traffic_density": [float(data.get("traffic_density", 80.0))],
        "maintenance_delay": [int(data.get("maintenance_delay", 3))],
        "inspection_score": [float(data.get("inspection_score", 70.0))],
        "environmental_factor": [float(data.get("environmental_factor", 1.0))],
    }
    return pd.DataFrame(feature_dict)[FEATURE_COLUMNS]
