# Rival — Realign → Epic 3 Handoff

## Purpose

This document formally hands off work from the `realign` branch into a new Epic 3 branch, resetting Epic 3 implementation while preserving all correct foundational work.

Intent:
Start Epic 3 cleanly from a stable, correct Epic 2 output contract and analysis engine.
All prior Epic 3 attempts should be considered obsolete and ignored.

---

## Branch Status

### Source of Truth

- Branch: realign
- State: Stable, tested, TypeScript-clean
- Tests: All passing (analysis-core)

### Action Taken

- Old epic/3.x branch is abandoned
- A new Epic 3 branch should be created from realign

Commands:

git checkout realign  
git checkout -b epic/3.0

---

## What Is Complete (Do NOT redo)

### Epic 0 — Foundation

- App shell, layout, nav
- Session handling
- Compliance scaffolding
- Repo hygiene

### Epic 1 — Identity & Opt-In

- Riot identity modeling
- Opt-in persistence
- Session-safe user model
- Centralized enforcement
- Fixture-ready for Riot-blocked data

### Epic 2 — Insight Engine (COMPLETE)

Epic 2 is no longer conceptual — it is fully implemented and tested.

#### Implemented Modules

Signals

- computeSignals(matches)
- Deterministic
- Fixture-based
- Minimum signal padding enforced

Role Fit

- Agent → role inference
- Declared vs expressed role
- Fit score + explanation
- Tested edge cases

Archetypes

- 7 archetypes scored (entry, support, anchor, lurker, playmaker, igl, flex)
- Primary + secondary selection
- Deterministic heuristics
- Fully unit-tested

Fixtures

- Match-summary fixtures load correctly
- Deterministic timestamps supported
- Safe path resolution

Canonical Output Contract

- PlayerProfilePayload
- Stable and UI-ready

---

## The Epic 3 Input Contract (DO NOT CHANGE)

Epic 3 must treat this as immutable.

PlayerProfilePayload includes:

- signals (SignalSummary[], minimum 5)
- archetypeScores (primary, secondary, scores)
- roleFit (declaredRole, expressedRole, fitScore, reason)
- unorthodox (deviationScore, efficiencyScore, tag, reason)
- confidence (level, reason)
- matchesAnalyzed
- window (matches, label)
- lastComputedAt (ISO string)

Epic 3 renders this object.
Epic 3 does not compute or mutate it.

---

## What Epic 3 Is Allowed To Do

Allowed:

- Render
- Visualize
- Explain
- Compare
- Label
- Group
- Animate
- Hide/show based on confidence

Not Allowed:

- Recompute signals
- Re-score archetypes
- Reinterpret role fit
- Add ingestion logic
- Touch Riot APIs

---

## Epic 3 Scope (Reset and Clear)

Core Goals:

- Player profile page
- Insight cards (signals, archetypes, role fit)
- Clear explanations and confidence messaging
- Beta labeling and privacy reminders

Out of Scope:

- Match ingestion
- Background workers
- Admin/debug endpoints
- Full match timelines
- Sync services

These belong to future epics, not Epic 3.

---

## Recommended Epic 3 First Tasks

1. Profile Page Skeleton
   - Route: /player/[gameName]-[tag]
   - Accept mock PlayerProfilePayload

2. Signal Cards
   - Score
   - Evidence
   - Confidence badge

3. Archetype Summary
   - Primary + secondary
   - Bar chart or ranked list

4. Role Fit Panel
   - Declared vs expressed
   - Fit score visualization
   - Reason text

5. Unorthodox Callout
   - Tag + explanation
   - Deviation vs efficiency framing

---

## Non-Goals Reminder

Epic 3 is presentation, not intelligence.

If you feel tempted to:

- tweak scoring
- add stats
- recompute logic for UI

Stop. That belongs to Epic 2 or later.

---

## Final Notes

- realign is now the clean foundation
- Epic 2 is done
- Epic 3 starts fresh, focused, and unblocked
- Old Epic 3 work should not be merged or referenced

This handoff exists to prevent future context drift.

Status: Ready to begin Epic 3  
Confidence: High
