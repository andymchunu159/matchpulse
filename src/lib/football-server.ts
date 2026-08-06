import {
  footballFetch,
  Fixture,
  ApiResponse,
} from "@/lib/football";

import { getSupportedStandingsSeason } from "@/lib/season";

export type FixtureResponse = Fixture;

export async function getFixtures(
  date: string
): Promise<FixtureResponse[]> {
  const response =
    await footballFetch<ApiResponse<FixtureResponse[]>>(
      `/fixtures?date=${date}`
    );

  return response.response ?? [];
}

export async function getResults(
  date: string
): Promise<FixtureResponse[]> {
  const response =
    await footballFetch<ApiResponse<FixtureResponse[]>>(
      `/fixtures?date=${date}&status=FT`
    );

  return response.response ?? [];
}

export async function getStandings(
  league: number,
  season: number
) {
  const supportedSeason =
    getSupportedStandingsSeason(season);

  const response =
    await footballFetch<ApiResponse<any[]>>(
      `/standings?league=${league}&season=${supportedSeason}`
    );

  return (
    response.response?.[0]?.league
      ?.standings?.[0] ?? []
  );
}

export async function getFixture(
  id: string
) {
  const [
    fixtureData,
    statisticsData,
    eventsData,
    lineupsData,
    playersData,
  ] = await Promise.all([
    footballFetch<ApiResponse<any[]>>(
      `/fixtures?id=${id}`
    ),

    footballFetch<ApiResponse<any[]>>(
      `/fixtures/statistics?fixture=${id}`
    ),

    footballFetch<ApiResponse<any[]>>(
      `/fixtures/events?fixture=${id}`
    ),

    footballFetch<ApiResponse<any[]>>(
      `/fixtures/lineups?fixture=${id}`
    ),

    footballFetch<ApiResponse<any[]>>(
      `/fixtures/players?fixture=${id}`
    ),
  ]);

  const fixture =
    fixtureData.response?.[0];

  if (!fixture) {
    return null;
  }

  return {
    ...fixture,

    statistics:
      statisticsData.response ?? [],

    events:
      eventsData.response ?? [],

    lineups:
      lineupsData.response ?? [],

    players:
      playersData.response ?? [],
  };
}

export async function getMatchDetails(
  id: string
) {
  const [
    fixtureData,
    statisticsData,
    eventsData,
    lineupsData,
    playersData,
    h2hData,
  ] = await Promise.all([
    footballFetch<ApiResponse<any[]>>(
      `/fixtures?id=${id}`
    ),

    footballFetch<ApiResponse<any[]>>(
      `/fixtures/statistics?fixture=${id}`
    ),

    footballFetch<ApiResponse<any[]>>(
      `/fixtures/events?fixture=${id}`
    ),

    footballFetch<ApiResponse<any[]>>(
      `/fixtures/lineups?fixture=${id}`
    ),

    footballFetch<ApiResponse<any[]>>(
      `/fixtures/players?fixture=${id}`
    ),

    footballFetch<ApiResponse<any[]>>(
      `/fixtures/headtohead?h2h=${id}`
    ).catch(() => ({
      response: [],
    })),
  ]);

  const fixture =
    fixtureData.response?.[0];

  if (!fixture) {
    return null;
  }

  const standings =
    await getStandings(
      fixture.league.id,
      fixture.league.season
    );

  return {
    fixture,

    statistics:
      statisticsData.response ?? [],

    events:
      eventsData.response ?? [],

    lineups:
      lineupsData.response ?? [],

    players:
      playersData.response ?? [],

    standings,

    h2h:
      h2hData.response ?? [],
  };
}