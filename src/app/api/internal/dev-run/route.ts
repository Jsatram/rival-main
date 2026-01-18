import { NextResponse } from "next/server";
import { runMatchInsertTest } from "../../dev/matchInsert.test";

export async function GET() {
  // Safety: prevent accidental use in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "Disabled in production" },
      { status: 403 }
    );
  }

  const result = await runMatchInsertTest();
  return NextResponse.json({ ok: true, result });
}
