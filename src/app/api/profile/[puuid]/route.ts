import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const dynamic = "force-dynamic";

type Params = { params: { puuid: string } };

export async function GET(_: Request, { params }: Params) {
  const puuid = params.puuid?.trim();
  if (!puuid) {
    return NextResponse.json({ error: "Missing puuid" }, { status: 400 });
  }

  // Enforce opt-in (do not leak whether the player exists)
  // If your opted_in_players schema differs (column names), adjust here.
  const optedIn = await pool.query(
    `SELECT 1 FROM opted_in_players WHERE puuid = $1 LIMIT 1`,
    [puuid],
  );

  if (optedIn.rowCount === 0) {
    // Return 404 so non-opted-in users aren't enumerable
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Read latest snapshot (payload is source of truth)
  // If your schema stores payload as json/jsonb, this will work.
  const snap = await pool.query(
    `
    SELECT payload
    FROM player_profile_snapshots
    WHERE puuid = $1
    ORDER BY last_computed_at DESC
    LIMIT 1
    `,
    [puuid],
  );

  if (snap.rowCount === 0) {
    return NextResponse.json(
      { error: "No snapshot available" },
      { status: 404 },
    );
  }

  const payload = snap.rows[0]?.payload;

  // payload should already be a full PlayerProfilePayload (contract)
  return NextResponse.json(payload, { status: 200 });
}
