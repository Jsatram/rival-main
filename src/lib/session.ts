import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type SessionData = {
  user?: {
    puuid: string;
    gameName?: string;
    tagLine?: string;
  };
  accessToken?: string;
};

function getSessionOptions(): SessionOptions {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error(
      `[session] Missing required environment variable: SESSION_SECRET. ` +
        `Add it to .env.local (dev) and Vercel project env vars (prod).`
    );
  }

  return {
    cookieName: "rival_session",
    password: secret,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
  };
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), getSessionOptions());
}
