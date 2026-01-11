import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function AccountPage() {
  const session = await getSession();

  if (!session.user) {
    return (
      <main className="p-8">
        <p>You are not connected.</p>
        <Link className="underline" href="/login">
          Connect Riot account
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8 space-y-2">
      <h1 className="text-2xl font-bold">Account</h1>
      <p>
        Connected as:{" "}
        <strong>
          {session.user.gameName ?? "Player"}#{session.user.tagLine ?? "----"}
        </strong>
      </p>

      <form action="/api/auth/logout" method="post">
        <button className="px-4 py-2 border rounded" type="submit">
          Log out
        </button>
      </form>
    </main>
  );
}
