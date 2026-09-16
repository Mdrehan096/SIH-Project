# COA — Control Office Application

## Overview
**COA (Control Office Application)** is the authoritative train operation and movement control feed for Indian Railways.

## Key Purpose
COA tracks real-time train locations, scheduled timetables, train priority ranks, speed vectors, transit delays, and section occupancy.

## Data Provided by COA
- Train Number & Name (e.g. `12424 Dibrugarh Rajdhani Express`, `22436 Vande Bharat Express`)
- Train Priority Rank: Rank 1 (Vande Bharat / Rajdhani), Rank 2 (Shatabdi / Superfast), Rank 3 (Express / Mail), Rank 4 (Freight / Goods)
- Scheduled Departure & Arrival Timetables
- Live Speed (km/h) & Delay Status (+12 mins)
- Section Track Occupancy Vectors

## Distinguishing Maintenance vs Train Operation Feeds
- **Maintenance Feeds (TMS, TDMS, SMMS):** Supply work requirements from maintenance engineering teams.
- **Operation Feed (COA):** Supplies train movement constraints from train dispatchers.

## Role in RETRACK Pipeline
COA provides the hard constraint time windows for RETRACK's **Google OR-Tools CP-SAT Optimizer**. The solver cross-references COA train timetables to ensure zero train schedule overlaps and enforces a mandatory **+15 minute safety buffer** before and after passing high-priority express trains.
