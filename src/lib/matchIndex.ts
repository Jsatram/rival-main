import { pool } from "@/lib/db";

export type MatchIndexStatsInput = {
  kills: number;
  deaths: number;
  assists: number;
  acs: number;
  adr: number;
  hsPct: number;
  firstKills: number;
  firstDeaths: number;
  plants: number;
  defuses: number;
  clutchesWon: number;
};

export type MatchIndexUpsertInput = {
  puuid: string;
  matchId: string;
  playedAt: string; // ISO
  queue: string;
  map: string;
  agent: string;
  stats: MatchIndexStatsInput;
};

export type MatchIndexRow = {
  id: string;
  puuid: string;
  match_id: string;
  played_at: string;
  queue: string;
  map: string;
  agent: string;

  kills: number;
  deaths: number;
  assists: number;
  acs: number;
  adr: number;
  hs_pct: number;

  first_kills: number;
  first_deaths: number;
  plants: number;
  defuses: number;
  clutches_won: number;

  created_at: string;
};

function assertNonEmpty(value: string, field: string) {
  if (!value || !value.trim()) throw new Error(`${field} is required`);
}

function toInt(n: unknown, field: string): number {
  const v = Number(n);
  if (!Number.isFinite(v)) throw new Error(`${field} must be a number`);
  return Math.trunc(v);
}

function toFloat(n: unknown, field: string): number {
  const v = Number(n);
  if (!Number.isFinite(v)) throw new Error(`${field} must be a number`);
  return v;
}

/**
 * Upsert a single match index row (idempotent on puuid+match_id).
 */
export async function upsertMatchIndex(
  input: MatchIndexUpsertInput,
): Promise<MatchIndexRow> {
  assertNonEmpty(input.puuid, "puuid");
  assertNonEmpty(input.matchId, "matchId");
  assertNonEmpty(input.playedAt, "playedAt");
  assertNonEmpty(input.queue, "queue");
  assertNonEmpty(input.map, "map");
  assertNonEmpty(input.agent, "agent");

  const s = input.stats;

  const q = `
    INSERT INTO match_index (
      puuid,
      match_id,
      played_at,
      queue,
      map,
      agent,
      kills,
      deaths,
      assists,
      acs,
      adr,
      hs_pct,
      first_kills,
      first_deaths,
      plants,
      defuses,
      clutches_won
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,
      $7,$8,$9,$10,$11,$12,
      $13,$14,$15,$16,$17
    )
    ON CONFLICT (puuid, match_id) DO UPDATE SET
      played_at = EXCLUDED.played_at,
      queue = EXCLUDED.queue,
      map = EXCLUDED.map,
      agent = EXCLUDED.agent,
      kills = EXCLUDED.kills,
      deaths = EXCLUDED.deaths,
      assists = EXCLUDED.assists,
      acs = EXCLUDED.acs,
      adr = EXCLUDED.adr,
      hs_pct = EXCLUDED.hs_pct,
      first_kills = EXCLUDED.first_kills,
      first_deaths = EXCLUDED.first_deaths,
      plants = EXCLUDED.plants,
      defuses = EXCLUDED.defuses,
      clutches_won = EXCLUDED.clutches_won
    RETURNING
      id, puuid, match_id, played_at, queue, map, agent,
      kills, deaths, assists, acs, adr, hs_pct,
      first_kills, first_deaths, plants, defuses, clutches_won,
      created_at
  `;

  const values = [
    input.puuid,
    input.matchId,
    input.playedAt,
    input.queue,
    input.map,
    input.agent,

    toInt(s.kills, "kills"),
    toInt(s.deaths, "deaths"),
    toInt(s.assists, "assists"),
    toInt(s.acs, "acs"),
    toInt(s.adr, "adr"),
    toFloat(s.hsPct, "hsPct"),

    toInt(s.firstKills, "firstKills"),
    toInt(s.firstDeaths, "firstDeaths"),
    toInt(s.plants, "plants"),
    toInt(s.defuses, "defuses"),
    toInt(s.clutchesWon, "clutchesWon"),
  ];

  const res = await pool.query<MatchIndexRow>(q, values);
  return res.rows[0];
}

/**
 * Upsert many matches in a simple loop.
 * This is intentionally straightforward for Epic 1.5 (no fancy bulk SQL yet).
 */
export async function upsertMatchIndexBatch(
  inputs: MatchIndexUpsertInput[],
): Promise<{ attempted: number; upserted: number }> {
  let upserted = 0;
  for (const input of inputs) {
    await upsertMatchIndex(input);
    upserted += 1;
  }
  return { attempted: inputs.length, upserted };
}
