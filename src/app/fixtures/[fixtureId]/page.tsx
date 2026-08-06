import { notFound } from "next/navigation";

import MatchHero from "@/components/match/MatchHero";
import MatchTabs from "@/components/match/MatchTabs";
import OverviewTab from "@/components/match/OverviewTab";
import TimelineTab from "@/components/match/TimelineTab";
import LineUpsTab from "@/components/match/LineUpsTab";
import H2HTab from "@/components/match/H2HTab";
import StandingsTab from "@/components/match/StandingsTab";
import VenueCard from "@/components/match/VenueCard";

import { getMatchDetails } from "@/lib/match-details";
import { getStandings } from "@/lib/football-server";

interface Props {
  params: Promise<{
    fixtureId: string;
  }>;
}

export default async function FixtureDetailsPage({
  params,
}: Props) {
  const { fixtureId } = await params;

  const match = await getMatchDetails(fixtureId);

  if (!match) {
    notFound();
  }

  const standings = await getStandings(
    match.fixture.league.id,
    match.fixture.league.season
  );

  return (
    <main className="container mx-auto space-y-6 py-8">
      <MatchHero fixture={match.fixture} />

      <MatchTabs
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <OverviewTab
                fixture={match.fixture}
                statistics={match.statistics}
              />
            ),
          },
          {
            id: "timeline",
            label: "Timeline",
            content: (
              <TimelineTab
                events={match.events}
              />
            ),
          },
          {
            id: "lineups",
            label: "Lineups",
            content: (
<LineUpsTab
  fixture={match.fixture}
  lineups={match.lineups}
/>
            ),
          },
          {
            id: "table",
            label: "Standings",
            content: (
              <StandingsTab
                standings={standings}
                leagueId={match.fixture.league.id}
                season={match.fixture.league.season}
                leagueName={match.fixture.league.name}
              />
            ),
          },
          {
            id: "h2h",
            label: "H2H",
            content: (
              <H2HTab
                h2h={match.h2h}
                homeTeamId={match.fixture.teams.home.id}
                awayTeamId={match.fixture.teams.away.id}
              />
            ),
          },
          {
            id: "venue",
            label: "Venue",
            content: (
              <VenueCard
                fixture={match.fixture}
              />
            ),
          },
        ]}
      />
    </main>
  );
}