from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_auth_login():
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "controller@railsync.ir", "password": "controller123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "CONTROLLER"


def test_maintenance_crud():
    # GET list
    response = client.get("/api/v1/maintenance")
    assert response.status_code == 200
    reqs = response.json()
    assert len(reqs) >= 10

    # POST create
    new_req = {
        "source_system": "TMS",
        "department_id": "CIVIL",
        "asset_id": "TRK-120",
        "task_type": "Rail Weld Inspection",
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": 121.5,
        "priority": "HIGH",
        "severity": 70,
        "estimated_duration_minutes": 35,
        "required_block_type": "TRAFFIC_BLOCK",
        "safety_requirements": ["LOOKOUT_MAN"]
    }
    create_res = client.post("/api/v1/maintenance", json=new_req)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["task_type"] == "Rail Weld Inspection"
    assert created_data["status"] == "PENDING"


def test_trains_endpoints():
    response = client.get("/api/v1/trains")
    assert response.status_code == 200
    assert len(response.json()) >= 4

    paths_res = client.get("/api/v1/trains/paths")
    assert paths_res.status_code == 200
    assert len(paths_res.json()) >= 4


def test_assets_endpoints():
    response = client.get("/api/v1/assets")
    assert response.status_code == 200
    assert len(response.json()) >= 5


def test_risk_scoring_endpoint():
    payload = {
        "asset_id": "TRK-124",
        "asset_age": 10,
        "defect_severity": 75,
        "defect_frequency": 3,
        "previous_failures": 1,
        "traffic_density": 85.0,
        "maintenance_delay": 5,
        "inspection_score": 65.0,
        "environmental_factor": 1.2
    }
    response = client.post("/api/v1/risk/score", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert 0 <= data["risk_score"] <= 100
    assert data["risk_category"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]


def test_spatial_bundling_endpoint():
    payload = {"section_id": "SEC-NDLS-AGC-01", "max_distance_km": 5.0}
    response = client.post("/api/v1/bundling/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["bundles_created"] >= 1


def test_safety_validation_endpoint():
    payload = {
        "section_id": "SEC-NDLS-AGC-01",
        "start_km": 120.0,
        "end_km": 128.5,
        "scheduled_start_time": "02:00",
        "scheduled_end_time": "03:00",
        "activities": ["TRACK_REPAIR", "TRAIN_MOVEMENT"],
        "affected_departments": ["CIVIL"]
    }
    response = client.post("/api/v1/safety/validate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["safe"] is False
    assert data["conflicts_count"] >= 1


def test_optimizer_endpoint():
    payload = {
        "section_id": "SEC-NDLS-AGC-01",
        "start_time_window": "2026-09-07T01:00:00Z",
        "end_time_window": "2026-09-07T05:00:00Z"
    }
    response = client.post("/api/v1/optimizer/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["solver_status"] == "OPTIMAL"
    assert data["optimal_block"]["tasks_bundled"] >= 1


def test_blocks_and_pn_workflow():
    # List blocks
    response = client.get("/api/v1/blocks")
    assert response.status_code == 200
    blocks = response.json()
    assert len(blocks) >= 1
    block_id = blocks[0]["block_id"]

    # Approve block
    app_res = client.post(f"/api/v1/blocks/{block_id}/approve")
    assert app_res.status_code == 200
    assert app_res.json()["status"] == "APPROVED"

    # Generate Digital PN
    pn_gen_res = client.post("/api/v1/pn/generate", json={"block_id": block_id})
    assert pn_gen_res.status_code == 200
    pn_data = pn_gen_res.json()
    assert pn_data["pn_code"].startswith("PN-")

    # Login as Station Master for verification
    sm_login = client.post("/api/v1/auth/login", json={"email": "stationmaster@railsync.ir", "password": "station123"})
    assert sm_login.status_code == 200
    sm_token = sm_login.json()["access_token"]

    # Verify Digital PN with Station Master Auth Token
    pn_ver_res = client.post(
        "/api/v1/pn/verify",
        json={"block_id": block_id, "pn_code": pn_data["pn_code"], "station_code": "NDLS"},
        headers={"Authorization": f"Bearer {sm_token}"}
    )
    assert pn_ver_res.status_code == 200
    assert pn_ver_res.json()["status"] == "VERIFIED"


def test_analytics_dashboard_endpoint():
    response = client.get("/api/v1/analytics/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["active_trains"] >= 1
    assert "CIVIL" in data["department_distribution"]
