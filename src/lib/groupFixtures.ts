import { FixtureResponse } from "./football-server";

export function groupFixtures(
  fixtures: FixtureResponse[]
) {
  return fixtures.reduce((groups, fixture) => {
    const leagueId = fixture.league.id;

    if (!groups[leagueId]) {
      groups[leagueId] = {
        league: fixture.league,
        fixtures: [],
      };
    }

    groups[leagueId].fixtures.push(fixture);

    return groups;
  }, {} as Record<
    number,
    {
      league: FixtureResponse["league"];
      fixtures: FixtureResponse[];
    }
  >);
}