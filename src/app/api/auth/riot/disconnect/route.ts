import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { optOutPlayer } from "@/lib/players";

/**
 * Disconnect / opt-out route
 * - Clears session user (UI logout)
 * - Marks player as opted_out in DB (compliance + stops future updates)
 *
 * Note: Token invalidation/revocation (if applicable) will be added later
 * when we implement real token storage.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const session = await getSession();

  const puuid = session.user?.puuid;

  // If we have a logged-in/connected user, mark them opted out
  if (puuid) {
    await optOutPlayer(puuid);
  }

  // Clear session user regardless (idempotent)
  session.user = undefined;
  await session.save();

  // Redirect to account page which should show disconnected state
  return NextResponse.redirect(new URL("/account", url.origin), 303);
}

// Optional: allow GET for convenience if you want to use a plain <a> link.
// If you'd rather force POST-only, delete this handler.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const session = await getSession();

  const puuid = session.user?.puuid;
  if (puuid) {
    await optOutPlayer(puuid);
  }

  session.user = undefined;
  await session.save();

  return NextResponse.redirect(new URL("/account", url.origin), 303);
}
