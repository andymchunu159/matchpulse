import StatCard from "./StatCard";

interface Props {
  statistics: any;
}

export default function TeamStatsGrid({
  statistics,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Played"
        value={statistics?.fixtures?.played?.total ?? "-"}
      />

      <StatCard
        title="Wins"
        value={statistics?.fixtures?.wins?.total ?? "-"}
      />

      <StatCard
        title="Draws"
        value={statistics?.fixtures?.draws?.total ?? "-"}
      />

      <StatCard
        title="Losses"
        value={statistics?.fixtures?.loses?.total ?? "-"}
      />

      <StatCard
        title="Goals For"
        value={statistics?.goals?.for?.total?.total ?? "-"}
      />

      <StatCard
        title="Goals Against"
        value={statistics?.goals?.against?.total?.total ?? "-"}
      />

      <StatCard
        title="Clean Sheets"
        value={statistics?.clean_sheet?.total ?? "-"}
      />

      <StatCard
        title="Matches Without Scoring"
        value={statistics?.failed_to_score?.total ?? "-"}
      />
    </div>
  );
}