# Digital Private Number (PN) Exchange Protocol

## Overview
The **Digital Private Number (PN)** protocol is a cryptographic 2-factor handshake mechanism that replaces traditional verbal or handwritten Private Number exchanges between Section Controllers and Station Masters.

## 2-Step Handshake Protocol

### Step 1: Section Controller Generation
- After reviewing an optimized maintenance block, the Section Controller clicks **`GENERATE DIGITAL PRIVATE NUMBER`**.
- The system generates a cryptographic 6-digit code (e.g. `PN-847291`) hashed with SHA-256 HMAC.
- Record status: `PENDING_VERIFICATION`.

### Step 2: Station Master Authentication
- The Station Master at the local station (e.g. `NDLS`, `AGC`) logs into RETRACK, selects the station code, and enters/confirms the PN code (`PN-847291`).
- Upon clicking **`VERIFY PN & AUTHORIZE POSSESSION`**, the system authenticates the cryptographic handshake.
- Record status: `VERIFIED & POSSESSION ACTIVE`.
- Station signals automatically set to red interlock, granting safe track access to field crews.

## Audit Compliance & Non-Repudiation
Every PN handshake logs:
- `block_id`
- `pn_code`
- `generated_by` (Section Controller ID & Name)
- `generated_at` (UTC timestamp)
- `verified_by` (Station Master ID & Station Code)
- `verified_at` (UTC timestamp)

All log records are persisted directly to the Supabase PostgreSQL `pn_requests` table for full regulatory compliance and safety auditing.
