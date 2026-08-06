import StatisticBar from "./StatisticBar";
import UnavailableCard from "@/components/common/UnavailableCard";

interface Props {
  fixture: any;
  statistics: any[];
}

export default function OverviewTab({
  fixture,
  statistics,
}: Props) {
  const stats = statistics ?? [];

  if (stats.length === 0) {
    return (
      <UnavailableCard
        title="📊 Match Statistics Unavailable"
        description="Detailed match statistics are currently unavailable through MatchPulse for this fixture. You can still view the latest match statistics online."
        buttonText="View Match Statistics Online"
        searchQuery={`${fixture.teams.home.name} vs ${fixture.teams.away.name} match statistics`}
      />
    );
  }

  const homeStats = stats.find(
    (team: any) =>
      team.team.id === fixture.teams.home.id
  );

  const awayStats = stats.find(
    (team: any) =>
      team.team.id === fixture.teams.away.id
  );

  const getStat = (type: string) => {
    const home =
      homeStats?.statistics?.find(
        (s: any) => s.type === type
      )?.value;

    const away =
      awayStats?.statistics?.find(
        (s: any) => s.type === type
      )?.value;

    return {
      home,
      away,
    };
  };

  const parseNumber = (value: any) => {
    if (value == null) return 0;

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      return (
        Number(value.replace("%", "")) || 0
      );
    }

    return 0;
  };

  const possession = getStat(
    "Ball Possession"
  );

  const shots = getStat(
    "Total Shots"
  );

  const shotsOnGoal = getStat(
    "Shots on Goal"
  );

  const corners = getStat(
    "Corner Kicks"
  );

  const fouls = getStat(
    "Fouls"
  );

  const yellowCards = getStat(
    "Yellow Cards"
  );

  const redCards = getStat(
    "Red Cards"
  );

  return (
    <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">
        Match Statistics
      </h2>

      <div className="space-y-6">
        <StatisticBar
          label="Possession"
          home={parseNumber(
            possession.home
          )}
          away={parseNumber(
            possession.away
          )}
          suffix="%"
        />

        <StatisticBar
          label="Shots"
          home={parseNumber(
            shots.home
          )}
          away={parseNumber(
            shots.away
          )}
        />

        <StatisticBar
          label="Shots on Target"
          home={parseNumber(
            shotsOnGoal.home
          )}
          away={parseNumber(
            shotsOnGoal.away
          )}
        />

        <StatisticBar
          label="Corners"
          home={parseNumber(
            corners.home
          )}
          away={parseNumber(
            corners.away
          )}
        />

        <StatisticBar
          label="Fouls"
          home={parseNumber(
            fouls.home
          )}
          away={parseNumber(
            fouls.away
          )}
        />

        <StatisticBar
          label="Yellow Cards"
          home={parseNumber(
            yellowCards.home
          )}
          away={parseNumber(
            yellowCards.away
          )}
        />

        <StatisticBar
          label="Red Cards"
          home={parseNumber(
            redCards.home
          )}
          away={parseNumber(
            redCards.away
          )}
        />
      </div>
    </section>
  );
}