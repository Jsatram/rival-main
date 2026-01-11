import { NextResponse } from "next/server";

// For now this is a stub. Once you have RSO client details,
// you'll redirect to Riot's authorize URL with proper params.
export async function GET() {
  return NextResponse.redirect(new URL("/login", process.env.APP_BASE_URL));
}
