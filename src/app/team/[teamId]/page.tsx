import { notFound } from "next/navigation";

import TeamHero from "@/components/team/TeamHero";
import TeamTabs from "@/components/team/TeamTabs";

import {
  getTeam,
  getTeamStatistics,
  getTeamSquad,
  getTeamFixtures,
} from "@/lib/team-server";

interface Props {
  params: Promise<{
    teamId: string;
  }>;

  searchParams: Promise<{
    league?: string;
    season?: string;
  }>;
}

export default async function TeamPage({
  params,
  searchParams,
}: Props) {
  const { teamId } = await params;
  const { league, season } = await searchParams;

  const id = Number(teamId);

  if (Number.isNaN(id)) {
    notFound();
  }

  const team = await getTeam(id);

  if (!team) {
    notFound();
  }

  const leagueId = league
    ? Number(league)
    : undefined;

  const seasonYear = season
    ? Number(season)
    : new Date().getFullYear();

  const [
    statistics,
    squad,
    fixtures,
  ] = await Promise.all([
    leagueId
      ? getTeamStatistics(
          id,
          leagueId,
          seasonYear
        )
      : Promise.resolve(null),

    getTeamSquad(id),

    getTeamFixtures(
      id,
      seasonYear
    ),
  ]);

  const now = Date.now() / 1000;

  const upcomingFixtures = fixtures
    .filter((fixture) =>
      ["NS", "TBD", "PST"].includes(
        fixture.fixture.status.short
      ) ||
      fixture.fixture.timestamp > now
    )
    .sort(
      (a, b) =>
        a.fixture.timestamp -
        b.fixture.timestamp
    )
    .slice(0, 10);

  const recentResults = fixtures
    .filter((fixture) =>
      ["FT", "AET", "PEN"].includes(
        fixture.fixture.status.short
      )
    )
    .sort(
      (a, b) =>
        b.fixture.timestamp -
        a.fixture.timestamp
    )
    .slice(0, 10);

  return (
    <main className="container mx-auto space-y-6 py-8">
      <TeamHero team={team} />

      <TeamTabs
        team={team}
        statistics={statistics}
        squad={squad}
        season={seasonYear}
        upcomingFixtures={upcomingFixtures}
        recentResults={recentResults}
      />
    </main>
  );
}