import { pool } from "@/lib/db";

export type DeclaredRole =
  | "duelist"
  | "initiator"
  | "controller"
  | "sentinel"
  | "flex";

export type UpsertOptedInPlayerInput = {
  puuid: string;
  gameName?: string | null;
  tagLine?: string | null;
  declaredRole?: DeclaredRole | null;
  isOptedIn?: boolean;
  optedInAt?: string | null; // ISO allowed
  optedOutAt?: string | null; // ISO allowed
};

export type OptedInPlayerRow = {
  id: string;
  puuid: string;
  game_name: string | null;
  tag_line: string | null;
  declared_role: DeclaredRole | null;
  is_opted_in: boolean;
  opted_in_at: string | null;
  opted_out_at: string | null;
  created_at: string;
  updated_at: string;
};

function assertNonEmpty(value: string, field: string) {
  if (!value || !value.trim()) throw new Error(`${field} is required`);
}

/**
 * Upsert an opted-in player row keyed by PUUID.
 * Idempotent: calling repeatedly updates latest known name/tag/role and opt-in status.
 */
export async function upsertOptedInPlayer(
  input: UpsertOptedInPlayerInput,
): Promise<OptedInPlayerRow> {
  assertNonEmpty(input.puuid, "puuid");

  const isOptedIn = input.isOptedIn ?? true;

  // If opted in, we set opted_in_at unless explicitly provided.
  // If opted out, we set opted_out_at unless explicitly provided.
  const optedInAt = isOptedIn
    ? (input.optedInAt ?? new Date().toISOString())
    : (input.optedInAt ?? null);

  const optedOutAt = !isOptedIn
    ? (input.optedOutAt ?? new Date().toISOString())
    : (input.optedOutAt ?? null);

  const q = `
    INSERT INTO opted_in_players (
      puuid,
      game_name,
      tag_line,
      declared_role,
      is_opted_in,
      opted_in_at,
      opted_out_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    ON CONFLICT (puuid) DO UPDATE SET
      game_name = COALESCE(EXCLUDED.game_name, opted_in_players.game_name),
      tag_line  = COALESCE(EXCLUDED.tag_line, opted_in_players.tag_line),
      declared_role = COALESCE(EXCLUDED.declared_role, opted_in_players.declared_role),
      is_opted_in = EXCLUDED.is_opted_in,
      opted_in_at = COALESCE(EXCLUDED.opted_in_at, opted_in_players.opted_in_at),
      opted_out_at = COALESCE(EXCLUDED.opted_out_at, opted_in_players.opted_out_at),
      updated_at = NOW()
    RETURNING
      id, puuid, game_name, tag_line, declared_role, is_opted_in,
      opted_in_at, opted_out_at, created_at, updated_at
  `;

  const values = [
    input.puuid,
    input.gameName ?? null,
    input.tagLine ?? null,
    input.declaredRole ?? null,
    isOptedIn,
    optedInAt,
    optedOutAt,
  ];

  const res = await pool.query<OptedInPlayerRow>(q, values);
  return res.rows[0];
}
