"use client";

interface Props {
  totalMatches: number;
  lastUpdated: Date | null;
}

export default function LiveHeader({
  totalMatches,
  lastUpdated,
}: Props) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white">
        Live Scores
      </h1>

      <p className="mt-2 text-zinc-400">
        {totalMatches} live {totalMatches === 1 ? "match" : "matches"} happening now.
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        {lastUpdated
          ? `Updated ${lastUpdated.toLocaleTimeString()}`
          : "Loading..."}
      </p>
    </div>
  );
}