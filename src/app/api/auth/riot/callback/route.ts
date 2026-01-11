import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Later you'll read `code` and exchange it for tokens.
  // For now just redirect safely.
  return NextResponse.redirect(new URL("/account", request.url));
}
