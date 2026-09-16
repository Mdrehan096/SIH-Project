# Relational Database Architecture — Supabase PostgreSQL

## Engine & Infrastructure
- **Database Engine:** Supabase PostgreSQL 15+
- **Connection Driver:** `supabase-py` v2.4 & Direct Pooler (`psycopg2-binary`, `asyncpg`)
- **Schema DDL:** 17 Relational Tables defined in `database/schema.sql`
- **Seed Data:** Operational demo dataset for Northern Railway (Delhi Division — NDLS / AGC corridor) in `database/seed.sql`

## Key Database Tables
1. `departments`: Railway departments (`CIVIL`, `ELECTRICAL`, `SIGNAL_TELECOM`, `OPERATIONS`).
2. `users`: User profiles with RBAC roles (`ADMIN`, `CONTROLLER`, `STATION_MASTER`, `ENGINEER`).
3. `railway_sections`: Corridor sections (e.g. `SEC-NDLS-AGC-01`, KM 0.0 to 200.0).
4. `assets`: Railway infrastructure assets (`TRK-124`, `OHE-124`, `SIG-125`) with health scores.
5. `maintenance_requests`: Unified maintenance requests ingested from TMS, TDMS, and SMMS.
6. `trains`: COA train movement schedules, priorities, and delay statuses.
7. `block_possessions`: Recommended and approved maintenance blocks.
8. `pn_requests`: Digital Private Number cryptographic handshake records.
9. `notifications`: Operational notification center alerts.
10. `retrackai_conversations`: RETRACKAI chat sessions (`id`, `user_id`, `title`, `created_at`).
11. `retrackai_messages`: RETRACKAI chat messages (`id`, `conversation_id`, `role`, `content`, `source_metadata`).
12. `retrackai_feedback`: User feedback (`message_id`, `user_id`, `is_helpful`).

## Triggers & Functions
- `update_timestamp_column()`: PL/pgSQL trigger updating `updated_at` automatically on modification.
- B-Tree and Spatial Indexes on `section_id`, `location_km`, `status`, and `priority`.
