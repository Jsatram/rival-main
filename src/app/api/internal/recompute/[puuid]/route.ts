import { NextResponse } from "next/server";
import { getLatestMatchIndexSummariesByPuuid } from "@/lib/matchIndexReads";

import { computeProfilePayloadFromFixture } from "../../../../../../packages/analysis-core/src/compute/fromFixture";
import type { MatchSummaryFixture } from "../../../../../../packages/analysis-core/src/fixtures/types";
import { upsertProfileSnapshot } from "@/lib/profileSnapshots";
import { assertInternalRequest } from "@/lib/internalAuth";

/**
 * POST /api/internal/recompute/:puuid
 *
 * Query params:
 *   ?limit=20
 *
 * Auth:
 * - Requires INTERNAL_API_KEY via header: x-internal-key
 */
export async function POST(req: Request, ctx: { params: { puuid: string } }) {
  const guard = assertInternalRequest(req);
  if (guard) return guard;

  const puuid = ctx.params.puuid;
  if (!puuid) {
    return NextResponse.json({ error: "Missing puuid" }, { status: 400 });
  }

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? "20");
  const safeLimit = Number.isFinite(limit)
    ? Math.max(1, Math.min(50, limit))
    : 20;

  const rows = await getLatestMatchIndexSummariesByPuuid(puuid, safeLimit);

  if (rows.length === 0) {
    return NextResponse.json(
      { error: `No matches found for puuid: ${puuid}` },
      { status: 404 },
    );
  }

  // Transform DB rows into the match-summary fixture shape expected by analysis-core.
  // player identity values are not stored in match_index, so we include placeholders.
  const fixture: MatchSummaryFixture = {
    version: 1,
    label: `db-latest-${rows.length}`,
    player: {
      puuid,
      gameName: "DBPlayer",
      tagLine: "DB",
      declaredRole: "flex",
    },
    matches: rows.map((r) => ({
      matchId: r.match_id,
      playedAt: new Date(r.played_at).toISOString(),
      queue: r.queue,
      map: r.map,
      agent: r.agent,
      stats: {
        kills: r.kills,
        deaths: r.deaths,
        assists: r.assists,
        acs: r.acs,
        adr: r.adr,
        hsPct: r.hs_pct,
        firstKills: r.first_kills,
        firstDeaths: r.first_deaths,
        plants: r.plants,
        defuses: r.defuses,
        clutchesWon: r.clutches_won,
      },
    })),
  };

  const payload = computeProfilePayloadFromFixture(
    fixture,
    new Date().toISOString(),
  );

  await upsertProfileSnapshot(puuid, payload);

  return NextResponse.json({
    ok: true,
    puuid,
    limit: safeLimit,
    matchesFound: rows.length,
    payload,
  });
}
