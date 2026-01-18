import { pool } from "@/lib/db";

export type MatchIngestionStatus = "pending" | "fetched" | "failed";

export type MatchRow = {
  id: string;
  match_id: string;
  puuid: string;
  region: string;
  queue_type: string | null;
  game_start_time: string | null; // timestamptz comes back as string
  ingestion_status: MatchIngestionStatus;
  raw_payload: any | null;
  last_fetch_at: string | null;
  last_error: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Insert match IDs for a player idempotently.
 * Requires a UNIQUE(puuid, match_id) constraint on matches.
 *
 * Returns the number of NEW rows inserted.
 */
export async function insertMatchIdsIdempotent(args: {
  puuid: string;
  region: string;
  matchIds: string[];
}): Promise<{ inserted: number; ignored: number }> {
  const { puuid, region, matchIds } = args;

  if (!matchIds.length) return { inserted: 0, ignored: 0 };

  // Build VALUES list: ($1,$2,$3), ($4,$5,$6), ...
  const values: string[] = [];
  const params: any[] = [];

  matchIds.forEach((matchId, i) => {
    const base = i * 3;
    values.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
    params.push(matchId, puuid, region);
  });

  const sql = `
    INSERT INTO matches (match_id, puuid, region)
    VALUES ${values.join(", ")}
    ON CONFLICT (puuid, match_id) DO NOTHING
    RETURNING id;
  `;

  const res = await pool.query(sql, params);
  const inserted = res.rowCount ?? 0;

  return { inserted, ignored: matchIds.length - inserted };
}

export async function countMatchesForPlayer(puuid: string): Promise<number> {
  const res = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM matches WHERE puuid = $1;`,
    [puuid]
  );

  return Number(res.rows[0]?.count ?? 0);
}

export async function getPendingMatchesForPlayer(args: {
  puuid: string;
  limit: number;
}): Promise<MatchRow[]> {
  const { puuid, limit } = args;

  const res = await pool.query<MatchRow>(
    `
    SELECT *
    FROM matches
    WHERE puuid = $1
      AND ingestion_status = 'pending'
    ORDER BY created_at ASC
    LIMIT $2;
    `,
    [puuid, limit]
  );

  return res.rows;
}

/**
 * (For Epic 3.4) Mark a match as fetched and store raw payload + timestamps.
 * This is safe to include now; it will be used in the next task.
 */
export async function markMatchFetched(args: {
  puuid: string;
  matchId: string;
  rawPayload: unknown;
}): Promise<void> {
  const { puuid, matchId, rawPayload } = args;

  await pool.query(
    `
    UPDATE matches
    SET ingestion_status = 'fetched',
        raw_payload = $3::jsonb,
        last_fetch_at = NOW(),
        last_error = NULL
    WHERE puuid = $1
      AND match_id = $2;
    `,
    [puuid, matchId, JSON.stringify(rawPayload)]
  );
}

/**
 * (For Epic 3.4) Mark a match fetch failure.
 */
export async function markMatchFailed(args: {
  puuid: string;
  matchId: string;
  error: string;
}): Promise<void> {
  const { puuid, matchId, error } = args;

  await pool.query(
    `
    UPDATE matches
    SET ingestion_status = 'failed',
        last_fetch_at = NOW(),
        last_error = $3
    WHERE puuid = $1
      AND match_id = $2;
    `,
    [puuid, matchId, error]
  );
}
