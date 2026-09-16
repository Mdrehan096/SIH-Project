# Safety & Constraint Validation Matrix

## Overview
Safety is the paramount constraint in Indian Railways operations. RETRACK implements a automated **Safety & Constraint Validation Engine** that validates all candidate maintenance blocks against railway safety rules before approval.

## Hard vs Soft Constraints

### Hard Constraints (Never Violated)
1. **Zero Train Overlap:** No physical work or track possession can occur while a train is occupying the section track segment.
2. **Mandatory Express Safety Buffer:** Minimum **+15 minute buffer margin** required before and after high-priority trains (Vande Bharat, Rajdhani, Shatabdi).
3. **Power Block Isolation:** Electrical OHE catenary work must have verified power de-energization.
4. **Signal Red Interlock:** Signaling relay tests require signals set to red interlock.

### Soft Constraints (Optimized / Relaxed if Necessary)
1. **Freight Train Rescheduling:** Freight trains can be rerouted or held at loop lines for up to 30 minutes.
2. **Work Shift Preferences:** Maintenance work preferred during night window (01:00 AM - 04:00 AM) when passenger traffic is minimal.
3. **Non-Critical Bundling:** Lower-priority jobs can be deferred to the next available block if duration window is constrained.

## Corridor Spatial Bundling Rule
Jobs located within a **5.0 km spatial corridor** on the same line section are bundled together. This prevents multiple fragmented block closures on adjacent kilometers on consecutive days.
