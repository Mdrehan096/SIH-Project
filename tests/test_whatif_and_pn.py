from app.services.whatif_service import whatif_service
from app.services.pn_service import pn_service


def test_whatif_simulation_engine():
    res = whatif_service.run_simulation(
        section_id="SEC-NDLS-AGC-01",
        train_delay_minutes=20,
        train_number="12951",
        maintenance_duration_delta=15
    )
    assert res["success"] is True
    assert "original_plan" in res
    assert "new_plan" in res
    assert res["tasks_preserved"] >= 1
    assert res["safety_status"] in ["SAFE", "CONFLICT_DETECTED"]


def test_digital_pn_lifecycle():
    block_id = "BLK-2026-TEST-99"
    
    # 1. Generate PN
    gen_res = pn_service.generate_pn(block_id=block_id, user_name="Controller Test")
    assert gen_res["success"] is True
    assert gen_res["pn_code"].startswith("PN-")
    assert gen_res["status"] == "PENDING_VERIFICATION"

    # 2. Check Status
    status_res = pn_service.get_pn_status(block_id)
    assert status_res["status"] == "PENDING_VERIFICATION"

    # 3. Verify PN
    ver_res = pn_service.verify_pn(block_id=block_id, pn_code=gen_res["pn_code"], station_code="NDLS", user_name="Station Master Test")
    assert ver_res["status"] == "VERIFIED"
    assert ver_res["verified_by"] == "Station Master Test"
