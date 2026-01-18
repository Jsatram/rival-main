import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

import { computeProfilePayloadFromFixture } from "../../../../../../packages/analysis-core/src/compute/fromFixture";
import type { MatchSummaryFixture } from "../../../../../../packages/analysis-core/src/fixtures/types";

import { upsertOptedInPlayer } from "@/lib/optedInPlayers";
import { upsertMatchIndexBatch } from "@/lib/matchIndex";
import { assertInternalRequest } from "@/lib/internalAuth";

/**
 * POST /api/internal/sync/fixture
 *
 * Body:
 * {
 *   "fixtureName": "unorthodox",
 *   "declaredRole": "sentinel" // optional override
 * }
 *
 * Auth:
 * - Requires INTERNAL_API_KEY via header: x-internal-key
 */
export async function POST(req: Request) {
  const guard = assertInternalRequest(req);
  if (guard) return guard;

  let body: { fixtureName?: string; declaredRole?: string } = {};
  try {
    body = await req.json();
  } catch {
    // allow empty body
  }

  const fixtureName = body.fixtureName ?? "unorthodox";

  // ✅ Load fixture directly from repo path (works in Next dev/runtime)
  const fixturePath = path.join(
    process.cwd(),
    "packages",
    "analysis-core",
    "src",
    "fixtures",
    "data",
    `${fixtureName}.json`,
  );

  if (!fs.existsSync(fixturePath)) {
    return NextResponse.json(
      { error: `Fixture not found: ${fixturePath}` },
      { status: 404 },
    );
  }

  const raw = fs.readFileSync(fixturePath, "utf-8");
  const fixture = JSON.parse(raw) as MatchSummaryFixture;

  // Upsert the player
  const playerRow = await upsertOptedInPlayer({
    puuid: fixture.player.puuid,
    gameName: fixture.player.gameName,
    tagLine: fixture.player.tagLine,
    declaredRole:
      (body.declaredRole as any) ?? (fixture.player.declaredRole as any),
    isOptedIn: true,
  });

  // Upsert match index rows
  const matches = fixture.matches.map((m) => ({
    puuid: fixture.player.puuid,
    matchId: m.matchId,
    playedAt: m.playedAt,
    queue: m.queue,
    map: m.map,
    agent: m.agent,
    stats: {
      kills: m.stats.kills,
      deaths: m.stats.deaths,
      assists: m.stats.assists,
      acs: m.stats.acs,
      adr: m.stats.adr,
      hsPct: m.stats.hsPct,
      firstKills: m.stats.firstKills,
      firstDeaths: m.stats.firstDeaths,
      plants: m.stats.plants,
      defuses: m.stats.defuses,
      clutchesWon: m.stats.clutchesWon,
    },
  }));

  const batch = await upsertMatchIndexBatch(matches);

  // Optional: compute payload to prove end-to-end (no persistence of payload yet)
  const payload = computeProfilePayloadFromFixture(
    fixture,
    new Date().toISOString(),
  );

  return NextResponse.json({
    ok: true,
    fixtureName,
    player: {
      puuid: playerRow.puuid,
      gameName: playerRow.game_name,
      tagLine: playerRow.tag_line,
      declaredRole: playerRow.declared_role,
    },
    matches: {
      attempted: batch.attempted,
      upserted: batch.upserted,
    },
    computed: {
      matchesAnalyzed: payload.matchesAnalyzed,
      lastComputedAt: payload.lastComputedAt,
    },
  });
}
