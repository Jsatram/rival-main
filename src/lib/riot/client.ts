import "server-only";
import { RiotApiError } from "@/lib/riot/errors";

type RiotGetOptions = {
  baseUrl: string; // pass platformBaseUrl(...) or regionalBaseUrl(...)
  path: string; // e.g. "/val/match/v1/matches/..."
  query?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
};

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const LOGGING = process.env.RIOT_API_LOGGING === "true";

const MAX_RETRIES = Number(process.env.RIOT_API_MAX_RETRIES ?? 2);
const RETRY_BASE_MS = Number(process.env.RIOT_API_RETRY_BASE_MS ?? 250);

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: RiotGetOptions["query"]
) {
  const url = new URL(path, baseUrl);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

function parseRetryAfterSeconds(headers: Headers): number | undefined {
  const ra = headers.get("retry-after");
  if (!ra) return undefined;
  const n = Number(ra);
  return Number.isFinite(n) ? n : undefined;
}

export async function riotGet<T>(opts: RiotGetOptions): Promise<T> {
  if (!RIOT_API_KEY) {
    throw new RiotApiError({
      code: "BAD_REQUEST",
      message: "Missing RIOT_API_KEY env var",
      endpoint: `${opts.baseUrl}${opts.path}`,
    });
  }

  const url = buildUrl(opts.baseUrl, opts.path, opts.query);
  const endpoint = url;
  const timeoutMs = opts.timeoutMs ?? 12_000;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const started = Date.now();

  try {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
        signal: controller.signal,
        cache: "no-store",
      });

      const ms = Date.now() - started;

      if (LOGGING) {
        console.log(
          JSON.stringify({
            msg: "riot_get",
            status: res.status,
            ms,
            attempt,
            path: opts.path,
            baseUrl: opts.baseUrl,
          })
        );
      }

      if (res.ok) {
        clearTimeout(timeout);
        return (await res.json()) as T;
      }

      // Normalize errors
      if (res.status === 429) {
        const retryAfterSeconds = parseRetryAfterSeconds(res.headers);
        const backoffMs =
          retryAfterSeconds !== undefined
            ? retryAfterSeconds * 1000
            : RETRY_BASE_MS * Math.pow(2, attempt);

        // If we have remaining retries, wait and retry
        if (attempt < MAX_RETRIES) {
          await sleep(Math.min(backoffMs, 5_000)); // cap
          continue;
        }

        throw new RiotApiError({
          code: "RATE_LIMITED",
          message: "Riot API rate limited (429)",
          status: 429,
          endpoint,
          retryAfterSeconds,
        });
      }

      if (res.status === 403) {
        throw new RiotApiError({
          code: "FORBIDDEN",
          message: "Riot API forbidden (403)",
          status: 403,
          endpoint,
        });
      }

      if (res.status === 404) {
        throw new RiotApiError({
          code: "NOT_FOUND",
          message: "Riot API not found (404)",
          status: 404,
          endpoint,
        });
      }

      if (res.status >= 500) {
        throw new RiotApiError({
          code: "UPSTREAM_ERROR",
          message: `Riot API upstream error (${res.status})`,
          status: res.status,
          endpoint,
        });
      }

      // Other 4xx: include a small payload if possible (don’t exceed logs)
      let details: unknown = undefined;
      try {
        details = await res.json();
      } catch {
        // ignore
      }

      throw new RiotApiError({
        code: "BAD_REQUEST",
        message: `Riot API request failed (${res.status})`,
        status: res.status,
        endpoint,
        details,
      });
    }

    // unreachable
    throw new RiotApiError({
      code: "UPSTREAM_ERROR",
      message: "Riot API request failed unexpectedly",
      endpoint,
    });
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof RiotApiError) throw err;

    // Abort / network / unknown
    throw new RiotApiError({
      code: "NETWORK_ERROR",
      message: err instanceof Error ? err.message : "Unknown network error",
      endpoint: buildUrl(opts.baseUrl, opts.path, opts.query),
      details: err,
    });
  }
}
