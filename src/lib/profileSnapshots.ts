import { pool } from "@/lib/db";
import type { PlayerProfilePayload } from "../../packages/analysis-core/src/contract/profile";

export type ProfileSnapshotRow = {
  id: string;
  puuid: string;
  payload: PlayerProfilePayload;

  matches_analyzed: number;
  window_matches: number;
  window_label: string;

  last_computed_at: string;
  created_at: string;
  updated_at: string;
};

export async function upsertProfileSnapshot(
  puuid: string,
  payload: PlayerProfilePayload,
): Promise<ProfileSnapshotRow> {
  if (!puuid) throw new Error("puuid is required");

  const q = `
    INSERT INTO player_profile_snapshots (
      puuid,
      payload,
      matches_analyzed,
      window_matches,
      window_label,
      last_computed_at,
      updated_at
    )
    VALUES ($1, $2::jsonb, $3, $4, $5, $6, NOW())
    ON CONFLICT (puuid) DO UPDATE SET
      payload = EXCLUDED.payload,
      matches_analyzed = EXCLUDED.matches_analyzed,
      window_matches = EXCLUDED.window_matches,
      window_label = EXCLUDED.window_label,
      last_computed_at = EXCLUDED.last_computed_at,
      updated_at = NOW()
    RETURNING
      id, puuid, payload, matches_analyzed, window_matches, window_label,
      last_computed_at, created_at, updated_at
  `;

  const values = [
    puuid,
    JSON.stringify(payload),
    payload.matchesAnalyzed,
    payload.window.matches,
    payload.window.label,
    payload.lastComputedAt,
  ];

  const res = await pool.query<ProfileSnapshotRow>(q, values);
  return res.rows[0];
}

export async function getProfileSnapshotByPuuid(
  puuid: string,
): Promise<ProfileSnapshotRow | null> {
  const q = `
    SELECT
      id, puuid, payload, matches_analyzed, window_matches, window_label,
      last_computed_at, created_at, updated_at
    FROM player_profile_snapshots
    WHERE puuid = $1
    LIMIT 1
  `;

  const res = await pool.query<ProfileSnapshotRow>(q, [puuid]);
  return res.rows[0] ?? null;
}
