import StandingsTable from "@/components/standings/StandingsTable";
import UnavailableCard from "@/components/common/UnavailableCard";

interface Props {
  standings: any[];
  leagueId: number;
  season: number;
  leagueName: string;
}

export default function StandingsTab({
  standings,
  leagueId,
  season,
  leagueName,
}: Props) {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-white">
        League Standings
      </h2>

      {standings.length > 0 ? (
        <StandingsTable
          standings={standings}
          leagueId={leagueId}
          season={season}
        />
      ) : (
        <UnavailableCard
          title="🏆 League Standings Unavailable"
          description={`Live standings for ${leagueName} are currently unavailable from the MatchPulse data provider. You can still view the latest league table online.`}
          buttonText="View Latest Standings"
          searchQuery={`${leagueName} standings ${season}`}
        />
      )}
    </section>
  );
}