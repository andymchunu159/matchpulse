import TeamFixtureCard from "@/components/team/TeamFixtureCard";
import UnavailableCard from "@/components/common/UnavailableCard";

import { Fixture } from "@/lib/football";

interface Props {
  fixtures: Fixture[];
}

export default function FixturesTab({
  fixtures,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        Upcoming Fixtures
      </h2>

      {fixtures.length === 0 ? (
        <UnavailableCard
          title="📅 Upcoming Fixtures Unavailable"
          description="Upcoming fixtures are currently unavailable from the MatchPulse data provider. You can still view the latest fixture schedule online."
          buttonText="View Latest Fixtures"
          searchQuery="football fixtures today"
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