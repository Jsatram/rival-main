import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSession } from "@/lib/session"; // adjust if your helper path/name differs

export async function GET() {
  // 1) Ensure env is present (fail fast, clear errors)
  const clientId = process.env.RIOT_CLIENT_ID;
  const redirectUri = process.env.RIOT_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Missing RIOT_CLIENT_ID or RIOT_REDIRECT_URI" },
      { status: 500 }
    );
  }

  // 2) Generate and store state (CSRF protection)
  const session = await getSession();
  const state = crypto.randomUUID();

  session.oauthState = state;
  await session.save();

  // 3) Build Riot authorize URL
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid offline_access", // can adjust later
    state,
  });

  const authorizeUrl = `https://auth.riotgames.com/authorize?${params.toString()}`;

  // 4) Redirect user to Riot
  return NextResponse.redirect(authorizeUrl);
}
