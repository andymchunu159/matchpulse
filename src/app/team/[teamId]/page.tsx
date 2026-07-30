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

  const leagueId = league ? Number(league) : undefined;
  const seasonYear = season ? Number(season) : undefined;

  const [statistics, squad, fixtures] =
    await Promise.all([
      leagueId && seasonYear
        ? getTeamStatistics(
            id,
            leagueId,
            seasonYear
          )
        : Promise.resolve(null),
      getTeamSquad(id),
      getTeamFixtures(id),
    ]);

  return (
    <main className="container mx-auto space-y-6 py-8">
      <TeamHero team={team} />

      <TeamTabs
        team={team}
        statistics={statistics}
        squad={squad}
        fixtures={fixtures}
      />
    </main>
  );
}