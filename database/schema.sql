-- ====================================================================
-- RETRACK – RailSync-AI PostgreSQL Database Schema
-- SIH 2026 Problem Statement ID: 26027
-- PostgreSQL Version: 15+ (Supabase Compatible)
-- ====================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- TRIGGER FUNCTION: Automatic updated_at Timestamp
-- ====================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- ====================================================================
-- 1. DEPARTMENTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 2. USERS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'CONTROLLER', 'STATION_MASTER', 'ENGINEER', 'FIELD_OFFICER', 'VIEWER')),
    department_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    station_code VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 3. RAILWAY SECTIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS railway_sections (
    id VARCHAR(100) PRIMARY KEY,
    section_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    division VARCHAR(50) NOT NULL,
    start_km NUMERIC(8, 2) NOT NULL CHECK (start_km >= 0),
    end_km NUMERIC(8, 2) NOT NULL CHECK (end_km > start_km),
    num_tracks INT NOT NULL DEFAULT 2 CHECK (num_tracks > 0),
    max_speed_kmh INT NOT NULL DEFAULT 130,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 4. ASSETS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS assets (
    id VARCHAR(100) PRIMARY KEY,
    asset_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('TRACK', 'OHE', 'SIGNAL', 'TURNOUT', 'BRIDGE', 'SWITCH', 'CABLE')),
    department_id VARCHAR(50) NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    section_id VARCHAR(100) NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    location_km NUMERIC(8, 2) NOT NULL,
    installation_year INT,
    health_score NUMERIC(5, 2) DEFAULT 100.00 CHECK (health_score BETWEEN 0 AND 100),
    status VARCHAR(50) DEFAULT 'OPERATIONAL' CHECK (status IN ('OPERATIONAL', 'MAINTENANCE_REQUIRED', 'UNDER_MAINTENANCE', 'DEGRADED', 'OUT_OF_SERVICE')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 5. MAINTENANCE REQUESTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id VARCHAR(100) NOT NULL UNIQUE,
    source_system VARCHAR(20) NOT NULL CHECK (source_system IN ('TMS', 'TDMS', 'SMMS')),
    department_id VARCHAR(50) NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    asset_id VARCHAR(100) REFERENCES assets(id) ON DELETE SET NULL,
    task_type VARCHAR(100) NOT NULL,
    section_id VARCHAR(100) NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    location_km NUMERIC(8, 2) NOT NULL,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    severity INT NOT NULL DEFAULT 50 CHECK (severity BETWEEN 0 AND 100),
    estimated_duration_minutes INT NOT NULL CHECK (estimated_duration_minutes > 0),
    required_block_type VARCHAR(50) NOT NULL CHECK (required_block_type IN ('SHUTDOWN', 'CAUTION', 'POWER_BLOCK', 'TRAFFIC_BLOCK', 'JOINT_POSSESSION')),
    safety_requirements TEXT[] DEFAULT '{}',
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VALIDATED', 'BUNDLED', 'SCHEDULED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 6. MAINTENANCE TASKS TABLE (Granular/Bundled Tasks)
-- ====================================================================
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_code VARCHAR(100) NOT NULL UNIQUE,
    request_id UUID NOT NULL REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    bundle_id VARCHAR(100),
    department_id VARCHAR(50) NOT NULL REFERENCES departments(id),
    location_km NUMERIC(8, 2) NOT NULL,
    duration_minutes INT NOT NULL,
    required_crew_size INT DEFAULT 4,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 7. TRAINS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS trains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_number VARCHAR(50) NOT NULL UNIQUE,
    train_name VARCHAR(255) NOT NULL,
    train_type VARCHAR(30) NOT NULL CHECK (train_type IN ('EXPRESS', 'PASSENGER', 'FREIGHT', 'SPECIAL')),
    priority INT NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    status VARCHAR(30) DEFAULT 'ON_TIME' CHECK (status IN ('ON_TIME', 'DELAYED', 'HALTED', 'CANCELLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 8. TRAIN PATHS TABLE (Spatial-Temporal Timetable)
-- ====================================================================
CREATE TABLE IF NOT EXISTS train_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id UUID NOT NULL REFERENCES trains(id) ON DELETE CASCADE,
    section_id VARCHAR(100) NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    start_km NUMERIC(8, 2) NOT NULL,
    end_km NUMERIC(8, 2) NOT NULL,
    scheduled_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_departure TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_arrival TIMESTAMP WITH TIME ZONE,
    actual_departure TIMESTAMP WITH TIME ZONE,
    delay_minutes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 9. CONSTRAINTS TABLE (Safety Rules Matrix)
-- ====================================================================
CREATE TABLE IF NOT EXISTS constraints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_code VARCHAR(100) NOT NULL UNIQUE,
    rule_name VARCHAR(255) NOT NULL,
    primary_activity VARCHAR(100) NOT NULL,
    conflicting_activity VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    min_safety_buffer_minutes INT DEFAULT 15,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 10. RISK SCORES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    asset_id VARCHAR(100) REFERENCES assets(id) ON DELETE CASCADE,
    risk_score NUMERIC(5, 2) NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    risk_category VARCHAR(20) NOT NULL CHECK (risk_category IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    failure_probability NUMERIC(5, 4) CHECK (failure_probability BETWEEN 0 AND 1),
    feature_importance JSONB DEFAULT '{}',
    model_version VARCHAR(50) NOT NULL DEFAULT 'rf-v1.0',
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 11. MAINTENANCE BLOCKS TABLE (Optimal Possessions)
-- ====================================================================
CREATE TABLE IF NOT EXISTS maintenance_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id VARCHAR(100) NOT NULL UNIQUE,
    section_id VARCHAR(100) NOT NULL REFERENCES railway_sections(id) ON DELETE CASCADE,
    start_km NUMERIC(8, 2) NOT NULL,
    end_km NUMERIC(8, 2) NOT NULL,
    scheduled_start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    tasks_bundled_count INT NOT NULL DEFAULT 0,
    departments TEXT[] DEFAULT '{}',
    affected_trains_count INT NOT NULL DEFAULT 0,
    risk_score NUMERIC(5, 2) DEFAULT 0.0,
    optimization_score NUMERIC(5, 2) DEFAULT 0.0,
    status VARCHAR(30) NOT NULL DEFAULT 'RECOMMENDED' CHECK (status IN ('RECOMMENDED', 'APPROVED', 'PN_GENERATED', 'PN_VERIFIED', 'ACTIVE', 'COMPLETED', 'REJECTED', 'CANCELLED')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 12. BLOCK TASKS JUNCTION TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS block_tasks (
    block_id UUID NOT NULL REFERENCES maintenance_blocks(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES maintenance_tasks(id) ON DELETE CASCADE,
    PRIMARY KEY (block_id, task_id)
);

-- ====================================================================
-- 13. PN REQUESTS TABLE (Digital Private Number Handshake)
-- ====================================================================
CREATE TABLE IF NOT EXISTS pn_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_id UUID NOT NULL REFERENCES maintenance_blocks(id) ON DELETE CASCADE,
    pn_code VARCHAR(50) NOT NULL UNIQUE,
    generated_by UUID NOT NULL REFERENCES users(id),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'GENERATED' CHECK (status IN ('GENERATED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'EXPIRED', 'CLOSED')),
    expiry_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 14. PN VERIFICATIONS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS pn_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pn_request_id UUID NOT NULL REFERENCES pn_requests(id) ON DELETE CASCADE,
    verified_by UUID NOT NULL REFERENCES users(id),
    station_code VARCHAR(50) NOT NULL,
    verification_code VARCHAR(50) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT
);

-- ====================================================================
-- 15. WHAT-IF SCENARIOS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS what_if_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_name VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES users(id),
    input_parameters JSONB NOT NULL,
    baseline_output JSONB NOT NULL,
    simulated_output JSONB NOT NULL,
    impact_metrics JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 16. ALERTS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    section_id VARCHAR(100) REFERENCES railway_sections(id),
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 17. AUDIT LOGS TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 18. TMS FEED MESSAGES TABLE
-- ====================================================================
CREATE TABLE IF NOT EXISTS tms_feed_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id VARCHAR(100) NOT NULL UNIQUE,
    source VARCHAR(50) DEFAULT 'TMS',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    section_id VARCHAR(100) NOT NULL DEFAULT 'SEC-NDLS-AGC-01',
    track_id VARCHAR(100) NOT NULL,
    location_km NUMERIC(8, 2) NOT NULL,
    maintenance_type VARCHAR(150) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(30) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'PENDING', 'PROCESSED', 'COMPLETED', 'REJECTED')),
    raw_payload JSONB DEFAULT '{}',
    normalized_payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 19. TDMS FEED MESSAGES TABLE (Track Defects)
-- ====================================================================
CREATE TABLE IF NOT EXISTS tdms_feed_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id VARCHAR(100) NOT NULL UNIQUE,
    source VARCHAR(50) DEFAULT 'TDMS',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    track_id VARCHAR(100) NOT NULL,
    location_km NUMERIC(8, 2) NOT NULL,
    defect_type VARCHAR(150) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    risk_score NUMERIC(5, 2) DEFAULT 50.00 CHECK (risk_score BETWEEN 0 AND 100),
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    raw_payload JSONB DEFAULT '{}',
    normalized_payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 20. SMMS FEED MESSAGES TABLE (OHE & S&T Maintenance)
-- ====================================================================
CREATE TABLE IF NOT EXISTS smms_feed_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id VARCHAR(100) NOT NULL UNIQUE,
    source VARCHAR(50) DEFAULT 'SMMS',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    department VARCHAR(50) NOT NULL CHECK (department IN ('OHE', 'SIGNAL', 'TELECOM', 'ELECTRICAL', 'SIGNAL_TELECOM')),
    asset_id VARCHAR(100) NOT NULL,
    location_km NUMERIC(8, 2) NOT NULL,
    issue_type VARCHAR(150) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    maintenance_required BOOLEAN DEFAULT TRUE,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'PENDING', 'PROCESSED', 'COMPLETED', 'REJECTED')),
    raw_payload JSONB DEFAULT '{}',
    normalized_payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 21. COA TRAINS & ROUTES TABLES (Control Office Application)
-- ====================================================================
CREATE TABLE IF NOT EXISTS coa_routes (
    id VARCHAR(100) PRIMARY KEY,
    route_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    origin_station VARCHAR(50) NOT NULL,
    destination_station VARCHAR(50) NOT NULL,
    total_distance_km NUMERIC(8, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coa_route_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id VARCHAR(100) NOT NULL REFERENCES coa_routes(id) ON DELETE CASCADE,
    station_code VARCHAR(50) NOT NULL,
    station_name VARCHAR(255) NOT NULL,
    sequence_order INT NOT NULL,
    distance_from_origin_km NUMERIC(8, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS coa_trains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    train_id VARCHAR(50) NOT NULL UNIQUE,
    train_number VARCHAR(50) NOT NULL UNIQUE,
    train_name VARCHAR(255) NOT NULL,
    origin VARCHAR(50) NOT NULL,
    destination VARCHAR(50) NOT NULL,
    current_station VARCHAR(50) NOT NULL,
    next_station VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'RUNNING' CHECK (status IN ('SCHEDULED', 'RUNNING', 'DELAYED', 'ARRIVED', 'CANCELLED')),
    scheduled_departure VARCHAR(20),
    estimated_arrival VARCHAR(20),
    delay_minutes INT DEFAULT 0,
    route_id VARCHAR(100) REFERENCES coa_routes(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_maint_req_location ON maintenance_requests(section_id, location_km, status);
CREATE INDEX IF NOT EXISTS idx_maint_req_dept_status ON maintenance_requests(department_id, status);
CREATE INDEX IF NOT EXISTS idx_train_paths_spatial_time ON train_paths(section_id, scheduled_arrival, scheduled_departure);
CREATE INDEX IF NOT EXISTS idx_train_paths_start_end_km ON train_paths(start_km, end_km);
CREATE INDEX IF NOT EXISTS idx_blocks_spatial_time ON maintenance_blocks(section_id, scheduled_start_time, scheduled_end_time);
CREATE INDEX IF NOT EXISTS idx_blocks_status ON maintenance_blocks(status);
CREATE INDEX IF NOT EXISTS idx_assets_location ON assets(section_id, location_km);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tms_feed_status ON tms_feed_messages(status, priority, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tdms_feed_status ON tdms_feed_messages(status, severity, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_smms_feed_dept ON smms_feed_messages(department, status, timestamp DESC);
-- ====================================================================
-- RETRACKAI CHAT CONVERSATIONS & MESSAGES TABLES
-- ====================================================================
CREATE TABLE IF NOT EXISTS retrackai_conversations (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS retrackai_messages (
    id VARCHAR(100) PRIMARY KEY,
    conversation_id VARCHAR(100) NOT NULL REFERENCES retrackai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('USER', 'ASSISTANT')),
    content TEXT NOT NULL,
    data_type VARCHAR(50),
    data JSONB,
    sources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS retrackai_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    is_helpful BOOLEAN NOT NULL,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_retrackai_conv_user ON retrackai_conversations(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_retrackai_msg_conv ON retrackai_messages(conversation_id, created_at ASC);


