import os
import random
from datetime import datetime, timedelta, timezone
import pandas as pd
import numpy as np

# Set fixed seed for deterministic reproducibility
random.seed(42)
np.random.seed(42)

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
os.makedirs(DATA_DIR, exist_ok=True)

print(f"Generating synthetic railway data into: {DATA_DIR}")

# ---------------------------------------------------------
# 1. DEPARTMENTS
# ---------------------------------------------------------
departments_data = [
    {"id": "CIVIL", "name": "Civil Track & Permanent Way", "code": "CIVIL"},
    {"id": "ELECTRICAL", "name": "Electrical Traction & OHE", "code": "OHE"},
    {"id": "SIGNAL_TELECOM", "name": "Signal & Telecommunication", "code": "S&T"},
]
df_departments = pd.DataFrame(departments_data)
df_departments.to_csv(os.path.join(DATA_DIR, "departments.csv"), index=False)

# ---------------------------------------------------------
# 2. RAILWAY ASSETS (50+ Assets)
# ---------------------------------------------------------
assets = []
asset_types_by_dept = {
    "CIVIL": ["TRACK", "TURNOUT", "SWITCH", "BRIDGE"],
    "ELECTRICAL": ["OHE", "SUBSTATION", "CANTILEVER"],
    "SIGNAL_TELECOM": ["SIGNAL", "AXLE_COUNTER", "RELAY_BOX", "CABLE"],
}

for i in range(1, 60):
    dept = random.choice(["CIVIL", "CIVIL", "ELECTRICAL", "SIGNAL_TELECOM"])
    asset_type = random.choice(asset_types_by_dept[dept])
    km = round(random.uniform(0.0, 200.0), 1)
    health = round(random.uniform(45.0, 98.0), 1)
    status = "OPERATIONAL" if health > 70 else ("MAINTENANCE_REQUIRED" if health > 50 else "DEGRADED")
    
    assets.append({
        "id": f"AST-{i:03d}",
        "asset_code": f"{asset_type}-KM-{km}",
        "name": f"{asset_type} Segment at KM {km}",
        "asset_type": asset_type,
        "department_id": dept,
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": km,
        "installation_year": random.randint(2010, 2022),
        "health_score": health,
        "status": status,
    })

df_assets = pd.DataFrame(assets)
df_assets.to_csv(os.path.join(DATA_DIR, "assets.csv"), index=False)

# ---------------------------------------------------------
# 3. MAINTENANCE REQUESTS (100+ Requests)
# ---------------------------------------------------------
task_types_by_dept = {
    "CIVIL": ["Track Rail Replacement", "Ultrasonic Flaw Detection", "Deep Ballast Tamping", "Rail Grinding", "Sleeper Fastening", "Weld Defect Rectification", "Joint Inspection"],
    "ELECTRICAL": ["OHE Wire Inspection", "Cantilever Bracket Repair", "Substation Transformer Check", "Pantograph Strip Inspection", "Insulator Wash"],
    "SIGNAL_TELECOM": ["Signal Relay Testing", "Point Machine Calibration", "Track Circuit Inspection", "Signaling Cable Trenching", "Axle Counter Maintenance"]
}

block_types = ["TRAFFIC_BLOCK", "POWER_BLOCK", "JOINT_POSSESSION", "CAUTION", "SHUTDOWN"]
priorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

maintenance_requests = []
# Ensure a dense cluster of 7 compatible jobs near KM 120-128 for spatial bundling demo
cluster_locations = [120.0, 122.0, 124.2, 124.5, 125.0, 126.0, 128.5]
for idx, km in enumerate(cluster_locations, start=1):
    dept = "CIVIL" if idx in [1, 2, 4, 6, 7] else ("ELECTRICAL" if idx == 3 else "SIGNAL_TELECOM")
    task = random.choice(task_types_by_dept[dept])
    req_id = f"MR-CLUSTER-{idx:03d}"
    src = "TMS" if dept == "CIVIL" else ("TDMS" if idx % 2 == 0 else "SMMS")
    
    maintenance_requests.append({
        "id": f"uuid-cluster-{idx}",
        "request_id": f"{src}-{idx:03d}",
        "source_system": src,
        "department_id": dept,
        "asset_id": f"AST-{idx:03d}",
        "task_type": task,
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": km,
        "latitude": 28.6 - (km * 0.005),
        "longitude": 77.2 + (km * 0.004),
        "priority": "HIGH" if idx in [1, 3, 7] else ("CRITICAL" if idx == 4 else "MEDIUM"),
        "severity": random.randint(60, 95),
        "estimated_duration_minutes": random.choice([30, 45, 60]),
        "required_block_type": "JOINT_POSSESSION" if idx == 4 else ("POWER_BLOCK" if dept == "ELECTRICAL" else "TRAFFIC_BLOCK"),
        "safety_requirements": "LOOKOUT_MAN,SPEED_RESTRICTION",
        "status": "PENDING",
        "created_at": (datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 24))).isoformat()
    })

# Add remaining up to 105 total requests spread across section
for i in range(8, 106):
    dept = random.choice(["CIVIL", "CIVIL", "ELECTRICAL", "SIGNAL_TELECOM"])
    task = random.choice(task_types_by_dept[dept])
    km = round(random.uniform(0.0, 200.0), 1)
    src = "TMS" if dept == "CIVIL" else ("TDMS" if i % 2 == 0 else "SMMS")
    prio = random.choice(priorities)
    
    maintenance_requests.append({
        "id": f"uuid-req-{i}",
        "request_id": f"{src}-{i:03d}",
        "source_system": src,
        "department_id": dept,
        "asset_id": f"AST-{(i % 50) + 1:03d}",
        "task_type": task,
        "section_id": "SEC-NDLS-AGC-01",
        "location_km": km,
        "latitude": 28.6 - (km * 0.005),
        "longitude": 77.2 + (km * 0.004),
        "priority": prio,
        "severity": random.randint(20, 90),
        "estimated_duration_minutes": random.choice([25, 30, 45, 60, 90]),
        "required_block_type": random.choice(block_types),
        "safety_requirements": "TRACK_CAUTION",
        "status": "PENDING",
        "created_at": (datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 72))).isoformat()
    })

df_maintenance = pd.DataFrame(maintenance_requests)
df_maintenance.to_csv(os.path.join(DATA_DIR, "maintenance.csv"), index=False)

# ---------------------------------------------------------
# 4. TRAINS (50+ Trains)
# ---------------------------------------------------------
trains = []
train_names_sample = [
    ("12301", "Howrah Rajdhani Express", "EXPRESS", 10),
    ("12951", "Mumbai Rajdhani Express", "EXPRESS", 10),
    ("20171", "Vande Bharat Express", "EXPRESS", 9),
    ("12002", "Bhopal Shatabdi Express", "EXPRESS", 9),
    ("12616", "Grand Trunk Express", "EXPRESS", 7),
    ("12724", "Telangana Express", "EXPRESS", 7),
    ("12448", "Uttar Pradesh Sampark Kranti", "EXPRESS", 6),
    ("12622", "Tamil Nadu Express", "EXPRESS", 7),
]

for idx, (num, name, ttype, prio) in enumerate(train_names_sample, start=1):
    trains.append({
        "id": f"TRN-{idx:03d}",
        "train_number": num,
        "train_name": name,
        "train_type": ttype,
        "priority": prio,
        "origin": "NDLS",
        "destination": "HWH/MMCT/MAS",
        "status": "ON_TIME"
    })

for i in range(9, 55):
    ttype = random.choice(["EXPRESS", "PASSENGER", "FREIGHT", "SPECIAL"])
    prio = 8 if ttype == "EXPRESS" else (4 if ttype == "PASSENGER" else 3)
    
    trains.append({
        "id": f"TRN-{i:03d}",
        "train_number": f"{12000 + i}",
        "train_name": f"Express / Freight Special {i}",
        "train_type": ttype,
        "priority": prio,
        "origin": "NDLS",
        "destination": "AGC",
        "status": "ON_TIME" if i % 6 != 0 else "DELAYED"
    })

df_trains = pd.DataFrame(trains)
df_trains.to_csv(os.path.join(DATA_DIR, "trains.csv"), index=False)

# ---------------------------------------------------------
# 5. TRAIN PATHS (500+ Records)
# ---------------------------------------------------------
train_paths = []
base_time = datetime(2026, 9, 7, 0, 0, 0, tzinfo=timezone.utc)

for t in trains:
    # Each train travels across 10 spatial segments (0-20km, 20-40km, ..., 180-200km)
    start_minute = random.randint(0, 1200)
    for seg in range(10):
        skm = seg * 20.0
        ekm = (seg + 1) * 20.0
        arr = base_time + timedelta(minutes=start_minute + (seg * 15))
        dep = arr + timedelta(minutes=10)
        
        train_paths.append({
            "id": f"PATH-{t['train_number']}-{seg}",
            "train_id": t["id"],
            "train_number": t["train_number"],
            "section_id": "SEC-NDLS-AGC-01",
            "start_km": skm,
            "end_km": ekm,
            "scheduled_arrival": arr.isoformat(),
            "scheduled_departure": dep.isoformat(),
            "actual_arrival": arr.isoformat(),
            "actual_departure": dep.isoformat(),
            "delay_minutes": 0 if t["status"] == "ON_TIME" else random.randint(10, 45)
        })

df_paths = pd.DataFrame(train_paths)
df_paths.to_csv(os.path.join(DATA_DIR, "train_paths.csv"), index=False)

# ---------------------------------------------------------
# 6. HISTORICAL DEFECTS (200+ Records for Risk ML Model)
# ---------------------------------------------------------
defects = []
for i in range(1, 250):
    age = random.randint(1, 25)
    sev = random.randint(10, 100)
    freq = random.randint(0, 10)
    failures = random.randint(0, 4)
    traffic = round(random.uniform(30.0, 120.0), 1)
    maint_delay = random.randint(0, 30)
    insp_score = round(random.uniform(40.0, 99.0), 1)
    env_factor = round(random.uniform(0.8, 1.5), 2)
    
    # Calculate empirical risk label (0-100 score)
    risk_score = min(max(round(
        (sev * 0.35) + (freq * 7.5) + (failures * 12.0) + ((100 - insp_score) * 0.25) + (age * 1.2)
    ) * env_factor, 5.0), 99.0)
    
    defects.append({
        "asset_id": f"AST-{(i % 50) + 1:03d}",
        "asset_age": age,
        "defect_severity": sev,
        "defect_frequency": freq,
        "previous_failures": failures,
        "traffic_density": traffic,
        "maintenance_delay": maint_delay,
        "inspection_score": insp_score,
        "environmental_factor": env_factor,
        "risk_score": risk_score,
    })

df_defects = pd.DataFrame(defects)
df_defects.to_csv(os.path.join(DATA_DIR, "historical_defects.csv"), index=False)

# ---------------------------------------------------------
# 7. SAFETY CONSTRAINTS (20+ Rules)
# ---------------------------------------------------------
constraints = [
    {"rule_code": "RULE-01", "rule_name": "Track Repair vs Train Movement", "primary_activity": "TRACK_REPAIR", "conflicting_activity": "TRAIN_MOVEMENT", "severity": "CRITICAL", "min_safety_buffer_minutes": 30},
    {"rule_code": "RULE-02", "rule_name": "OHE Power Isolation vs Electric Locomotives", "primary_activity": "OHE_POWER_OFF", "conflicting_activity": "ELECTRIC_TRAIN_MOVEMENT", "severity": "CRITICAL", "min_safety_buffer_minutes": 20},
    {"rule_code": "RULE-03", "rule_name": "Dust Grinding vs Signal Relays", "primary_activity": "BALLAST_GRINDING", "conflicting_activity": "SIGNAL_RELAY_INSPECTION", "severity": "HIGH", "min_safety_buffer_minutes": 15},
    {"rule_code": "RULE-04", "rule_name": "Signal Cable Digging vs Active Signaling", "primary_activity": "CABLE_DIGGING", "conflicting_activity": "ACTIVE_SIGNAL_OPERATION", "severity": "HIGH", "min_safety_buffer_minutes": 20},
    {"rule_code": "RULE-05", "rule_name": "OHE Crane Work vs High Speed Passenger", "primary_activity": "CRANE_OHE_LIFT", "conflicting_activity": "HIGH_SPEED_PASSENGER", "severity": "CRITICAL", "min_safety_buffer_minutes": 30},
    {"rule_code": "RULE-06", "rule_name": "Ultrasonic Inspection vs High Speed Movement", "primary_activity": "ULTRASONIC_TESTING", "conflicting_activity": "TRAIN_MOVEMENT", "severity": "MEDIUM", "min_safety_buffer_minutes": 15},
]
for r in range(7, 22):
    constraints.append({
        "rule_code": f"RULE-{r:02d}",
        "rule_name": f"Safety Rule {r}: Inter-department activity separation",
        "primary_activity": f"ACTIVITY_{r}_A",
        "conflicting_activity": f"ACTIVITY_{r}_B",
        "severity": random.choice(["LOW", "MEDIUM", "HIGH"]),
        "min_safety_buffer_minutes": random.choice([10, 15, 20])
    })

df_constraints = pd.DataFrame(constraints)
df_constraints.to_csv(os.path.join(DATA_DIR, "constraints.csv"), index=False)

print("All synthetic CSV datasets successfully generated!")
