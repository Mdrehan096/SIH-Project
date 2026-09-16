# SMMS — Signal, Telecom & Electrical Maintenance System

## Overview
**SMMS (Signal, Telecom & Electrical Maintenance Management System)** manages electrification and signaling assets for Indian Railways.

## Key Purpose
SMMS covers Overhead Equipment (OHE) catenary wires, traction substations, electronic interlocking relays, axle counters, track circuits, and point machine testing.

## Data Provided by SMMS
- Asset ID & Location KM (e.g. `OHE-124`, `SIG-125`, `KM 124.2`)
- Task Types: OHE Wire Tensioning, Interlocking Relay Test, Axle Counter Calibration, Point Machine Overhaul
- Required Block Type: `POWER_BLOCK`, `SHUTDOWN`, `JOINT_POSSESSION`
- Safety Requirements: OHE Power De-energization, Signal Red Interlock

## Role in RETRACK Pipeline
SMMS maintenance tasks require power shutdowns or signaling holds. RETRACK bundles SMMS tasks alongside TMS civil jobs during single 5 km track closures, preventing separate electrical power shutdowns on consecutive days.
