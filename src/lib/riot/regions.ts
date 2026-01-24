import type { RiotRegion } from "./types";

/**
 * Valorant uses platform routing (na/eu/ap/kr/latam/br) on api.riotgames.com subdomains.
 * Example: https://na.api.riotgames.com
 */
export function regionBaseUrl(region: RiotRegion): string {
  return `https://${region}.api.riotgames.com`;
}

export function defaultRegionFromEnv(): RiotRegion {
  const raw = (process.env.RIOT_REGION || "na").toLowerCase().trim();

  const allowed: RiotRegion[] = ["na", "eu", "ap", "kr", "latam", "br"];
  if ((allowed as string[]).includes(raw)) return raw as RiotRegion;

  // If invalid, default safely to na rather than crashing prod builds.
  // In dev you’ll notice because calls will fail / logs will show region mismatch.
  return "na";
}
