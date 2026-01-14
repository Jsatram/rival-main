# Performance Metrics Layer (Epic 2 - Task 2.4)

**Purpose:** Define raw, first-class inputs used by Rival.  
This document intentionally avoids judgments, scores, or rankings.

---

## Principles

- Metrics are **inputs**, not conclusions
- Metrics must be explainable
- Metrics must map directly to ingested data

---

## Raw Metrics (v1)

### Match Summary

- Matches played
- Rounds played
- Kills
- Deaths
- Assists
- ACS (if available)
- Total damage
- Plants / defuses (if available)

### Contextual Dimensions

- Agent
- Map
- Mode
- Timestamp

---

## Round Kill Derived Metrics (v1)

Derived from round kill events:

### Trade Metrics (Frozen Definition)

- **Trade Window:** 5 seconds (fixed)
- A death is traded if the killer is killed by the victim’s team within 5 seconds.

> **This definition is versioned and MUST NOT change without incrementing the derived metric version and recomputing history.**

Metrics:

- Traded deaths
- Untraded deaths
- Kill trade-against

### Opening Metrics

- First kill participation
- First death participation

---

## Explicit Non-Metrics

- MVP
- “Best player”
- Aim skill
- Positioning intelligence
- Utility mastery

---

## Output Philosophy

Metrics exist to support:

- Signals
- Archetypes
- Explainable breakdowns

Metrics MUST NOT:

- declare winners
- override Riot’s labels
- claim authority
