import LeagueSection from "@/components/live/LeagueSection";

import { groupMatchesByLeague } from "@/lib/groupMatches";

interface Props {
  matches: any[];
}

export default function ResultsContent({
  matches,
}: Props) {
  if (!matches.length) {
    return (
      <div className="rounded-3xl border border-white/10 bg-zinc-900 px-6 py-20">
        <p className="text-center text-base text-zinc-400">
          No completed fixtures were found for this date.
        </p>
      </div>
    );
  }

  const leagues = groupMatchesByLeague(matches);

  return (
    <div className="space-y-8">
      {leagues.map((group) => (
        <LeagueSection
          key={group.league.id}
          league={group}
          basePath="/results"
        />
      ))}
    </div>
  );
}