# AI Predictive Risk Engine — Scikit-Learn Model

## Overview
RETRACK incorporates an AI Predictive Asset Risk Engine powered by **Scikit-Learn Random Forest Classifier & Regressor** to estimate asset failure probabilities and prioritize maintenance possessions.

## Risk Assessment Formula & Feature Weights
The Random Forest model evaluates five core inspection features to compute an **Asset Health Risk Score (0 to 100)**:
1. **Defect Severity (Weight: 35%):** Ultrasonic flaw intensity and crack depth score (0-100).
2. **Previous Structural Failures (Weight: 25%):** Count of historical joint/rail failures on asset section.
3. **Defect Recurrence Frequency (Weight: 20%):** Frequency of defect alerts reported over 12 months.
4. **Track Geometry Inspection Score (Weight: 12%):** Alignment, gauge, and twist variance measurements.
5. **Asset Operational Age (Weight: 8%):** Years in service relative to design life.

## Risk Classification Tiers
- **CRITICAL (Risk Score 75 - 100):** Failure probability > 0.75. Immediate joint possession window mandatory.
- **HIGH (Risk Score 50 - 74):** Schedule possession within 48 hours.
- **MEDIUM (Risk Score 25 - 49):** Include in next routine maintenance bundling cycle.
- **LOW (Risk Score 0 - 24):** Normal operational condition.

## Decision Support Output
The risk engine outputs priority ranks and advisories to the CP-SAT Optimizer, ensuring high-risk assets (`TRK-124`, `OHE-124`) receive top priority when solver allocates possession time slots.
