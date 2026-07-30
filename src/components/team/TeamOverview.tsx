import TeamStatsGrid from "./TeamStatsGrid";
import FormBadges from "@/components/standings/FormBadges";

interface Props {
  team: any;
  statistics: any;
}

export default function TeamOverview({
  team,
  statistics,
}: Props) {
  const recentForm = statistics?.form
    ? statistics.form.slice(-5)
    : "";

  return (
    <div className="space-y-6">
      {/* Recent Form */}

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="text-xl font-bold text-white">
          Recent Form
        </h2>

        <div className="mt-4 flex items-center justify-between">
          <FormBadges form={recentForm} />

          <span className="text-sm text-zinc-400">
            Last 5 matches
          </span>
        </div>
      </section>

      {/* Season Statistics */}

      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="mb-6 text-xl font-bold text-white">
          Season Statistics
        </h2>

        <TeamStatsGrid statistics={statistics} />
      </section>
    </div>
  );
}