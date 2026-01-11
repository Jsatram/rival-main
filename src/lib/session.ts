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

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(
      `[session] Missing required environment variable: ${name}. ` +
        `Add it to .env.local (dev) and Vercel project env vars (prod).`
    );
  }
  return value;
}

const sessionOptions: SessionOptions = {
  cookieName: "rival_session",
  // iron-session requires a strong secret; keep it long (32+ chars)
  password: requireEnv("SESSION_SECRET"),
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
