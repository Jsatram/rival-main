import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";
import { upsertOptedInPlayer } from "@/lib/players";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const session = await getSession();

  // 1) Handle OAuth error from Riot
  if (error) {
    session.oauthState = undefined;
    await session.save();

    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, url.origin)
    );
  }

  // 2) Validate required query params
  if (!state) {
    return NextResponse.redirect(
      new URL(`/login?error=missing_state`, url.origin)
    );
  }

  // 3) CSRF protection: state must match what we stored in session
  const expectedState = session.oauthState;
  if (!expectedState || state !== expectedState) {
    session.oauthState = undefined;
    await session.save();

    return NextResponse.redirect(
      new URL(`/login?error=invalid_state`, url.origin)
    );
  }

  // Clear state once used (one-time use)
  session.oauthState = undefined;

  const mockRiot = process.env.MOCK_RIOT === "true";

  // 4) MOCK MODE: create a fake user, persist opt-in, redirect
  if (mockRiot) {
    const puuid = "mock-puuid-123";
    const gameName = "MockPlayer";
    const tagLine = "NA1";

    // Persist opt-in in Postgres
    await upsertOptedInPlayer({ puuid, gameName, tagLine });

    // Create session user
    session.user = {
      puuid,
      gameName,
      tagLine,
      optedIn: true,
    };

    await session.save();
    return NextResponse.redirect(new URL("/account", url.origin));
  }

  // 5) REAL MODE: require code and (later) exchange it for tokens
  if (!code) {
    await session.save();
    return NextResponse.redirect(
      new URL(`/login?error=missing_code`, url.origin)
    );
  }

  /**
   * TODO (when Riot access is restored):
   * - exchange `code` for tokens
   * - call userinfo / decode id_token to get puuid + gameName + tagLine
   * - await upsertOptedInPlayer({ puuid, gameName, tagLine })
   * - session.user = { puuid, gameName, tagLine, optedIn: true }
   * - session.save()
   * - redirect to /account
   */

  await session.save();
  return NextResponse.redirect(
    new URL(`/login?error=riot_not_configured`, url.origin)
  );
}
