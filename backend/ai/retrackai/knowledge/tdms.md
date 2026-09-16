# TDMS — Track Defect Management System

## Overview
**TDMS (Track Defect Management System)** is the specialized inspection feed tracking internal structural defects and flaw alerts across Indian Railways track infrastructure.

## Key Purpose
TDMS captures ultrasonic flaw detection (USFD) vehicle outputs, rail crack detections, weld flaw alerts, track geometry car measurements, and rail wear metrics.

## Data Provided by TDMS
- Defect ID & Location KM (e.g. `DEF-8821`, `KM 124.5`)
- Defect Category: Rail Crack, Weld Flaw, Track Geometry Deviation, Ballast Degradation
- Defect Severity Score (0 to 100)
- Recurrence Frequency & Asset Age
- Recommended Action: Immediate Rail Grinding, Emergency Rail Replacement, Speed Restriction

## Role in RETRACK Pipeline
TDMS defect records serve as primary input features for RETRACK's **Scikit-Learn Random Forest Classifier**. High severity TDMS alerts trigger elevated Asset Health Risk Scores (>75.0), automatically raising task priority to `CRITICAL` and mandating immediate joint block possession scheduling.
