import { RiotApiError, RiotConfigError, RiotNetworkError } from "./errors";
import { defaultRegionFromEnv, regionBaseUrl } from "./regions";
import type {
  GetMatchIdsParams,
  RiotMatchListResponse,
  RiotMatchResponse,
  RiotRateLimitInfo,
  RiotRegion,
  RiotRequestMeta,
  RiotTokenProvider,
} from "./types";

function clampInt(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

function parseRateLimitInfo(headers: Headers): RiotRateLimitInfo | undefined {
  // Best-effort parsing. Riot headers differ per product.
  const retryAfter = headers.get("retry-after");
  const appLimit = headers.get("x-app-rate-limit") || undefined;
  const appCount = headers.get("x-app-rate-limit-count") || undefined;
  const methodLimit = headers.get("x-method-rate-limit") || undefined;
  const methodCount = headers.get("x-method-rate-limit-count") || undefined;

  const info: RiotRateLimitInfo = {
    appLimit,
    appCount,
    methodLimit,
    methodCount,
  };

  if (retryAfter) {
    const parsed = Number(retryAfter);
    if (Number.isFinite(parsed) && parsed >= 0) {
      info.retryAfterSeconds = parsed;
    }
  }

  const hasAny =
    info.retryAfterSeconds !== undefined ||
    info.appLimit ||
    info.appCount ||
    info.methodLimit ||
    info.methodCount;

  return hasAny ? info : undefined;
}

export type RiotClientOptions = {
  region?: RiotRegion;
  tokenProvider?: RiotTokenProvider;

  /**
   * Default timeout for Riot requests.
   * Keep conservative; jobs will handle retries in 5.7.
   */
  timeoutMs?: number;
};

export class RiotClient {
  private readonly region: RiotRegion;
  private readonly tokenProvider: RiotTokenProvider;
  private readonly timeoutMs: number;

  constructor(opts: RiotClientOptions = {}) {
    this.region = opts.region ?? defaultRegionFromEnv();
    this.timeoutMs = opts.timeoutMs ?? 12_000;

    this.tokenProvider =
      opts.tokenProvider ??
      (async () => {
        const key = process.env.RIOT_API_KEY?.trim();
        if (!key) {
          throw new RiotConfigError(
            "RIOT_API_KEY is not set. Add RIOT_API_KEY to .env.local for dev.",
          );
        }
        return key;
      });
  }

  /**
   * GET /val/match/v1/matchlists/by-puuid/{puuid}?start={start}&count={count}
   */
  async getMatchIdsByPuuid(
    puuid: string,
    params: GetMatchIdsParams = {},
  ): Promise<RiotMatchListResponse> {
    const start = clampInt(params.start ?? 0, 0, 10_000);
    const count = clampInt(params.count ?? 20, 1, 50);

    const endpoint = `/val/match/v1/matchlists/by-puuid/${encodeURIComponent(
      puuid,
    )}?start=${start}&count=${count}`;

    const data = await this.requestJson(endpoint);

    // Riot returns string[] for this endpoint in Valorant.
    // We normalize to { matchIds } and remain tolerant to unexpected shapes.
    if (Array.isArray(data) && data.every((x) => typeof x === "string")) {
      return { matchIds: data };
    }

    // Some endpoints might return an object with matchIds (unlikely but safe).
    if (
      data &&
      typeof data === "object" &&
      Array.isArray((data as any).matchIds)
    ) {
      const matchIds = (data as any).matchIds.filter(
        (x: any) => typeof x === "string",
      );
      return { matchIds };
    }

    return { matchIds: [] };
  }

  /**
   * GET /val/match/v1/matches/{matchId}
   */
  async getMatchById(matchId: string): Promise<RiotMatchResponse> {
    const endpoint = `/val/match/v1/matches/${encodeURIComponent(matchId)}`;
    return this.requestJson(endpoint);
  }

  private async requestJson(endpoint: string): Promise<any> {
    const baseUrl = regionBaseUrl(this.region);
    const url = `${baseUrl}${endpoint}`;

    const meta: RiotRequestMeta = {
      method: "GET",
      url,
      region: this.region,
      endpoint,
    };

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), this.timeoutMs);

    let res: Response;
    try {
      const token = await this.tokenProvider("apiKey");

      res = await fetch(url, {
        method: "GET",
        headers: {
          "X-Riot-Token": token,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      });
    } catch (err: any) {
      clearTimeout(t);
      // AbortError / network error / DNS etc
      throw new RiotNetworkError(
        err?.message || "Network error calling Riot API",
        meta,
      );
    } finally {
      clearTimeout(t);
    }

    const rateLimit = parseRateLimitInfo(res.headers);

    if (!res.ok) {
      // Avoid throwing away useful diagnostics
      let bodyText: string | undefined;
      try {
        bodyText = await res.text();
      } catch {
        // ignore
      }

      throw new RiotApiError({
        message: `Riot API error ${res.status} for ${endpoint}`,
        status: res.status,
        meta,
        rateLimit,
        bodyText,
      });
    }

    // Riot almost always returns JSON on these endpoints
    try {
      return await res.json();
    } catch {
      // Fall back to text
      const txt = await res.text().catch(() => "");
      return txt;
    }
  }
}

// convenience singleton for route handlers / jobs
export function getRiotClient(opts: RiotClientOptions = {}): RiotClient {
  return new RiotClient(opts);
}
