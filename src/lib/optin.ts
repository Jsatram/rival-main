import { getPlayerByPuuid } from "@/lib/players";

/**
 * Centralized opt-in enforcement.
 *
 * RULE:
 * - DB is the source of truth for opt-in visibility.
 * - Session is only UI state.
 */

export type OptInResult =
  | { ok: true; puuid: string }
  | { ok: false; puuid: string; reason: "not_found" | "opted_out" };

export async function getOptInStatus(puuid: string): Promise<OptInResult> {
  const player = await getPlayerByPuuid(puuid);

  if (!player) {
    return { ok: false, puuid, reason: "not_found" };
  }

  if (!player.opted_in) {
    return { ok: false, puuid, reason: "opted_out" };
  }

  return { ok: true, puuid };
}

/**
 * Throws if player is not opted in.
 * Use this in any server route/page that would expose stats.
 */
export async function requireOptedIn(puuid: string): Promise<void> {
  const status = await getOptInStatus(puuid);
  if (!status.ok) {
    const msg =
      status.reason === "not_found"
        ? `Player not found or not opted in (puuid=${puuid})`
        : `Player opted out (puuid=${puuid})`;
    throw new Error(msg);
  }
}
