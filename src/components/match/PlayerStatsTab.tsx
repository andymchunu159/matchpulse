interface Props {
  players: any[];
}

function getStat(player: any, type: string) {
  return (
    player.statistics?.[0]?.statistics?.find(
      (stat: any) => stat.type === type
    )?.value ?? "-"
  );
}

export default function PlayerStatsTab({ players }: Props) {
  if (!players || players.length === 0) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="mb-6 text-xl font-bold text-white">
          Player Statistics
        </h2>

        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-10 text-center">
          <p className="text-lg font-semibold text-white">
            Player Statistics Unavailable
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Detailed player statistics are not available for this fixture.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-8 text-xl font-bold text-white">
        Player Statistics
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        {players.map((team: any) => (
          <div key={team.team.id}>
            <div className="mb-5 flex items-center gap-3">
              <img
                src={team.team.logo}
                alt={team.team.name}
                className="h-8 w-8"
              />

              <div>
                <h3 className="font-bold text-white">
                  {team.team.name}
                </h3>

                <p className="text-sm text-zinc-400">
                  {team.players.length} Players
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {team.players.map((player: any) => (
                <div
                  key={player.player.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">
                        {player.player.name}
                      </h4>

                      <p className="text-sm text-zinc-400">
                        {player.statistics?.[0]?.games.position}
                      </p>
                    </div>

                    <div className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-bold text-green-400">
                      ⭐ {player.statistics?.[0]?.games.rating ?? "-"}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-zinc-900 p-3">
                      <p className="text-zinc-500">Goals</p>
                      <p className="font-bold text-white">
                        {getStat(player, "Goals")}
                      </p>
                    </div>

                    <div className="rounded-xl bg-zinc-900 p-3">
                      <p className="text-zinc-500">Assists</p>
                      <p className="font-bold text-white">
                        {getStat(player, "Assists")}
                      </p>
                    </div>

                    <div className="rounded-xl bg-zinc-900 p-3">
                      <p className="text-zinc-500">Shots</p>
                      <p className="font-bold text-white">
                        {getStat(player, "Total Shots")}
                      </p>
                    </div>

                    <div className="rounded-xl bg-zinc-900 p-3">
                      <p className="text-zinc-500">Pass Accuracy</p>
                      <p className="font-bold text-white">
                        {getStat(player, "Passes %")}
                      </p>
                    </div>

                    <div className="rounded-xl bg-zinc-900 p-3">
                      <p className="text-zinc-500">Tackles</p>
                      <p className="font-bold text-white">
                        {getStat(player, "Tackles")}
                      </p>
                    </div>

                    <div className="rounded-xl bg-zinc-900 p-3">
                      <p className="text-zinc-500">Duels Won</p>
                      <p className="font-bold text-white">
                        {getStat(player, "Duels Won")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}