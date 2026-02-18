import { cookies } from "next/headers";

const DEMO_COOKIE = "rival_demo_opted_in";

export function isDemoOptedIn(): boolean {
  const c = cookies().get(DEMO_COOKIE)?.value;
  return c === "true";
}

export function setDemoOptedIn(): void {
  cookies().set(DEMO_COOKIE, "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
}

export function clearDemoOptedIn(): void {
  cookies().set(DEMO_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
