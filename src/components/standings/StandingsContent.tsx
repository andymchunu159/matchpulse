import StandingsTable from "./StandingsTable";
import QualificationLegend from "./QualificationLegend";

interface Props {
  standings: any;
}

export default function StandingsContent({
  standings,
}: Props) {
  const league = standings?.league;
  const tables = league?.standings;

  if (!Array.isArray(tables) || tables.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-900 px-6 py-20">
        <p className="text-center text-base text-zinc-400">
          No standings are available for this league and season.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {tables.map(
        (
          table: any[],
          index: number
        ) => (
          <section
            key={index}
            className="space-y-6"
          >
            {tables.length > 1 && (
              <h2 className="text-xl font-bold text-white">
                {table[0]?.group ??
                  `Group ${index + 1}`}
              </h2>
            )}

            <StandingsTable
              standings={table}
              leagueId={league.id}
              season={league.season}
            />
          </section>
        )
      )}

      <QualificationLegend />
    </div>
  );
}