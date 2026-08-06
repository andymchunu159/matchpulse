import {
  footballFetch,
  Fixture,
  ApiResponse,
} from "./football";

import { getSupportedStandingsSeason } from "./season";

export async function getTeam(
  teamId: number
) {
  const response =
    await footballFetch<ApiResponse<any[]>>(
      `/teams?id=${teamId}`
    );

  return response.response?.[0] ?? null;
}

export async function getTeamStatistics(
  teamId: number,
  leagueId: number,
  season: number
) {
  const supportedSeason =
    getSupportedStandingsSeason(season);

  const response =
    await footballFetch<ApiResponse<any>>(
      `/teams/statistics?team=${teamId}&league=${leagueId}&season=${supportedSeason}`
    );

  return response.response ?? null;
}

export async function getTeamSquad(
  teamId: number
) {
  const response =
    await footballFetch<ApiResponse<any[]>>(
      `/players/squads?team=${teamId}`
    );

  return response.response?.[0] ?? null;
}

export async function getTeamFixtures(
  teamId: number,
  season: number
): Promise<Fixture[]> {
  const supportedSeason =
    getSupportedStandingsSeason(season);

  const response =
    await footballFetch<ApiResponse<Fixture[]>>(
      `/fixtures?team=${teamId}&season=${supportedSeason}`
    );

  return response.response ?? [];
}