"use client";

import StandingsHeader from "./StandingsHeader";
import StandingsContent from "./StandingsContent";
import LeagueSelector from "./LeagueSelector";
import SeasonSelector from "./SeasonSelector";

import { LEAGUES } from "@/lib/leagues";

interface Props {
  initialStandings: any[];
  league: number;
  season: number;
}

export default function StandingsClient({
  initialStandings,
  league,
  season,
}: Props) {
  const selectedLeague =
    LEAGUES.find((l) => l.id === league);

  return (
    <>
      <StandingsHeader
        leagueName={
          selectedLeague?.name ??
          "League Standings"
        }
        season={season}
      >
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <LeagueSelector
            value={league}
            season={season}
          />

          <SeasonSelector
            value={season}
            league={league}
          />
        </div>
      </StandingsHeader>

      <StandingsContent
        standings={initialStandings}
        leagueId={league}
        season={season}
      />
    </>
  );
}