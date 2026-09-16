# Problem Statement — SIH 2026 (ID: 26027)

## Problem Description
Indian Railways operates one of the busiest rail networks in the world. Maintenance of track geometry, overhead catenary wires (OHE), and signaling equipment requires temporary closures of rail lines, known as **maintenance block possessions**.

Currently, block planning suffers from major operational challenges:
1. **Departmental Silos:** Civil Engineering (TMS), Track Defect Cells (TDMS), and Electrical/S&T (SMMS) submit maintenance requests independently without cross-departmental coordination.
2. **Fragmented Possessions:** Multiple single-department blocks are requested on the same track section on different days, causing excessive corridor shutdown hours.
3. **Manual Conflict Resolution:** Section Controllers manually cross-reference paper timetables or COA screens, leading to train delays, speed restrictions, or rejected block requests.
4. **Safety Buffer Risks:** Inadequate buffer margins between track maintenance work and passing high-speed passenger trains introduce safety vulnerabilities.

## How RETRACK Solves It
RETRACK unifies all departmental feeds into a single normalized spatial-temporal coordinate system, predicts asset risk tiers using Machine Learning, bundles proximate maintenance jobs within a 5.0 km corridor, and uses Google OR-Tools CP-SAT to output optimal joint block possession windows that respect all train safety constraints.
