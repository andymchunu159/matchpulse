import Link from "next/link";
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

  const fixtureStatus =
    match.fixture.fixture.status.short;

  const predictionAvailable =
    fixtureStatus === "NS";

  return (
    <main className="container mx-auto space-y-6 py-8">
      <MatchHero fixture={match.fixture} />

      {/* AI Prediction */}
      <div className="flex justify-center">
        {predictionAvailable ? (
          <Link
            href={`/predictions/${fixtureId}`}
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-black transition hover:bg-green-400"
          >
            🔮 AI Prediction
          </Link>
        ) : (
          <div className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-zinc-800 px-6 py-3 font-semibold text-zinc-500">
            🔒 Prediction Unavailable
          </div>
        )}
      </div>

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
                lineups={match.lineups}
                homeTeamName={match.fixture.teams.home.name}
                awayTeamName={match.fixture.teams.away.name}
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
                homeTeamName={match.fixture.teams.home.name}
                awayTeamName={match.fixture.teams.away.name}
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