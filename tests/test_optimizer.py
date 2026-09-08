from optimizer.scheduler import block_scheduler
from app.services.optimization_service import optimization_service


def test_cp_sat_optimizer_execution():
    res = block_scheduler.generate_optimal_block_schedule(
        section_id="SEC-NDLS-AGC-01",
        time_limit_seconds=10.0
    )
    assert res["success"] is True
    assert res["solver_status"] in ["OPTIMAL", "FEASIBLE"]
    assert "optimal_block" in res
    
    blk = res["optimal_block"]
    assert blk["block_id"].startswith("BLK-")
    assert blk["tasks_bundled"] >= 1
    assert blk["affected_trains"] == 0
    assert blk["optimization_score"] > 80.0


def test_optimization_service_wrapper():
    res = optimization_service.run_optimization(section_id="SEC-NDLS-AGC-01")
    assert res["success"] is True
    assert res["optimal_block"]["status"] == "RECOMMENDED"
    assert len(res["alternative_blocks"]) >= 1
