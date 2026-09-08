import pytest
from app.services.ingestion_service import ingestion_service
from app.services.bundling_service import bundling_engine
from app.services.safety_service import safety_engine
from app.services.optimization_service import optimization_service
from app.services.whatif_service import whatif_service
from app.services.pn_service import pn_service
from ai.risk_model import predict_risk_score


def test_complete_sih_2026_demo_scenario():
    """
    End-to-End Smart India Hackathon 2026 Demo Scenario Verification.
    Follows Section 32 of Problem Statement 26027 specifications.
    """
    print("\n=== STEP 1: Multi-Source Ingestion ===")
    maint_reqs = ingestion_service.ingest_all_maintenance_requests()
    assert len(maint_reqs) >= 10
    print(f"Ingested {len(maint_reqs)} maintenance requests from TMS, TDMS, and SMMS.")

    print("\n=== STEP 2: 5 KM Spatial Bundling ===")
    bundles_res = bundling_engine.generate_spatial_bundles(section_id="SEC-NDLS-AGC-01", max_dist_km=5.0)
    assert bundles_res["success"] is True
    assert bundles_res["bundles_created"] >= 1
    
    primary_bundle = bundles_res["bundles"][0]
    print(f"Primary Bundle {primary_bundle['bundle_id']}: KM {primary_bundle['start_km']} - {primary_bundle['end_km']} ({primary_bundle['span_km']} km span)")
    print(f"Bundled {primary_bundle['tasks_count']} tasks across departments: {primary_bundle['departments']}")
    assert primary_bundle["required_block_type"] == "JOINT_POSSESSION"

    print("\n=== STEP 3: Predictive Risk Scoring (Scikit-Learn ML) ===")
    sample_asset_data = {
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
    risk_res = predict_risk_score(sample_asset_data)
    print(f"Predicted Risk Score: {risk_res['risk_score']} ({risk_res['risk_category']} Risk Category)")
    assert 0.0 <= risk_res["risk_score"] <= 100.0

    print("\n=== STEP 4: OR-Tools CP-SAT Block Optimization ===")
    opt_res = optimization_service.run_optimization(section_id="SEC-NDLS-AGC-01")
    assert opt_res["solver_status"] in ["OPTIMAL", "FEASIBLE"]
    opt_blk = opt_res["optimal_block"]
    print(f"Optimal Block {opt_blk['block_id']}: {opt_blk['start_time']} - {opt_blk['end_time']} AM (Score: {opt_blk['optimization_score']})")

    print("\n=== STEP 5: Dynamic What-If Simulation (20 min Train Delay) ===")
    whatif_res = whatif_service.run_simulation(
        section_id="SEC-NDLS-AGC-01",
        train_delay_minutes=20,
        train_number="12951",
        maintenance_duration_delta=15
    )
    assert whatif_res["success"] is True
    print(f"What-If Result: {whatif_res['impact_summary']}")

    print("\n=== STEP 6: Controller Approval & Digital PN Handshake ===")
    block_id = opt_blk["block_id"]
    
    # Generate PN by Section Controller
    pn_gen = pn_service.generate_pn(block_id=block_id, user_name="Section Controller (NDLS-AGC)")
    assert pn_gen["status"] == "PENDING_VERIFICATION"
    print(f"Generated Digital PN: {pn_gen['pn_code']}")

    # Verify PN by Station Master
    pn_ver = pn_service.verify_pn(block_id=block_id, pn_code=pn_gen["pn_code"], station_code="NDLS", user_name="Station Master (New Delhi)")
    assert pn_ver["status"] == "VERIFIED"
    print(f"Verified Digital PN: {pn_ver['pn_code']} by {pn_ver['verified_by']} at {pn_ver['station_code']}. Possession Authorized!")
