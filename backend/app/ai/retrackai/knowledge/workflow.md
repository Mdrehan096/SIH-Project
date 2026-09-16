# System Workflow — End-to-End Decision Pipeline

## Step-by-Step System Flowchart

```
TMS (Civil) + TDMS (Defects) + SMMS (Electrical/S&T) + COA (Train Timetables)
                                │
                                ▼
                   1. Multi-Source Ingestion
                                │
                                ▼
                   2. Spatial & Temporal Normalization
                                │
                                ▼
                   3. AI Risk Scoring (Scikit-Learn Random Forest)
                                │
                                ▼
                   4. 5 km Spatial & Temporal Corridor Bundling
                                │
                                ▼
                   5. Safety & Constraint Validation (+15m Buffer)
                                │
                                ▼
                   6. Google OR-Tools CP-SAT Optimization Solver
                                │
                                ▼
                   7. Section Controller Review & Time-Slot Approval
                                │
                                ▼
                   8. Digital Private Number (PN) Code Generation (PN-847291)
                                │
                                ▼
                   9. Station Master Verification Handshake
                                │
                                ▼
                  10. Live Supabase PostgreSQL Persistence & Audit Logging
```

## Detailed Stage Descriptions
1. **Multi-Source Data Ingestion:** Collects track repair jobs (TMS), ultrasonic defect alerts (TDMS), catenary wire tensioning tasks (SMMS), and live train timetables (COA).
2. **Normalization:** Maps all items to standardized section kilometer markers (e.g. NDLS - AGC, KM 0.0 to 200.0).
3. **AI Risk Scoring:** Scikit-Learn Random Forest computes failure probabilities (0.0 to 1.0) and Health Risk Scores (0 to 100).
4. **5 km Corridor Bundling:** Aggregates jobs within a 5.0 km radius requiring line possession into single joint work groups.
5. **Safety Matrix Validation:** Enforces zero train schedule overlaps and maintains a mandatory +15 minute buffer margin around express trains.
6. **CP-SAT Optimization:** Solves a Mixed-Integer Linear Programming model to compute optimal start/end times.
7. **Controller Review & Approval:** Section Controller evaluates custom time slots and approves candidate blocks.
8. **Digital PN Generation:** Controller generates a cryptographic Private Number (`PN-847291`).
9. **Station Master Handshake:** Station Master verifies the PN code and authorizes active possession.
10. **Execution & Audit Log:** Field crews execute work (`IN_PROGRESS` -> `COMPLETED`), persisting live status changes to Supabase PostgreSQL.
