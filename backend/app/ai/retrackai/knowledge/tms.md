# TMS — Track Management System

## Overview
**TMS (Track Management System)** is the primary operational data feed used by the **Civil Engineering Department** of Indian Railways.

## Key Purpose
TMS manages civil track infrastructure assets, including rail track replacement, ballast tamping, turnout renewals, joint inspections, sleeper replacements, and bridge structural maintenance.

## Data Provided by TMS
- Track Section ID & Kilometer Marker (e.g. `SEC-NDLS-AGC-01`, `KM 124.5`)
- Task Types: Rail Replacement, Ballast Tamping, Turnout Renewal, Joint Inspection
- Estimated Duration (e.g. 60–120 minutes)
- Required Block Type: `TRAFFIC_BLOCK`, `JOINT_POSSESSION`
- Priority & Severity Ratings (0 to 100)

## Role in RETRACK Pipeline
TMS items form the civil maintenance baseline in RETRACK's multi-source ingestion layer. RETRACK correlates TMS jobs with TDMS defects and SMMS electrical/signal tasks occurring within the same **5.0 km corridor** to create unified, joint block possessions.
