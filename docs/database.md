# RETRACK – RailSync-AI Relational Database Schema
SIH 2026 Problem Statement ID: 26027

## Database Tables (PostgreSQL 15 / Supabase)

1. `users`: System users with RBAC roles (`ADMIN`, `CONTROLLER`, `STATION_MASTER`, `ENGINEER`, `FIELD_OFFICER`, `VIEWER`).
2. `departments`: Railway departments (`CIVIL`, `ELECTRICAL`, `SIGNAL_TELECOM`).
3. `railway_sections`: Corridor sections (e.g. `SEC-NDLS-AGC-01`, KM 0.0 - 200.0).
4. `assets`: Railway infrastructure assets (Track, OHE, Signal boxes, Turnouts).
5. `maintenance_requests`: Requests ingested from TMS, TDMS, and SMMS.
6. `maintenance_tasks`: Granular maintenance work items.
7. `trains`: Train master details (Priority 1-10, Type).
8. `train_paths`: Dynamic spatial-temporal timetable paths.
9. `constraints`: Safety rule matrix definitions.
10. `risk_scores`: Machine Learning predicted asset risk scores (0-100).
11. `maintenance_blocks`: Candidate and approved joint possession blocks.
12. `block_tasks`: Junction table mapping tasks to blocks.
13. `pn_requests`: Digital Private Number generation logs.
14. `pn_verifications`: Station Master verification handshakes.
15. `what_if_scenarios`: Saved simulation scenarios.
16. `alerts`: Real-time operational alerts.
17. `audit_logs`: Immutable compliance audit trail.
