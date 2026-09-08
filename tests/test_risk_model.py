import os
from ai.feature_engineering import extract_risk_features
from ai.risk_model import predict_risk_score
from app.services.normalization_service import normalization_service
from app.services.risk_service import risk_service


def test_feature_engineering():
    sample = {
        "asset_age": 12,
        "defect_severity": 80,
        "defect_frequency": 4,
        "previous_failures": 2,
        "traffic_density": 95.0,
        "maintenance_delay": 7,
        "inspection_score": 60.0,
        "environmental_factor": 1.3
    }
    df = extract_risk_features(sample)
    assert len(df) == 1
    assert df["defect_severity"].iloc[0] == 80.0
    assert df["previous_failures"].iloc[0] == 2


def test_predictive_risk_model_inference():
    sample = {
        "asset_id": "TRK-124",
        "asset_age": 15,
        "defect_severity": 85,
        "defect_frequency": 5,
        "previous_failures": 3,
        "traffic_density": 100.0,
        "maintenance_delay": 10,
        "inspection_score": 50.0,
        "environmental_factor": 1.2
    }
    res = predict_risk_score(sample)
    assert "risk_score" in res
    assert 0.0 <= res["risk_score"] <= 100.0
    assert res["risk_category"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert "feature_importance" in res
    assert len(res["feature_importance"]) >= 5


def test_normalization_service():
    raw_payload = {
        "source_system": "tms",
        "department_id": "civil",
        "asset_id": "TRK-120",
        "priority": "critical",
        "severity": "85",
        "estimated_duration_minutes": "45",
        "location_km": "120.5",
        "safety_requirements": "LOOKOUT_MAN, SPEED_RESTRICTION"
    }
    norm = normalization_service.normalize_request(raw_payload)
    assert norm["source_system"] == "TMS"
    assert norm["department_id"] == "CIVIL"
    assert norm["priority"] == "CRITICAL"
    assert norm["priority_weight"] == 4
    assert norm["severity"] == 85
    assert norm["estimated_duration_minutes"] == 45
    assert norm["location_km"] == 120.5
    assert len(norm["safety_requirements"]) == 2
