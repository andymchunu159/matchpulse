import { notFound } from "next/navigation";

import MatchHero from "@/components/match/MatchHero";
import MatchTabs from "@/components/match/MatchTabs";
import OverviewTab from "@/components/match/OverviewTab";
import TimelineTab from "@/components/match/TimelineTab";
import StandingsTab from "@/components/match/StandingsTab";
import VenueCard from "@/components/match/VenueCard";

import { getMatchDetails } from "@/lib/match-details";
import { getStandings } from "@/lib/football-server";

interface Props {
  params: Promise<{
    fixtureId: string;
  }>;
}

export default async function ResultDetailsPage({
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
        defaultTab="overview"
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