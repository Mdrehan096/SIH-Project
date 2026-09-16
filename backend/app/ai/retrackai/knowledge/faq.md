# Frequently Asked Questions (FAQ)

## 1. What is RETRACK?
RETRACK – RailSync-AI is an AI-powered railway maintenance planning, operations coordination, and decision-support platform designed for Indian Railways.

## 2. What problem does RETRACK solve?
It solves the problem of uncoordinated, fragmented maintenance block possessions by bundling multi-departmental requests (TMS, TDMS, SMMS) into 5 km spatial corridors and computing conflict-free schedules via Google OR-Tools CP-SAT.

## 3. What is the difference between TMS, TDMS, and SMMS?
- **TMS:** Track Management System (Civil track replacement, tamping).
- **TDMS:** Track Defect Management System (Ultrasonic flaw detection, rail cracks).
- **SMMS:** Signal, Telecom & Electrical System (OHE wire tensioning, relay tests).

## 4. What is COA?
COA (Control Office Application) is the train movement control feed providing live train timetables, priority ranks, and speed vectors.

## 5. How does the Digital PN handshake work?
The Section Controller generates a cryptographic 6-digit PN code (`PN-847291`). The Station Master verifies the PN code on their portal, setting station signals to red interlock and granting safe track access.
