import { NextResponse } from "next/server";
import { riotGet } from "../../../../../lib/riot/client";
import { platformBaseUrl } from "../../../../../lib/riot/regions";

export async function GET() {
  try {
    // With no RIOT_API_KEY, this should return a structured BAD_REQUEST error
    const data = await riotGet<any>({
      baseUrl: platformBaseUrl("na1"),
      path: "/status/v4/platform-data",
    });

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        name: err?.name,
        code: err?.code,
        status: err?.status,
        message: err?.message,
        endpoint: err?.endpoint,
        retryAfterSeconds: err?.retryAfterSeconds,
        details: err?.details,
      },
      { status: 200 } // keep 200 so curl always prints JSON while we're testing
    );
  }
}
