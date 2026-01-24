export type RiotRegion = "na" | "eu" | "ap" | "kr" | "latam" | "br";

export type RiotAuthMode = "apiKey" | "bearer";

export type RiotTokenProvider = (mode: RiotAuthMode) => Promise<string>;

export type RiotRequestMeta = {
  method: string;
  url: string;
  region: RiotRegion;
  endpoint: string;
};

export type RiotRateLimitInfo = {
  // These are best-effort. Riot headers vary by product/endpoint.
  // We parse what we can and keep it optional.
  retryAfterSeconds?: number;
  appLimit?: string; // e.g. "20:1,100:120"
  appCount?: string; // e.g. "1:1,10:120"
  methodLimit?: string;
  methodCount?: string;
};

export type GetMatchIdsParams = {
  start?: number; // default 0
  count?: number; // default 20 (clamped client-side)
};

export type RiotMatchListResponse = {
  // Valorant Matchlist endpoint returns an array of match IDs.
  // Keeping shape loose + tolerant.
  matchIds: string[];
};

export type RiotMatchResponse = unknown; // raw JSON payload; persisted later in 5.3
