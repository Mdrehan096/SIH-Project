# RETRACK – RailSync-AI SIH 2026 Hackathon Demonstration Guide
Problem Statement ID: 26027

## Predefined Demo Scenario Walkthrough

1. **Ingestion & Dashboard Overview**:
   - Navigate to `http://localhost:5173`.
   - Observe live command center KPIs and multi-source feeds status (TMS, TDMS, SMMS, COA).

2. **Multi-Department Maintenance Requests**:
   - Click **Maintenance Requests** in sidebar.
   - Filter by `CIVIL`, `ELECTRICAL`, and `SIGNAL_TELECOM`.
   - Observe 7 cluster tasks near KM 120.0 - 128.5.

3. **Railway Corridor Map**:
   - Click **Railway Corridor Map** in sidebar.
   - View spatial corridor (KM 0 - 200). Note the highlighted 5 KM Joint Bundle Zone (KM 120 - 128.5) and passing train markers.

4. **AI Block Planner Execution**:
   - Click **AI Block Planner** in sidebar.
   - Click **[GENERATE OPTIMAL BLOCK]**.
   - Observe CP-SAT solver output: Block `BLK-2026-081` scheduled for 02:00 - 03:00 AM with zero train conflicts and 94.5 optimization score.

5. **Dynamic What-If Simulation**:
   - Click **[Simulate What-If]** or navigate to **What-If Simulator**.
   - Drag train delay slider to **+20 mins** (simulating delayed Mumbai Rajdhani 12951).
   - Click **[RUN SIMULATION]**.
   - Observe side-by-side recalculation showing schedule adaptation without train conflicts.

6. **Controller Approval & Digital PN Handshake**:
   - Click **[Approve Block]**.
   - Navigate to **Digital PN Workflow**.
   - Click **[GENERATE DIGITAL PRIVATE NUMBER]** (Generates `PN-XXXXXX`).
   - Switch role view to **Station Master** and click **[VERIFY PN & AUTHORIZE POSSESSION]**.
   - Confirm status becomes `VERIFIED` and block possession becomes `ACTIVE`.
