import TeamFixtureCard from "@/components/team/TeamFixtureCard";
import UnavailableCard from "@/components/common/UnavailableCard";

import { Fixture } from "@/lib/football";

interface Props {
  fixtures: Fixture[];
  teamName: string;
  season: number;
}

export default function FixturesTab({
  fixtures,
  teamName,
  season,
}: Props) {
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">
        Upcoming Fixtures
      </h2>

      {fixtures.length === 0 ? (
        <UnavailableCard
          title="📅 Upcoming Fixtures Unavailable"
          description="Upcoming fixtures are currently unavailable from the MatchPulse data provider. You can still view the latest fixture schedule online."
          buttonText="View Upcoming Fixtures"
          searchQuery={`${teamName} 10 upcoming fixtures`}
        />
      ) : (
        <div className="grid gap-3">
          {fixtures.map((fixture) => (
            <TeamFixtureCard
              key={fixture.fixture.id}
              fixture={fixture}
            />
          ))}
        </div>
      )}
    </div>
  );
}