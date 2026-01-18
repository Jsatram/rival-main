export type RiotPlatformRegion =
  | "na1"
  | "eu1"
  | "ap"
  | "kr"
  | "br1"
  | "latam"
  | "esports"; // if you ever need it (likely not)

export type ValMatchRegion = "americas" | "europe" | "asia";

export function platformBaseUrl(platform: RiotPlatformRegion) {
  // For VALORANT, base URL is typically like https://na.api.riotgames.com
  // Some endpoints use platform routing; others use regional routing.
  // We'll keep both available; you choose per endpoint.
  switch (platform) {
    case "na1":
      return "https://na.api.riotgames.com";
    case "eu1":
      return "https://eu.api.riotgames.com";
    case "ap":
      return "https://ap.api.riotgames.com";
    case "kr":
      return "https://kr.api.riotgames.com";
    case "br1":
      return "https://br.api.riotgames.com";
    case "latam":
      return "https://latam.api.riotgames.com";
    default:
      return "https://na.api.riotgames.com";
  }
}

export function regionalBaseUrl(region: ValMatchRegion) {
  // Match-v1 is often regional: americas/europe/asia
  switch (region) {
    case "americas":
      return "https://americas.api.riotgames.com";
    case "europe":
      return "https://europe.api.riotgames.com";
    case "asia":
      return "https://asia.api.riotgames.com";
  }
}
