"use client";

import StandingsTable from "./StandingsTable";
import QualificationLegend from "./QualificationLegend";

import UnavailableCard from "@/components/common/UnavailableCard";

import { LEAGUES } from "@/lib/leagues";

interface Props {
  standings: any[];
  leagueId: number;
  season: number;
}

export default function StandingsContent({
  standings,
  leagueId,
  season,
}: Props) {
  const league = LEAGUES.find(
    (item) => item.id === leagueId
  );

  if (
    !Array.isArray(standings) ||
    standings.length === 0
  ) {
    return (
    <UnavailableCard
      title="🏆 League Standings Unavailable"
      description={`League standings for ${
        league?.name ?? "this competition"
      } are currently unavailable from the MatchPulse data provider. You can still view the latest league table online.`}
      buttonText="View Latest Standings"
      searchQuery={`${
        league?.name ?? "Football"
      } standings ${season}`}
    />
    );
  }

  return (
    <div className="space-y-8">
      <StandingsTable
        standings={standings}
        leagueId={leagueId}
        season={season}
      />

      <QualificationLegend />
    </div>
  );
}