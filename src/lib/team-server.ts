import { footballFetch } from "@/lib/football";

export async function getTeam(teamId: number) {
  const response = await footballFetch(
    `/teams?id=${teamId}`
  );

  return response.response?.[0] ?? null;
}

export async function getTeamStatistics(
  teamId: number,
  league: number,
  season: number
) {
  const response = await footballFetch(
    `/teams/statistics?league=${league}&season=${season}&team=${teamId}`
  );

  return response.response ?? null;
}

export async function getTeamSquad(teamId: number) {
  const response = await footballFetch(
    `/players/squads?team=${teamId}`
  );

  return response.response?.[0] ?? null;
}

export async function getTeamFixtures(
  teamId: number,
  last = 10
) {
  const response = await footballFetch(
    `/fixtures?team=${teamId}&last=${last}`
  );

  return response.response ?? [];
}