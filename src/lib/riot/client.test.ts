import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { RiotClient } from "./client";
import { RiotApiError } from "./errors";

function mockFetchOkJson(json: any, headers: Record<string, string> = {}) {
  return vi.fn(async () => ({
    ok: true,
    status: 200,
    headers: new Headers(headers),
    json: async () => json,
    text: async () => JSON.stringify(json),
  })) as any;
}

function mockFetchError(
  status: number,
  bodyText: string,
  headers: Record<string, string> = {},
) {
  return vi.fn(async () => ({
    ok: false,
    status,
    headers: new Headers(headers),
    json: async () => {
      throw new Error("no json");
    },
    text: async () => bodyText,
  })) as any;
}

describe("RiotClient (no real key)", () => {
  const tokenProvider = async () => "fake-token";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds correct matchlist URL and sends X-Riot-Token header", async () => {
    const fetchMock = mockFetchOkJson(["m1", "m2"]);
    vi.stubGlobal("fetch", fetchMock);

    const client = new RiotClient({ region: "na", tokenProvider });

    const res = await client.getMatchIdsByPuuid("some-puuid", {
      start: 0,
      count: 20,
    });

    expect(res.matchIds).toEqual(["m1", "m2"]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];

    expect(String(url)).toContain("https://na.api.riotgames.com");
    expect(String(url)).toContain(
      "/val/match/v1/matchlists/by-puuid/some-puuid?start=0&count=20",
    );

    expect(init.headers["X-Riot-Token"]).toBe("fake-token");
  });

  it("normalizes unexpected matchlist object shape", async () => {
    const fetchMock = mockFetchOkJson({ matchIds: ["a", "b", 123, null] });
    vi.stubGlobal("fetch", fetchMock);

    const client = new RiotClient({ region: "eu", tokenProvider });
    const res = await client.getMatchIdsByPuuid("p", { count: 10 });

    expect(res.matchIds).toEqual(["a", "b"]);
  });

  it("throws RiotApiError on non-OK and parses retry-after", async () => {
    const fetchMock = mockFetchError(429, "too many requests", {
      "retry-after": "7",
      "x-app-rate-limit": "20:1,100:120",
      "x-app-rate-limit-count": "20:1,80:120",
    });
    vi.stubGlobal("fetch", fetchMock);

    const client = new RiotClient({ region: "na", tokenProvider });

    await expect(client.getMatchById("match-1")).rejects.toBeInstanceOf(
      RiotApiError,
    );

    try {
      await client.getMatchById("match-1");
    } catch (e: any) {
      expect(e.status).toBe(429);
      expect(e.rateLimit?.retryAfterSeconds).toBe(7);
      expect(e.rateLimit?.appLimit).toContain("20:1");
    }
  });
});
