import {
  footballFetch,
  ApiResponse,
} from "@/lib/football";

import { getSupportedStandingsSeason } from "@/lib/season";

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