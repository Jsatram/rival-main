-- Epic 1.5.1 — Minimal Persistence Schema (Postgres)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- opted_in_players
-- ============================
CREATE TABLE IF NOT EXISTS opted_in_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  puuid TEXT NOT NULL UNIQUE,

  game_name TEXT,
  tag_line TEXT,

  declared_role TEXT CHECK (declared_role IN ('duelist','initiator','controller','sentinel','flex')),

  is_opted_in BOOLEAN NOT NULL DEFAULT TRUE,
  opted_in_at TIMESTAMPTZ,
  opted_out_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful lookup (optional but useful)
CREATE INDEX IF NOT EXISTS idx_opted_in_players_game_tag
  ON opted_in_players (game_name, tag_line);

-- ============================
-- match_index
-- ============================
CREATE TABLE IF NOT EXISTS match_index (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  puuid TEXT NOT NULL,
  match_id TEXT NOT NULL,

  played_at TIMESTAMPTZ NOT NULL,
  queue TEXT NOT NULL,
  map TEXT NOT NULL,
  agent TEXT NOT NULL,

  kills INT NOT NULL,
  deaths INT NOT NULL,
  assists INT NOT NULL,
  acs INT NOT NULL,
  adr INT NOT NULL,
  hs_pct REAL NOT NULL,

  first_kills INT NOT NULL,
  first_deaths INT NOT NULL,
  plants INT NOT NULL,
  defuses INT NOT NULL,
  clutches_won INT NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_match_index_puuid_match UNIQUE (puuid, match_id)
);

CREATE INDEX IF NOT EXISTS idx_match_index_puuid_played_at
  ON match_index (puuid, played_at DESC);

-- NOTE:
-- We are intentionally NOT creating a hard FK constraint from match_index.puuid
-- to opted_in_players.puuid yet to keep local iteration flexible.
-- We can tighten this later once ingestion flow is finalized.
