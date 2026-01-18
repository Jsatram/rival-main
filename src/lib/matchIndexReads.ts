import { pool } from "@/lib/db";

export type MatchIndexSummaryRow = {
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
};

export async function getLatestMatchIndexSummariesByPuuid(
  puuid: string,
  limit: number = 20,
): Promise<MatchIndexSummaryRow[]> {
  const q = `
    SELECT
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
    FROM match_index
    WHERE puuid = $1
    ORDER BY played_at DESC
    LIMIT $2
  `;

  const res = await pool.query<MatchIndexSummaryRow>(q, [puuid, limit]);
  return res.rows;
}
