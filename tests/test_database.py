import os
import pytest
from app.db.connection import db_manager
from app.db.queries import get_all_maintenance_requests, get_all_trains, get_safety_constraints


def test_database_connection_status():
    status = db_manager.get_status()
    assert status["connected"] is True
    assert "mode" in status


def test_get_all_maintenance_requests():
    requests = get_all_maintenance_requests()
    assert isinstance(requests, list)
    assert len(requests) >= 10
    
    # Verify request model attributes
    first_req = requests[0]
    assert "request_id" in first_req
    assert "source_system" in first_req
    assert "department_id" in first_req
    assert "location_km" in first_req
    assert "priority" in first_req


def test_get_all_trains():
    trains = get_all_trains()
    assert isinstance(trains, list)
    assert len(trains) >= 4
    
    first_train = trains[0]
    assert "train_number" in first_train
    assert "train_type" in first_train
    assert "priority" in first_train


def test_get_safety_constraints():
    constraints = get_safety_constraints()
    assert isinstance(constraints, list)
    assert len(constraints) >= 3
    assert any(c["rule_code"] == "RULE-01" for c in constraints)
