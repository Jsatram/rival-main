# Rival — Token Strategy (Riot RSO)

## Purpose

Rival is an opt-in Valorant stats tracking app. Users explicitly connect their Riot account via Riot Sign On (RSO). Once opted in, Rival intends to keep stats updated automatically until the user opts out.

This document describes how Rival will handle Riot OAuth tokens in a secure and compliant way.

---

## Core Principles

### 1) Opt-in is required for visibility and updates

- Rival will NEVER display stats for a player who has not opted in.
- Opt-in status is stored in the database and is the source of truth.
- Session state is UI-only and is NOT the source of truth for visibility.

### 2) Least privilege and minimal retention

- Store only what is required to:
  - verify identity (PUUID)
  - keep stats up to date (tokens, if supported)
- Tokens must never be stored client-side.
- Long-term tokens must never be stored in session cookies.

### 3) Immediate opt-out enforcement

When a user opts out:

- Visibility is immediately revoked (DB `opted_in = false`)
- Background updates must stop immediately
- Any stored tokens must be deleted or invalidated (implementation depends on Riot capabilities)

---

## Token Types (Expected)

Riot RSO is OAuth/OIDC-based. Token behavior depends on Riot configuration and granted scopes.

Expected tokens (subject to Riot confirmation):

- Access token (short-lived)
- ID token (OIDC identity, if enabled)
- Refresh token (only if offline access / refresh is supported)

**Open Question (blocked on Riot confirmation):**

- Does Riot provide refresh tokens for server-side background updates?
- Is `offline_access` supported and what are the refresh token lifetimes / rotation rules?

---

## Storage Strategy

### Where tokens are stored

Tokens are stored server-side in Postgres (never in session, never in browser storage).

Recommended table: `auth_tokens` (to be implemented in later epic)

Suggested fields:

- `player_id` (FK to `players`)
- `access_token_encrypted`
- `refresh_token_encrypted` (if available)
- `expires_at`
- `scopes`
- `updated_at`

### Encryption

- Tokens must be encrypted at rest using a server-side secret (e.g., `TOKEN_ENCRYPTION_KEY`)
- Access to the encryption key must be environment-only (never committed)
- Rotation plan:
  - allow re-encrypting tokens with a new key on next refresh or sign-in

---

## Refresh Strategy (Background Updates)

### If refresh tokens are supported

1. Use refresh token to obtain a new access token before expiry (or upon 401)
2. Update stored token set (handle refresh-token rotation if provided)
3. Fetch stats for opted-in users on a schedule
4. Backoff on failures; avoid hammering Riot endpoints

**Refresh cadence:**

- Prefer “refresh on demand”:
  - if access token is expired or near expiry, refresh
- Avoid refreshing tokens unnecessarily

### If refresh tokens are NOT supported

Background updates cannot be reliably performed without user interaction.

Fallback options:

- Update stats only when a user logs in (RSO flow)
- Update opted-in players only if Riot provides an app-level endpoint that does not require per-user tokens (unlikely for private data)
- Clearly message in UI that stats update "when you connect" rather than continuously

---

## Failure Modes & Handling

### Access token expired

- Attempt refresh (if supported)
- If refresh fails:
  - mark token status as invalid
  - stop background updates for that player
  - keep opted-in false/true unchanged (visibility is still gated by opt-in)
  - show UI messaging indicating reconnect required

### Rate limits / throttling

- Respect Riot rate limits
- Use caching for repeated reads
- Use jittered backoff for retries
- Track per-player last update time to avoid redundant calls

### Partial outages

- If Riot API is down:
  - pause update jobs
  - retry later
  - do not modify opt-in status

---

## Opt-Out / Disconnect Rules

On disconnect:

1. DB: set `players.opted_in = false`
2. DB: set `disconnected_at = now()`
3. Session: clear `session.user`
4. Tokens:
   - delete stored tokens for that player (preferred)
   - or mark as revoked/disabled

**Guarantee:**

- Once opted out, Rival performs no further background updates for that player.

---

## Current Implementation Status (Epic 1)

- OAuth state validation (CSRF protection) implemented
- Session user is created (mock mode)
- Opt-in stored in Postgres `players` table
- Disconnect route flips `opted_in=false` and clears session
- Central opt-in enforcement helper uses DB as the source of truth

---

## Open Questions (Pending Riot)

ha

- Refresh token availability and lifetimes
- Scope requirements for Valorant stats endpoints
- Whether token revocation endpoint exists/required for RSO apps

Once Riot confirms token behavior, this doc will be updated with:

- exact scopes
- exact refresh rotation rules
- final background update schedule and safeguards
