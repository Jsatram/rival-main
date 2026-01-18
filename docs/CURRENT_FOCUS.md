# CURRENT_FOCUS — Rival

This document describes the current development focus and near-term direction of the Rival project.
It is intended to prevent scope drift and clarify what is actively being worked on.

---

## Current Status

- Epic 3 (Player Profile Experience) is **complete**
- Analysis Core is **alive, deterministic, and tested**
- Snapshot persistence is in place (Epic 1.5)
- UI renders real computed payloads (from fixtures)
- No Riot ingestion is active yet

The system is stable and correctly layered.

---

## Active Focus

### Epic 4 — Match History & Match Detail

The next focus is defining and building **match history UX and contracts before ingestion**.

This includes:

- Match history page structure
- Public read-only match list API
- Alignment between analysis snapshot and matches shown
- Match detail routing (stub only)
- Navigation between profile and matches

No Riot ingestion work should begin until Epic 4 structure is defined.

---

## Explicitly Out of Scope (Right Now)

- Riot API ingestion
- Background recompute jobs
- Advanced filtering or charts
- Leaderboards or social features
- Insight refinement or threshold tuning

These are intentionally deferred.

---

## Guiding Rule

All UI work must:

- Read from persisted data
- Avoid recomputation
- Avoid inventing meaning
- Degrade gracefully with partial data

Architecture decisions should favor clarity over completeness.

---

## Definition of “Done” for Current Focus

Epic 4 is complete when:

- A user can view recent matches for a player
- It is clear which matches power the profile snapshot
- Match detail routes exist (even if data is minimal)
- The UI does not need to change when real ingestion begins

Once Epic 4 is complete, ingestion work may begin.
