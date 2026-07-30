import TeamOverview from "@/components/team/TeamOverview";

interface Props {
  team: any;
  statistics: any;
}

export default function OverviewTab({
  team,
  statistics,
}: Props) {
  return (
    <TeamOverview
      team={team}
      statistics={statistics}
    />
  );
}