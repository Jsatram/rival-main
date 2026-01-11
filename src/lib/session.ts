import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

/**
 * SessionData defines everything we intentionally store in the session.
 * This is UI-only state (NOT long-term auth or token storage).
 */
export type SessionData = {
  /**
   * OAuth state used for CSRF protection during Riot RSO flow
   */
  oauthState?: string;

  /**
   * Logged-in / connected user identity
   */
  user?: {
    puuid: string;
    gameName?: string;
    tagLine?: string;
    optedIn?: boolean;
  };
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

/**
 * Returns the iron-session for the current request
 */
export async function getSession() {
  return getIronSession<SessionData>(await cookies(), getSessionOptions());
}
