# Update Cadence Strategy (Epic 2 - Task 2.9)

**Purpose:** Define when Rival refreshes data for opted-in users. This is strategy-only; implementation comes later.

---

## Principles

1. **Opt-in only**
   - Only opted-in + actively linked users are eligible for syncing.

2. **Rate-limit aware**
   - Sync strategy must respect Riot rate limits.

3. **Prioritize active players**
   - Active users get fresher data; inactive users can be synced less often.

---

## Candidate Strategies

### Strategy A: Nightly Batch (MVP-friendly)
- Run nightly for all opted-in users.
- Simple operational model.

### Strategy B: Incremental (Detect new matches)
- Track last seen match id/time.
- Fetch only new matches.

### Strategy C: On-demand + Background
- On login/profile view: quick check for new match ids.
- Queue background sync if needed.

---

## Recommended v1 Approach

- Start with **Strategy A or C** for simplicity.
- Move to **Strategy B** when scaling requires it.

---

## Guardrails (Design Contract)

- Maintain `last_sync_at` per user.
- Sync must be idempotent and safe to re-run.
- Stop syncing immediately on opt-out/unlink.

---

## Open Questions (Track for Later)

- What is the expected active user distribution?
- Do we need “sync priority tiers” (daily/weekly)?

