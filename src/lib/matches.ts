import { pool } from "@/lib/db";

/**
 * Epic 2 Match Model contract:
 * - matches is keyed by match_id (PK)
 * - ingestion must be idempotent
 */
export async function insertMatchIdsIdempotent(args: {
  matchIds: string[];
}): Promise<{ inserted: number; ignored: number }> {
  const { matchIds } = args;
  if (!matchIds.length) return { inserted: 0, ignored: 0 };

  // Build VALUES list: ($1), ($2), ...
  const values: string[] = [];
  const params: any[] = [];

  matchIds.forEach((matchId, i) => {
    values.push(`($${i + 1})`);
    params.push(matchId);
  });

  const sql = `
    INSERT INTO matches (match_id)
    VALUES ${values.join(", ")}
    ON CONFLICT (match_id) DO NOTHING
    RETURNING match_id;
  `;

  const res = await pool.query(sql, params);
  const inserted = res.rowCount ?? 0;

  return { inserted, ignored: matchIds.length - inserted };
}

export async function countMatches(): Promise<number> {
  const res = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count FROM matches;`
  );
  return Number(res.rows[0]?.count ?? 0);
}
