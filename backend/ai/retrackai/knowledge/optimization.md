# Optimization Engine — Google OR-Tools CP-SAT Solver

## Overview
RETRACK uses **Google OR-Tools CP-SAT (Constraint Programming - Satisfiability)** to solve a Mixed-Integer Linear Programming (MILP) model for optimal maintenance block possession scheduling.

## Technical Components of CP-SAT Implementation

### 1. Decision Variables
- `start_time[i]`: Integer start time (minute of day) for maintenance block `i`.
- `end_time[i]`: Integer end time for maintenance block `i`.
- `is_active[i]`: Binary variable (0 or 1) indicating if block `i` is scheduled.

### 2. Constraints (Hard Rules)
- **Time Window Bounds:** Block start and end times must fit within allowed engineering work shift boundaries.
- **Duration Constraint:** `end_time[i] - start_time[i] >= required_duration[i]`.
- **No Train Conflict Constraint:** No maintenance block can overlap with passing train occupancy windows.
- **Safety Buffer Margin:** Enforces minimum **+15 minute buffer** between block end time and express train arrival time.
- **Corridor Spatial Bundling:** Jobs within 5.0 km must share the same start/end time boundaries.

### 3. Objective Function (Multi-Objective Optimization)
Maximize the weighted sum:
```
Maximize: (W1 * Total_Jobs_Bundled) + (W2 * Priority_Weight) - (W3 * Total_Corridor_Possession_Hours) - (W4 * Train_Delays)
```
Where:
- `W1` = 100 (high incentive to bundle multiple jobs)
- `W2` = 50 (priority weighting for CRITICAL tasks)
- `W3` = 30 (penalty for excessive track closure duration)
- `W4` = 200 (heavy penalty for causing passenger train delays)

### 4. Feasibility & Re-Optimization
If constraints produce no feasible window, the solver relaxes soft constraints (e.g. adjusts low-priority freight train schedules) to return a feasible schedule while preserving hard safety rules.
