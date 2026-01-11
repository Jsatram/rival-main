import { getIronSession, type IronSessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  user?: {
    puuid: string;
    gameName?: string;
    tagLine?: string;
  };
  accessToken?: string; // you may or may not want to store this long-term
};

const sessionOptions: IronSessionOptions = {
  cookieName: "rival_session",
  password: process.env.SESSION_SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
