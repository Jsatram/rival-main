import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

type MatchListItem = {
  matchId: string | null;
  startedAt: string | null; // maps from played_at
  queue: string | null;
  map: string | null;
  agent: string | null;
  result: "win" | "loss" | "draw" | null; // not in DB yet -> null
  stats: {
    kills: number | null;
    deaths: number | null;
    assists: number | null;
    acs: number | null;
  } | null;
  includedInSnapshot: boolean; // not in DB yet -> false (Epic 4.4 will compute)
};

function clampLimit(raw: string | null): number {
  const n = raw ? Number(raw) : 20;
  if (!Number.isFinite(n)) return 20;
  return Math.max(1, Math.min(50, Math.floor(n)));
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ puuid: string }> },
) {
  const { puuid } = await ctx.params;

  const url = new URL(req.url);
  const limit = clampLimit(url.searchParams.get("limit"));

  try {
    // 1) Enforce opt-in
    const opted = await pool.query(
      `SELECT puuid FROM opted_in_players WHERE puuid = $1 LIMIT 1`,
      [puuid],
    );

    if (opted.rowCount === 0) {
      return NextResponse.json({ puuid, matches: [] }, { status: 200 });
    }

    // 2) Read from match_index only (schema-accurate)
    const res = await pool.query(
      `
      SELECT
        match_id,
        played_at,
        queue,
        map,
        agent,
        kills,
        deaths,
        assists,
        acs
      FROM match_index
      WHERE puuid = $1
      ORDER BY played_at DESC NULLS LAST
      LIMIT $2
      `,
      [puuid, limit],
    );

    const matches: MatchListItem[] = res.rows.map((r: any) => {
      const hasAnyStats =
        r.kills != null ||
        r.deaths != null ||
        r.assists != null ||
        r.acs != null;

      return {
        matchId: r.match_id ?? null,
        startedAt: r.played_at ? new Date(r.played_at).toISOString() : null,
        queue: r.queue ?? null,
        map: r.map ?? null,
        agent: r.agent ?? null,
        result: null, // not available yet
        stats: hasAnyStats
          ? {
              kills: r.kills ?? null,
              deaths: r.deaths ?? null,
              assists: r.assists ?? null,
              acs: r.acs ?? null,
            }
          : null,
        includedInSnapshot: false, // real alignment comes in Epic 4.4
      };
    });

    return NextResponse.json({ puuid, matches }, { status: 200 });
  } catch {
    return NextResponse.json(
      { puuid, matches: [], error: "internal_error" },
      { status: 500 },
    );
  }
}
