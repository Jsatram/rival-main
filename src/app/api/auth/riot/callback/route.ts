import { NextResponse } from "next/server";

export async function GET() {
  // Stub: once Riot redirects back with ?code=... we exchange for tokens
  return NextResponse.redirect(new URL("/account", process.env.APP_BASE_URL));
}
