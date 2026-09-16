-- ====================================================================
-- RETRACK – RailSync-AI Seed SQL Script
-- SIH 2026 Problem Statement ID: 26027
-- Demo Data for Northern Railway Corridor (NDLS - AGC, KM 0.0 to 200.0)
-- ====================================================================

-- 1. DEPARTMENTS
INSERT INTO departments (id, name, code, description) VALUES
('CIVIL', 'Civil Track & Permanent Way Department', 'CIVIL', 'Track maintenance, rail grinding, sleeper renewal, ballasting'),
('ELECTRICAL', 'Electrical Traction & OHE Department', 'OHE', 'Overhead Equipment (OHE), power supply, pantographs, substations'),
('SIGNAL_TELECOM', 'Signal & Telecommunication Department', 'S&T', 'Interlocking, track circuits, point machines, automatic block signaling')
ON CONFLICT (id) DO NOTHING;

-- 2. DEMO USERS
INSERT INTO users (id, email, full_name, role, department_id, station_code) VALUES
('00000000-0000-0000-0000-000000000001', 'admin@railsync.ir', 'System Administrator', 'ADMIN', 'CIVIL', 'HQ-NDLS'),
('00000000-0000-0000-0000-000000000002', 'controller@railsync.ir', 'Section Controller (NDLS-AGC)', 'CONTROLLER', 'CIVIL', 'CNTRL-NDLS'),
('00000000-0000-0000-0000-000000000003', 'sm.ndls@railsync.ir', 'Station Master (New Delhi)', 'STATION_MASTER', 'CIVIL', 'NDLS'),
('00000000-0000-0000-0000-000000000004', 'sm.agc@railsync.ir', 'Station Master (Agra Cantt)', 'STATION_MASTER', 'CIVIL', 'AGC'),
('00000000-0000-0000-0000-000000000005', 'engineer.civil@railsync.ir', 'Senior Track Engineer', 'ENGINEER', 'CIVIL', 'MT-120'),
('00000000-0000-0000-0000-000000000006', 'field.ohe@railsync.ir', 'OHE Field Officer', 'FIELD_OFFICER', 'ELECTRICAL', 'MT-124')
ON CONFLICT (email) DO NOTHING;

-- 3. RAILWAY SECTIONS
INSERT INTO railway_sections (id, section_code, name, zone, division, start_km, end_km, num_tracks, max_speed_kmh) VALUES
('SEC-NDLS-AGC-01', 'NDLS-AGC-MAIN', 'New Delhi to Agra Cantt Main Line Corridor', 'Northern Railway', 'Delhi Division', 0.00, 200.00, 2, 130)
ON CONFLICT (id) DO NOTHING;

-- 4. SAFETY CONSTRAINTS RULES MATRIX
INSERT INTO constraints (rule_code, rule_name, primary_activity, conflicting_activity, severity, min_safety_buffer_minutes, description) VALUES
('RULE-01', 'Track Repair vs Train Movement', 'TRACK_REPAIR', 'TRAIN_MOVEMENT', 'CRITICAL', 30, 'Track structural repair cannot take place with active train movement on the same track.'),
('RULE-02', 'OHE Power Inspection vs Electric Train', 'OHE_POWER_OFF', 'ELECTRIC_TRAIN_MOVEMENT', 'CRITICAL', 20, 'Electric locomotives cannot operate under isolated OHE power blocks.'),
('RULE-03', 'Dust Generating Grinding vs Open Relays', 'BALLAST_GRINDING', 'SIGNAL_RELAY_INSPECTION', 'HIGH', 15, 'Dust and vibration from ballast grinding interfere with sensitive signal relay operations.'),
('RULE-04', 'Signal Cable Digging vs Active Signaling', 'CABLE_DIGGING', 'ACTIVE_SIGNAL_OPERATION', 'HIGH', 20, 'Trench digging near trackside cables threatens automatic signal interlocks.'),
('RULE-05', 'OHE Crane Work vs High Speed Passenger', 'CRANE_OHE_LIFT', 'HIGH_SPEED_PASSENGER', 'CRITICAL', 30, 'Heavy cranes working on overhead structures require total corridor isolation.'),
('RULE-06', 'Routine Track Inspection Co-existence', 'VISUAL_INSPECTION', 'CAUTION_TRAIN_SPEED', 'LOW', 0, 'Visual foot inspection can take place under caution order speed limits.')
ON CONFLICT (rule_code) DO NOTHING;

-- 5. RAILWAY ASSETS
INSERT INTO assets (id, asset_code, name, asset_type, department_id, section_id, location_km, installation_year, health_score, status) VALUES
('TRK-120', 'TRK-KM-120-DN', 'Down Main Track Segment KM 120.0', 'TRACK', 'CIVIL', 'SEC-NDLS-AGC-01', 120.00, 2018, 72.50, 'MAINTENANCE_REQUIRED'),
('TRK-122', 'TRK-KM-122-DN', 'Down Main Track Segment KM 122.0', 'TRACK', 'CIVIL', 'SEC-NDLS-AGC-01', 122.00, 2017, 68.00, 'MAINTENANCE_REQUIRED'),
('TRK-124', 'TRK-KM-124-DN', 'Down Main Track Segment KM 124.5', 'TRACK', 'CIVIL', 'SEC-NDLS-AGC-01', 124.50, 2015, 54.00, 'DEGRADED'),
('OHE-124', 'OHE-KM-124-MAIN', 'OHE Portal & Catenary Line KM 124.2', 'OHE', 'ELECTRICAL', 'SEC-NDLS-AGC-01', 124.20, 2016, 81.00, 'MAINTENANCE_REQUIRED'),
('SIG-125', 'SIG-KM-125-INT', 'Automatic Signal Interlocking Box 125-B', 'SIGNAL', 'SIGNAL_TELECOM', 'SEC-NDLS-AGC-01', 125.00, 2019, 88.00, 'MAINTENANCE_REQUIRED'),
('TRK-126', 'TRK-KM-126-DN', 'Down Main Track Segment KM 126.0', 'TRACK', 'CIVIL', 'SEC-NDLS-AGC-01', 126.00, 2016, 75.00, 'OPERATIONAL'),
('TRK-128', 'TRK-KM-128-DN', 'Down Main Track Segment KM 128.5', 'TRACK', 'CIVIL', 'SEC-NDLS-AGC-01', 128.50, 2014, 60.00, 'MAINTENANCE_REQUIRED'),
('TRK-045', 'TRK-KM-045-UP', 'Up Main Track Segment KM 45.0', 'TRACK', 'CIVIL', 'SEC-NDLS-AGC-01', 45.00, 2020, 92.00, 'OPERATIONAL'),
('OHE-046', 'OHE-KM-046-UP', 'OHE Cantilever Bracket KM 46.0', 'OHE', 'ELECTRICAL', 'SEC-NDLS-AGC-01', 46.00, 2021, 95.00, 'OPERATIONAL'),
('SIG-180', 'SIG-KM-180-JNC', 'Agra Junction Approach Interlocking 180', 'SIGNAL', 'SIGNAL_TELECOM', 'SEC-NDLS-AGC-01', 180.00, 2015, 62.00, 'MAINTENANCE_REQUIRED')
ON CONFLICT (id) DO NOTHING;

-- 6. SYNTHETIC MAINTENANCE REQUESTS (10 Tasks for Demo Scenario)
-- 7 tasks are close together around KM 120-128 (Ideal 5km spatial bundle candidates)
-- 3 tasks are distant (KM 45, KM 46, KM 180)
INSERT INTO maintenance_requests 
(id, request_id, source_system, department_id, asset_id, task_type, section_id, location_km, priority, severity, estimated_duration_minutes, required_block_type, safety_requirements, status) 
VALUES
('10000000-0000-0000-0000-000000000001', 'TMS-001', 'TMS', 'CIVIL', 'TRK-120', 'Track Rail Replacement', 'SEC-NDLS-AGC-01', 120.00, 'HIGH', 78, 45, 'TRAFFIC_BLOCK', ARRAY['SPEED_RESTRICTION_30KMH', 'LOOKOUT_MAN'], 'PENDING'),
('10000000-0000-0000-0000-000000000002', 'TDMS-002', 'TDMS', 'CIVIL', 'TRK-122', 'Ultrasonic Rail Flaw Detection Repair', 'SEC-NDLS-AGC-01', 122.00, 'MEDIUM', 62, 30, 'TRAFFIC_BLOCK', ARRAY['TRACK_CAUTION'], 'PENDING'),
('10000000-0000-0000-0000-000000000003', 'SMMS-003', 'SMMS', 'ELECTRICAL', 'OHE-124', 'OHE Catenary Wire Inspection & Tensioning', 'SEC-NDLS-AGC-01', 124.20, 'HIGH', 82, 40, 'POWER_BLOCK', ARRAY['OHE_DISCONNECT', 'EARTH_ROD_PLACEMENT'], 'PENDING'),
('10000000-0000-0000-0000-000000000004', 'TMS-004', 'TMS', 'CIVIL', 'TRK-124', 'Deep Ballast Tamp & Rail Grinding', 'SEC-NDLS-AGC-01', 124.50, 'CRITICAL', 90, 60, 'JOINT_POSSESSION', ARRAY['TRAFFIC_BLOCK', 'POWER_BLOCK'], 'PENDING'),
('10000000-0000-0000-0000-000000000005', 'SMMS-005', 'SMMS', 'SIGNAL_TELECOM', 'SIG-125', 'Signal Relay Box & Track Circuit Testing', 'SEC-NDLS-AGC-01', 125.00, 'MEDIUM', 55, 30, 'CAUTION', ARRAY['SIGNAL_DISCONNECT_MEMO'], 'PENDING'),
('10000000-0000-0000-0000-000000000006', 'TMS-006', 'TMS', 'CIVIL', 'TRK-126', 'Sleeper Fastening & Bolt Tightening', 'SEC-NDLS-AGC-01', 126.00, 'LOW', 35, 25, 'CAUTION', ARRAY['LOOKOUT_MAN'], 'PENDING'),
('10000000-0000-0000-0000-000000000007', 'TDMS-007', 'TDMS', 'CIVIL', 'TRK-128', 'Weld Defect Rectification', 'SEC-NDLS-AGC-01', 128.50, 'HIGH', 74, 35, 'TRAFFIC_BLOCK', ARRAY['SPEED_RESTRICTION_20KMH'], 'PENDING'),

-- Out of bundle distance requests
('10000000-0000-0000-0000-000000000008', 'TMS-008', 'TMS', 'CIVIL', 'TRK-045', 'Routine Track Geometry Inspection', 'SEC-NDLS-AGC-01', 45.00, 'LOW', 25, 30, 'CAUTION', ARRAY['LOOKOUT_MAN'], 'PENDING'),
('10000000-0000-0000-0000-000000000009', 'SMMS-009', 'SMMS', 'ELECTRICAL', 'OHE-046', 'OHE Insulator Cleaning', 'SEC-NDLS-AGC-01', 46.00, 'LOW', 30, 30, 'POWER_BLOCK', ARRAY['OHE_DISCONNECT'], 'PENDING'),
('10000000-0000-0000-0000-000000000010', 'SMMS-010', 'SMMS', 'SIGNAL_TELECOM', 'SIG-180', 'Point Machine Calibration', 'SEC-NDLS-AGC-01', 180.00, 'HIGH', 80, 45, 'TRAFFIC_BLOCK', ARRAY['SIGNAL_MEMO'], 'PENDING')
ON CONFLICT (id) DO NOTHING;

-- 7. TRAINS
INSERT INTO trains (id, train_number, train_name, train_type, priority, origin, destination, status) VALUES
('20000000-0000-0000-0000-000000000001', '12301', 'Howrah Rajdhani Express', 'EXPRESS', 10, 'NDLS', 'HWH', 'ON_TIME'),
('20000000-0000-0000-0000-000000000002', '12951', 'Mumbai Rajdhani Express', 'EXPRESS', 10, 'NDLS', 'MMCT', 'ON_TIME'),
('20000000-0000-0000-0000-000000000003', '20171', 'Rani Kamlapati Vande Bharat', 'EXPRESS', 9, 'NDLS', 'RKMP', 'ON_TIME'),
('20000000-0000-0000-0000-000000000004', '12002', 'Bhopal Shatabdi Express', 'EXPRESS', 9, 'NDLS', 'VGLJ', 'ON_TIME'),
('20000000-0000-0000-0000-000000000005', '12616', 'Grand Trunk Express', 'EXPRESS', 7, 'NDLS', 'MAS', 'ON_TIME'),
('20000000-0000-0000-0000-000000000006', '12724', 'Telangana Express', 'EXPRESS', 7, 'NDLS', 'HYB', 'ON_TIME'),
('20000000-0000-0000-0000-000000000007', 'BOXN-8821', 'Container Freight Special', 'FREIGHT', 3, 'TKD', 'AGC', 'ON_TIME'),
('20000000-0000-0000-0000-000000000008', '04418', 'NDLS-AGC Passenger Special', 'PASSENGER', 4, 'NDLS', 'AGC', 'ON_TIME')
ON CONFLICT (id) DO NOTHING;

-- 8. TRAIN PATHS (Timetable Timings around KM 120-128 Corridor)
-- Demo timeframe: 2026-09-07 (01:00 AM to 05:00 AM)
INSERT INTO train_paths (id, train_id, section_id, start_km, end_km, scheduled_arrival, scheduled_departure, delay_minutes) VALUES
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'SEC-NDLS-AGC-01', 115.00, 130.00, '2026-09-07 01:15:00+05:30', '2026-09-07 01:25:00+05:30', 0),
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'SEC-NDLS-AGC-01', 115.00, 130.00, '2026-09-07 02:40:00+05:30', '2026-09-07 02:50:00+05:30', 0),
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'SEC-NDLS-AGC-01', 115.00, 130.00, '2026-09-07 03:25:00+05:30', '2026-09-07 03:35:00+05:30', 0),
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', 'SEC-NDLS-AGC-01', 115.00, 130.00, '2026-09-07 04:10:00+05:30', '2026-09-07 04:20:00+05:30', 0),
('30000000-0000-0000-0000-000000000007', '20000000-0000-0000-0000-000000000007', 'SEC-NDLS-AGC-01', 115.00, 130.00, '2026-09-07 04:45:00+05:30', '2026-09-07 05:05:00+05:30', 0)
ON CONFLICT (id) DO NOTHING;
