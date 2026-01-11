export default function LoginPage() {
  return (
    <main className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Connect your Riot account</h1>

      <p>
        Rival is an <strong>opt-in</strong> stats site. Your match history and
        gameplay data will only be visible on Rival after you sign in and
        consent via Riot Sign On (RSO).
      </p>

      <a
        href="/api/auth/riot/start"
        className="inline-block px-4 py-2 border rounded"
      >
        Sign in with Riot
      </a>

      <p className="text-sm opacity-70">
        You can disconnect any time. We do not display player data for accounts
        that haven’t opted in.
      </p>
    </main>
  );
}
