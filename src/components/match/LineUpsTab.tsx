import Image from "next/image";

interface Props {
  lineups: any[];
}

export default function LineupsTab({ lineups }: Props) {
  if (!lineups || lineups.length < 2) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Team Lineups
        </h2>

        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-10 text-center">
          <p className="text-lg font-semibold text-white">
            Lineups Unavailable
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Official starting lineups are usually released around
            60 minutes before kickoff.
          </p>
        </div>
      </section>
    );
  }

  const [home, away] = lineups;

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-8 text-2xl font-bold text-white">
        Team Lineups
      </h2>

      <div className="grid gap-8 xl:grid-cols-2">
        <TeamCard lineup={home} />

        <TeamCard lineup={away} />
      </div>
    </section>
  );
}

function TeamCard({ lineup }: { lineup: any }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/60">
      {/* Header */}

      <div className="border-b border-zinc-800 bg-gradient-to-r from-green-600/20 to-transparent p-5">
        <div className="flex items-center gap-4">
          <Image
            src={lineup.team.logo}
            alt={lineup.team.name}
            width={48}
            height={48}
            className="rounded-full bg-white p-1"
          />

          <div>
            <h3 className="text-xl font-bold text-white">
              {lineup.team.name}
            </h3>

            <p className="mt-1 text-sm text-green-400">
              Formation {lineup.formation ?? "TBD"}
            </p>
          </div>
        </div>

        {lineup.coach && (
          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Coach
            </p>

            <p className="mt-1 font-medium text-white">
              {lineup.coach.name}
            </p>
          </div>
        )}
      </div>

      {/* Starting XI */}

      <div className="p-5">
        <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
          Starting XI ({lineup.startXI?.length ?? 0})
        </h4>

        <div className="space-y-2">
          {lineup.startXI?.map(({ player }: any) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 transition hover:border-green-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 font-bold text-white">
                  {player.number ?? "-"}
                </div>

                <div>
                  <p className="font-medium text-white">
                    {player.name}
                  </p>

                  <p className="text-xs text-zinc-500">
                    {player.pos ?? "N/A"}
                  </p>
                </div>
              </div>

              {player.captain && (
                <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-semibold text-yellow-400">
                  (C)
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bench */}

      {lineup.substitutes?.length > 0 && (
        <div className="border-t border-zinc-800 p-5">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
            Substitutes ({lineup.substitutes.length})
          </h4>

          <div className="space-y-2">
            {lineup.substitutes.map(({ player }: any) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 transition hover:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-sm font-bold text-white">
                    {player.number ?? "-"}
                  </div>

                  <span className="font-medium text-white">
                    {player.name}
                  </span>
                </div>

                <span className="text-xs text-zinc-500">
                  {player.pos ?? "N/A"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}