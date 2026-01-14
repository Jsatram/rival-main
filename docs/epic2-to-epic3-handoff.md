# Epic 2 -> Epic 3 Handoff (Epic 2 - Task 2.10)

**Purpose:** Make Epic 3 execution mechanical by locking what is decided and listing what remains open.

---

## What Epic 3 Should Implement

1. **Database schema**
   - Translate `/docs/identity-model.md` into tables/constraints.
   - Translate `/docs/match-model.md` into match + match_player (+ kill events if in scope).

2. **Ingestion skeleton**
   - Create idempotent ingestion flow for match index + match details.
   - Store raw facts according to `/docs/ingestion-scope.md`.

3. **Basic aggregates (optional)**
   - Either compute on read or store minimal aggregates for profile views.

---

## What Epic 3 Must NOT Redesign

- Canonical identity = PUUID
- Opt-in gates ingestion and display
- Match records are immutable + idempotent
- Ingestion scope v1 boundaries (unless updated explicitly)

---

## Open / Deferred Items

- Final retention policy after opt-out/unlink
- Patch/season mapping strategy if patch id unavailable
- Whether assistants are normalized vs stored as array
- Whether round kill events are strictly v1 required (scope currently includes them)

---

## Known Risks

- Riot API constraints and rate limits may shape cadence decisions.
- RSO integration details may require adjusting retention/permissions model.
- Round-level data increases storage/compute; keep it lightweight (kills only in v1).

---

## Epic 2 Completion Checklist

- [x] /docs/ingestion-scope.md
- [x] /docs/identity-model.md
- [x] /docs/match-model.md
- [x] /docs/metrics-layer.md
- [x] /docs/aggregation-strategy.md
- [x] /docs/signals.md
- [x] /docs/archetypes.md
- [x] /docs/unorthodox-playstyles.md
- [x] /docs/update-cadence.md
- [x] /docs/epic2-to-epic3-handoff.md

