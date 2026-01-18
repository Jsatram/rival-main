// packages/analysis-core/src/fixtures/types.ts

export type DeclaredRole =
  | "duelist"
  | "initiator"
  | "controller"
  | "sentinel"
  | "flex";

export type Queue =
  | "competitive"
  | "unrated"
  | "swiftplay"
  | "spikerush"
  | "deathmatch"
  | string;

export type MatchStats = {
  kills: number;
  deaths: number;
  assists: number;
  acs: number;
  adr: number;
  hsPct: number;
  firstKills: number;
  firstDeaths: number;
  plants: number;
  defuses: number;
  clutchesWon: number;
};

export type FixtureMatch = {
  matchId: string;
  playedAt: string; // ISO
  queue: Queue;
  map: string;
  agent: string;
  stats: MatchStats;
};

export type FixturePlayer = {
  puuid: string;
  gameName: string;
  tagLine: string;
  declaredRole: DeclaredRole;
};

export type MatchSummaryFixture = {
  version: number;
  label: string;
  player: FixturePlayer;
  matches: FixtureMatch[];
};
