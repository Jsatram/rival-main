-- Epic 1.5.5 — Persist computed PlayerProfilePayload snapshots

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS player_profile_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  puuid TEXT NOT NULL UNIQUE,

  payload JSONB NOT NULL,

  matches_analyzed INT NOT NULL,
  window_matches INT NOT NULL,
  window_label TEXT NOT NULL,

  last_computed_at TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_player_profile_snapshots_updated_at
  ON player_profile_snapshots (updated_at DESC);
