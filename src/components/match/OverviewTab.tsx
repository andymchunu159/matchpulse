import StatisticBar from "./StatisticBar";

interface Props {
  fixture: any;
  statistics: any[];
}

export default function OverviewTab({
  fixture,
  statistics,
}: Props) {
  const stats = statistics ?? [];

  // No statistics available for this fixture
  if (stats.length === 0) {
    return (
      <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="mb-6 text-xl font-bold text-white">
          Match Statistics
        </h2>

        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-10 text-center">
          <p className="text-lg font-semibold text-white">
            Statistics Not Provided
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            This competition currently provides match events (goals, cards,
            substitutions), but detailed statistics such as possession, shots,
            and corners are not available from the official data provider.
          </p>
        </div>
      </section>
    );
  }

  const homeStats = stats.find(
    (team: any) => team.team.id === fixture.teams.home.id
  );

  const awayStats = stats.find(
    (team: any) => team.team.id === fixture.teams.away.id
  );

  const getStat = (type: string) => {
    const home = homeStats?.statistics?.find(
      (s: any) => s.type === type
    )?.value;

    const away = awayStats?.statistics?.find(
      (s: any) => s.type === type
    )?.value;

    return {
      home,
      away,
    };
  };

  const parseNumber = (value: any) => {
    if (value == null) return 0;

    if (typeof value === "number") return value;

    if (typeof value === "string") {
      return Number(value.replace("%", "")) || 0;
    }

    return 0;
  };

  const possession = getStat("Ball Possession");
  const shots = getStat("Total Shots");
  const shotsOnGoal = getStat("Shots on Goal");
  const corners = getStat("Corner Kicks");
  const fouls = getStat("Fouls");
  const yellowCards = getStat("Yellow Cards");
  const redCards = getStat("Red Cards");

  return (
    <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">
        Match Statistics
      </h2>

      <div className="space-y-6">
        <StatisticBar
          label="Possession"
          home={parseNumber(possession.home)}
          away={parseNumber(possession.away)}
          suffix="%"
        />

        <StatisticBar
          label="Shots"
          home={parseNumber(shots.home)}
          away={parseNumber(shots.away)}
        />

        <StatisticBar
          label="Shots on Target"
          home={parseNumber(shotsOnGoal.home)}
          away={parseNumber(shotsOnGoal.away)}
        />

        <StatisticBar
          label="Corners"
          home={parseNumber(corners.home)}
          away={parseNumber(corners.away)}
        />

        <StatisticBar
          label="Fouls"
          home={parseNumber(fouls.home)}
          away={parseNumber(fouls.away)}
        />

        <StatisticBar
          label="Yellow Cards"
          home={parseNumber(yellowCards.home)}
          away={parseNumber(yellowCards.away)}
        />

        <StatisticBar
          label="Red Cards"
          home={parseNumber(redCards.home)}
          away={parseNumber(redCards.away)}
        />
      </div>
    </section>
  );
}