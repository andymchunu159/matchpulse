import TeamRow from "./TeamRow";

interface Props {
  standings: any[];
  leagueId: number;
  season: number;
}

export default function StandingsTable({
  standings,
  leagueId,
  season,
}: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70">
      {/* Table Header */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-zinc-800 bg-zinc-950/60">
            <tr className="text-sm uppercase tracking-wider text-zinc-400">
              <th className="px-4 py-4 text-center">
                Pos
              </th>

              <th className="px-4 py-4 text-left">
                Team
              </th>

              <th className="px-4 py-4 text-center">
                P
              </th>

              <th className="px-4 py-4 text-center">
                W
              </th>

              <th className="px-4 py-4 text-center">
                D
              </th>

              <th className="px-4 py-4 text-center">
                L
              </th>

              <th className="px-4 py-4 text-center">
                GF
              </th>

              <th className="px-4 py-4 text-center">
                GA
              </th>

              <th className="px-4 py-4 text-center">
                GD
              </th>

              <th className="px-4 py-4 text-center font-bold text-white">
                Pts
              </th>

              <th className="px-4 py-4 text-center">
                Form
              </th>
            </tr>
          </thead>

          <tbody>
            {standings.map((team) => (
              <TeamRow
                key={team.team.id}
                team={team}
                leagueId={leagueId}
                season={season}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}