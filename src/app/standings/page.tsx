import StandingsClient from "@/components/standings/StandingsClient";

import {
  DEFAULT_LEAGUE,
  API_DEFAULT_SEASON,
} from "@/lib/config";

import { getStandings } from "@/lib/football-server";

interface Props {
  searchParams: Promise<{
    league?: string;
    season?: string;
  }>;
}

export default async function StandingsPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const league =
    Number(params.league) || DEFAULT_LEAGUE;

  const season =
    Number(params.season) || API_DEFAULT_SEASON;

  const standings = await getStandings(
    league,
    season
  );

  return (
    <main className="container mx-auto space-y-6 py-8">
      <StandingsClient
        initialStandings={standings}
        league={league}
        season={season}
      />
    </main>
  );
}