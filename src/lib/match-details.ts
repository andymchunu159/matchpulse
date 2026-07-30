import { footballFetch } from "@/lib/football";

export async function getMatchDetails(fixtureId: string) {
  // Fetch the fixture first so we can get the team IDs
  const fixtureData = await footballFetch(`/fixtures?id=${fixtureId}`);

  const fixture = fixtureData.response?.[0];

  if (!fixture) {
    return null;
  }

  const homeId = fixture.teams.home.id;
  const awayId = fixture.teams.away.id;

  const [
    statisticsData,
    eventsData,
    lineupsData,
    playersData,
    h2hData,
  ] = await Promise.all([
    footballFetch(`/fixtures/statistics?fixture=${fixtureId}`),
    footballFetch(`/fixtures/events?fixture=${fixtureId}`),
    footballFetch(`/fixtures/lineups?fixture=${fixtureId}`),
    footballFetch(`/fixtures/players?fixture=${fixtureId}`),
    footballFetch(
      `/fixtures/headtohead?h2h=${homeId}-${awayId}&last=5`
    ),
  ]);

  return {
    fixture,

    statistics: statisticsData.response ?? [],

    events: eventsData.response ?? [],

    lineups: lineupsData.response ?? [],

    players: playersData.response ?? [],

    h2h: h2hData.response ?? [],
  };
}