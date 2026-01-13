-- Enable UUID generation (works on most hosted Postgres, including Supabase)
create extension if not exists "pgcrypto";

create table if not exists players (
  id uuid primary key default gen_random_uuid(),

  -- Riot identity
  puuid text not null unique,
  game_name text,
  tag_line text,

  -- Opt-in + compliance
  opted_in boolean not null default false,
  connected_at timestamptz,
  disconnected_at timestamptz,

  -- Flexible analysis fields (future-proof)
  traits jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Common query indexes
create index if not exists idx_players_opted_in on players (opted_in);
create index if not exists idx_players_updated_at on players (updated_at);
