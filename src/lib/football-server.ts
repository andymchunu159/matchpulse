import {
  footballFetch,
  Fixture,
  ApiResponse,
} from "@/lib/football";

import { getSupportedStandingsSeason } from "@/lib/season";

export type FixtureResponse = Fixture;

/**
 * ============================================================
 * ALL FIXTURES
 * ============================================================
 *
 * Returns every fixture for the requested date:
 * - NS  = Not Started
 * - 1H  = First Half
 * - HT  = Half Time
 * - 2H  = Second Half
 * - FT  = Full Time
 * - AET = After Extra Time
 * - PEN = Penalties
 * - etc.
 *
 * Used by the general Fixtures module.
 */
export async function getFixtures(
  date: string
): Promise<FixtureResponse[]> {
  const response =
    await footballFetch<ApiResponse<FixtureResponse[]>>(
      `/fixtures?date=${date}`
    );

  return response.response ?? [];
}

/**
 * ============================================================
 * UPCOMING FIXTURES
 * ============================================================
 *
 * Used specifically by the Predictions module.
 *
 * Only fixtures that have NOT started are returned.
 *
 * NS = Not Started
 *
 * Live and completed fixtures are excluded.
 */
export async function getUpcomingFixtures(
  date: string
): Promise<FixtureResponse[]> {
  const fixtures = await getFixtures(date);

  return fixtures.filter(
    (fixture) =>
      fixture.fixture.status.short === "NS"
  );
}

/**
 * ============================================================
 * RESULTS
 * ============================================================
 *
 * Returns completed fixtures for the requested date.
 */
export async function getResults(
  date: string
): Promise<FixtureResponse[]> {
  const response =
    await footballFetch<ApiResponse<FixtureResponse[]>>(
      `/fixtures?date=${date}&status=FT`
    );

  return response.response ?? [];
}

/**
 * ============================================================
 * STANDINGS
 * ============================================================
 */
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

/**
 * ============================================================
 * SINGLE FIXTURE
 * ============================================================
 *
 * Fetches a fixture together with:
 * - Statistics
 * - Events
 * - Lineups
 * - Players
 */
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

/**
 * ============================================================
 * MATCH DETAILS
 * ============================================================
 *
 * Used by the Fixture Details module.
 *
 * Includes:
 * - Fixture
 * - Statistics
 * - Events / Timeline
 * - Lineups
 * - Players
 * - Standings
 * - Head-to-Head
 */
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