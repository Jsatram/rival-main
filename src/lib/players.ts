import { pool } from "@/lib/db";

export type PlayerRow = {
  id: string;
  puuid: string;
  game_name: string | null;
  tag_line: string | null;
  opted_in: boolean;
  connected_at: string | null;
  disconnected_at: string | null;
  traits: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export async function upsertOptedInPlayer(input: {
  puuid: string;
  gameName?: string;
  tagLine?: string;
}) {
  const now = new Date();

  const result = await pool.query<PlayerRow>(
    `
    insert into players (puuid, game_name, tag_line, opted_in, connected_at, updated_at)
    values ($1, $2, $3, true, $4, $4)
    on conflict (puuid) do update set
      game_name = excluded.game_name,
      tag_line = excluded.tag_line,
      opted_in = true,
      disconnected_at = null,
      updated_at = excluded.updated_at,
      connected_at = coalesce(players.connected_at, excluded.connected_at)
    returning *;
    `,
    [input.puuid, input.gameName ?? null, input.tagLine ?? null, now]
  );

  return result.rows[0];
}

export async function optOutPlayer(puuid: string) {
  const now = new Date();

  const result = await pool.query<PlayerRow>(
    `
    update players
    set opted_in = false,
        disconnected_at = $2,
        updated_at = $2
    where puuid = $1
    returning *;
    `,
    [puuid, now]
  );

  return result.rows[0] ?? null;
}

export async function getPlayerByPuuid(puuid: string) {
  const result = await pool.query<PlayerRow>(
    `select * from players where puuid = $1 limit 1;`,
    [puuid]
  );
  return result.rows[0] ?? null;
}
