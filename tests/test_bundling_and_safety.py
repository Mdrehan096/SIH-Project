from app.services.bundling_service import bundling_engine
from app.services.safety_service import safety_engine


def test_spatial_bundling_clustering():
    result = bundling_engine.generate_spatial_bundles(section_id="SEC-NDLS-AGC-01", max_dist_km=5.0)
    assert result["success"] is True
    assert result["bundles_created"] >= 1
    
    # Check primary bundle
    primary = result["bundles"][0]
    assert primary["span_km"] <= 8.5
    assert len(primary["departments"]) >= 2
    assert primary["required_block_type"] == "JOINT_POSSESSION"


def test_safety_inter_activity_conflict():
    result = safety_engine.validate_safety(
        section_id="SEC-NDLS-AGC-01",
        start_km=120.0,
        end_km=128.5,
        scheduled_start_time="2026-09-07T02:00:00Z",
        scheduled_end_time="2026-09-07T03:00:00Z",
        activities=["TRACK_REPAIR", "TRAIN_MOVEMENT"],
        affected_departments=["CIVIL"]
    )
    assert result["safe"] is False
    assert result["conflicts_count"] >= 1
    assert any(c["rule_code"] == "RULE-01" for c in result["conflicts"])


def test_safety_train_path_overlap_conflict():
    # Train 12951 passes between 02:40 and 02:50 at KM 115-130
    result = safety_engine.validate_safety(
        section_id="SEC-NDLS-AGC-01",
        start_km=120.0,
        end_km=128.5,
        scheduled_start_time="2026-09-07T02:30:00Z",
        scheduled_end_time="2026-09-07T03:00:00Z",
        activities=["TRACK_INSPECTION"],
        affected_departments=["CIVIL"]
    )
    assert result["safe"] is False
    assert result["conflicts_count"] >= 1
    assert any(c["rule_code"] == "TRAIN_PATH_OVERLAP" for c in result["conflicts"])


def test_safety_clean_window():
    # Window 02:00 - 02:30 has zero train conflicts for foot inspection
    result = safety_engine.validate_safety(
        section_id="SEC-NDLS-AGC-01",
        start_km=120.0,
        end_km=128.5,
        scheduled_start_time="2026-09-07T02:00:00Z",
        scheduled_end_time="2026-09-07T02:30:00Z",
        activities=["VISUAL_FOOT_INSPECTION"],
        affected_departments=["CIVIL"]
    )
    assert result["safe"] is True
    assert result["conflicts_count"] == 0
