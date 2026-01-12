import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";

/**
 * Riot RSO callback
 * - Validates "state" matches what we stored in session during /start
 * - In MOCK_RIOT mode: creates a fake connected user and redirects to /account
 * - In real mode: placeholder for exchanging "code" for tokens (Task 1.4+)
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const session = await getSession();

  // 1) Handle OAuth error from Riot
  if (error) {
    // Clear any stale oauth state
    session.oauthState = undefined;
    await session.save();

    // Redirect back to login with a reason
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
    // Clear any stale oauth state
    session.oauthState = undefined;
    await session.save();

    return NextResponse.redirect(
      new URL(`/login?error=invalid_state`, url.origin)
    );
  }

  // Clear state once used (one-time use)
  session.oauthState = undefined;

  // 4) MOCK MODE: create a fake user and redirect
  const mockRiot = process.env.MOCK_RIOT === "true";
  if (mockRiot) {
    session.user = {
      puuid: "mock-puuid-123",
      gameName: "MockPlayer",
      tagLine: "NA1",
      optedIn: true,
    };

    await session.save();
    return NextResponse.redirect(new URL("/account", url.origin));
  }

  // 5) REAL MODE: require code and (later) exchange it for tokens
  if (!code) {
    await session.save(); // saves the cleared oauthState
    return NextResponse.redirect(
      new URL(`/login?error=missing_code`, url.origin)
    );
  }

  /**
   * TODO (when Riot access is restored):
   * - exchange `code` for tokens (access + refresh if available)
   * - call userinfo to get subject/puuid (or decode id_token if OIDC)
   * - create/update opted-in player record in DB
   * - set session.user from real identity
   */

  await session.save();
  return NextResponse.redirect(
    new URL(`/login?error=riot_not_configured`, url.origin)
  );
}
