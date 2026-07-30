import { notFound } from "next/navigation";

import MatchHero from "@/components/match/MatchHero";
import MatchMomentum from "@/components/match/MatchMomentum";
import MatchTabs from "@/components/match/MatchTabs";
import OverviewTab from "@/components/match/OverviewTab";
import EventsTab from "@/components/match/EventsTab";
import LineupsTab from "@/components/match/LineUpsTab";
import PlayerStatsTab from "@/components/match/PlayerStatsTab";
import H2HTab from "@/components/match/H2HTab";

import { getFixture } from "@/lib/football-server";

interface Props {
  params: Promise<{
    fixtureId: string;
  }>;
}

export default async function MatchDetailsPage({
  params,
}: Props) {
  const { fixtureId } = await params;

  const match = await getFixture(fixtureId);

  if (!match) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="space-y-10">
        <MatchHero fixture={match} />

        <MatchMomentum
          fixture={match}
          events={match.events}
        />

        <MatchTabs
          tabs={[
            {
              id: "overview",
              label: "Overview",
              content: (
                <OverviewTab
                  fixture={match}
                  statistics={match.statistics}
                />
              ),
            },
            {
              id: "timeline",
              label: "Timeline",
              content: (
                <EventsTab
                  events={match.events}
                />
              ),
            },
            {
              id: "lineups",
              label: "Lineups",
              content: (
                <LineupsTab
                  lineups={match.lineups}
                />
              ),
            },
            {
              id: "players",
              label: "Players",
              content: (
                <PlayerStatsTab
                  players={match.players}
                />
              ),
            },
            {
              id: "h2h",
              label: "H2H",
              content: (
                <H2HTab
                  h2h={match.h2h}
                  homeTeamId={match.teams.home.id}
                  awayTeamId={match.teams.away.id}
                />
              ),
            },
          ]}
        />
      </div>
    </main>
  );
}