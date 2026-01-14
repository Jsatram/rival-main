# Player Identity Model (Epic 2 - Task 2.2)

**Purpose:** Define how a Rival account maps to Riot identity over time, including opt-in state, reconnect behavior, and strict ingestion permission boundaries.

This document is a **hard contract**. Epic 3+ implementation MUST follow these rules unless this document is explicitly updated.

---

## Principles

1. **Rival identity is primary**

   - A user has a Rival account independent of Riot linkage state.
   - Riot linkage is an attribute, not the identity itself.

2. **PUUID is the canonical Riot identifier**

   - Display names are mutable and UX-only.
   - All identity, joins, and ingestion decisions use PUUID.

3. **Consent gates ingestion**

   - Opt-in controls **data collection**, not just display.
   - Opt-out revokes permission for _any_ further processing.

4. **Linking is explicit and auditable**
   - All link/unlink/opt actions are timestamped and traceable.

---

## Entity Overview (Conceptual)

### Rival User

- `rival_user_id`
- `created_at`
- `updated_at`

### Riot Account Link (v1: one active link max)

- `rival_user_id`
- `riot_puuid`
- `riot_region`
- `riot_game_name` (display only)
- `riot_tag_line` (display only)
- `link_status` (ACTIVE | UNLINKED | REVOKED)
- `linked_at`
- `unlinked_at`

---

## Opt-In State Machine

### States

- `NOT_OPTED_IN`
- `OPTED_IN`
- `OPTED_OUT`

### Rules

#### Default

- New linked users start as `NOT_OPTED_IN`.

#### Opt In

- Transition: `NOT_OPTED_IN` → `OPTED_IN`
- Effects:
  - Rival may begin ingestion.
  - Rival may display stats publicly.

#### Opt Out

- Transition: `OPTED_IN` → `OPTED_OUT`
- Effects:
  - **Immediately stop all ingestion**
  - **Immediately stop all background sync**
  - **Immediately remove all public visibility**
  - Previously collected data becomes inactive and hidden.

### Required Fields

- `opt_in_status`
- `opted_in_at`
- `opted_out_at`

---

## Ingestion Permission Rules (Hard Requirement)

Rival MAY ingest data **only if ALL are true**:

- Riot link status = `ACTIVE`
- Opt-in status = `OPTED_IN`

### Explicit Prohibition

> **Opted-out users MUST NOT be included in any ingestion, backfill, reprocessing, recomputation, or analytics jobs — including internal or non-public analyses.**

This applies regardless of data visibility.

---

## Reconnect / Relink Behavior

### Unlink Riot Account

- Set link status → `UNLINKED`
- Set `unlinked_at`
- Force opt-in status → `OPTED_OUT`
- Stop ingestion immediately

### Relink Same PUUID

- Create new ACTIVE link
- Previous data remains hidden
- User must explicitly opt in again (v1 requirement)

### Relink Different PUUID

- Old dataset becomes inactive
- New PUUID treated as a new tracked subject
- No merging of datasets in v1

---

## Data Retention (v1 Default)

- Previously ingested data may be retained internally **in a fully inactive state**
- Retained data MUST NOT:
  - be updated
  - be recomputed
  - be used in analytics
  - be surfaced in any form

Retention duration and deletion policy are deferred to a future epic.

---

## v1 UX Note

In v1, Rival may treat successful Riot Sign-On (RSO) with **explicit consent language** as an opt-in event.  
Internally, the full state machine remains intact for future flexibility.

---

## Open Questions (Deferred)

- Retention duration after opt-out
- Re-consent behavior after policy changes
- Multi-account support under one Rival user
