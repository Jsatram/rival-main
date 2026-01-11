import Image from "next/image";

export default function Home() {
  const playerName = "PlayerOne";

  const matches: { name: string; kills: number; deaths: number }[] = [];

  return (
    <main className="p-8">
      {/* Player name */}
      <h1 className="text-2xl font-bold mb-4">{playerName}</h1>

      {/* Match list */}
      <ul className="space-y-2">
        {matches.map((match, index) => (
          <li key={match.name} className="border p-2 rounded">
            <strong>Match {index + 1}</strong> (Kills: {match.kills}, Deaths:{" "}
            {match.deaths})
          </li>
        ))}
      </ul>
    </main>
  );
}
