import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

type MatchListItem = {
  matchId: string | null;
  startedAt: string | null;
  queue: string | null;
  map: string | null;
  agent: string | null;
  result: "win" | "loss" | "draw" | null; // not in match_index yet
  stats: {
    kills: number | null;
    deaths: number | null;
    assists: number | null;
    acs: number | null;
  } | null;
  includedInSnapshot: boolean;
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

    // 2) Fetch latest snapshot metadata (read-only)
    const snapRes = await pool.query(
      `
      SELECT window_matches, last_computed_at
      FROM player_profile_snapshots
      WHERE puuid = $1
      ORDER BY last_computed_at DESC NULLS LAST, created_at DESC
      LIMIT 1
      `,
      [puuid],
    );

    let windowMatches: number | null = null;
    let lastComputedAt: Date | null = null;

    if (snapRes.rows.length > 0) {
      const row = snapRes.rows[0];

      if (typeof row.window_matches === "number") {
        windowMatches = row.window_matches;
      }

      if (row.last_computed_at) {
        lastComputedAt = new Date(row.last_computed_at);
      }
    }

    // 3) Compute snapshot window match_ids from match_index
    // Rule: newest -> oldest, played_at <= last_computed_at, limit window_matches
    const includedIds = new Set<string>();

    if (windowMatches && windowMatches > 0 && lastComputedAt) {
      const winRes = await pool.query(
        `
        SELECT match_id
        FROM match_index
        WHERE puuid = $1
          AND played_at <= $2
        ORDER BY played_at DESC NULLS LAST
        LIMIT $3
        `,
        [puuid, lastComputedAt.toISOString(), windowMatches],
      );

      for (const r of winRes.rows) {
        if (r.match_id) includedIds.add(String(r.match_id));
      }
    }

    // 4) Return recent matches (API output unchanged)
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

      const matchId = r.match_id ?? null;

      return {
        matchId,
        startedAt: r.played_at ? new Date(r.played_at).toISOString() : null,
        queue: r.queue ?? null,
        map: r.map ?? null,
        agent: r.agent ?? null,
        result: null,
        stats: hasAnyStats
          ? {
              kills: r.kills ?? null,
              deaths: r.deaths ?? null,
              assists: r.assists ?? null,
              acs: r.acs ?? null,
            }
          : null,
        includedInSnapshot: matchId ? includedIds.has(matchId) : false,
      };
    });

    return NextResponse.json({ puuid, matches }, { status: 200 });
  } catch (e) {
    console.error("[api/matches] error", e);
    return NextResponse.json(
      { puuid, matches: [], error: "internal_error" },
      { status: 500 },
    );
  }
}
