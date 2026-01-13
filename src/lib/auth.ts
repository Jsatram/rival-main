import { getSession } from "@/lib/session";

export type CurrentUser = {
  puuid: string;
  gameName?: string;
  tagLine?: string;
  optedIn?: boolean;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getSession();
  return session.user ?? null;
}
