import { NextResponse } from "next/server";

export function assertInternalRequest(req: Request) {
  // Default: internal endpoints are NOT allowed in production
  const allowInProd = process.env.ALLOW_INTERNAL_ENDPOINTS_IN_PROD === "true";
  if (process.env.NODE_ENV === "production" && !allowInProd) {
    return NextResponse.json(
      { error: "Internal endpoints are disabled in production" },
      { status: 403 },
    );
  }

  const expected = process.env.INTERNAL_API_KEY;
  const provided = req.headers.get("x-internal-key");

  if (!expected) {
    return NextResponse.json(
      { error: "Server misconfigured: INTERNAL_API_KEY missing" },
      { status: 500 },
    );
  }

  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // OK
}
