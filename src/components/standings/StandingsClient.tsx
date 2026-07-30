"use client";

import StandingsHeader from "./StandingsHeader";
import StandingsContent from "./StandingsContent";
import LeagueSelector from "./LeagueSelector";
import SeasonSelector from "./SeasonSelector";

interface Props {
  initialStandings: any;
  league: number;
  season: number;
}

export default function StandingsClient({
  initialStandings,
  league,
  season,
}: Props) {
  return (
    <>
      <StandingsHeader
        leagueName={initialStandings?.league?.name}
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
      />
    </>
  );
}