# RETRACK – RailSync-AI Algorithm & Optimization Specification
SIH 2026 Problem Statement ID: 26027

## 1. Predictive Risk Engine (Scikit-Learn)
- Model: `RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)`
- Features: `asset_age`, `defect_severity`, `defect_frequency`, `previous_failures`, `traffic_density`, `maintenance_delay`, `inspection_score`, `environmental_factor`.
- Target: `risk_score` (0 - 100).
- Categorization:
  - 0-25: `LOW`
  - 26-50: `MEDIUM`
  - 51-75: `HIGH`
  - 76-100: `CRITICAL`

## 2. 5 KM Spatial Bundling Engine
Clusters requests based on 7 rules:
1. Spatial Proximity (`<= 5.0 km`).
2. Multi-Department Compatibility (Civil, Electrical OHE, S&T Signals).
3. Task Compatibility.
4. Block Type Consolidation (`TRAFFIC_BLOCK` + `POWER_BLOCK` -> `JOINT_POSSESSION`).
5. Duration Formula: $\text{Bundled Duration} = \max(\text{max\_single\_duration}, \text{total\_duration} \times 0.45)$.

## 3. Google OR-Tools CP-SAT Solver Formulation
- **Decision Variables**: $S_{\text{block}}$ (Start Time), $E_{\text{block}}$ (End Time), $D_{\text{block}}$ (Duration).
- **Constraints**:
  - $E_{\text{block}} = S_{\text{block}} + D_{\text{block}}$
  - Train Collision Avoidance: For every passing train $T$, $(E_{\text{block}} \le T_{\text{arrival}} - 10) \lor (S_{\text{block}} \ge T_{\text{departure}} + 10)$.
- **Multi-Objective Linear Objective**:
  $$\text{Maximize } (W_{\text{bundle}} \cdot 100) + (W_{\text{prio}} \cdot 50) - (D_{\text{block}} \cdot 2)$$
