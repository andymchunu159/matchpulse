import Image from "next/image";
import Link from "next/link";

import UnavailableCard from "@/components/common/UnavailableCard";

interface Props {
  h2h: any[];
  homeTeamId: number;
  awayTeamId: number;
}

export default function H2HTab({
  h2h,
  homeTeamId,
  awayTeamId,
}: Props) {
  if (!h2h || h2h.length === 0) {
    return (
      <UnavailableCard
        title="🤝 Head-to-Head Unavailable"
        description="Previous meetings between these teams are currently unavailable through MatchPulse. You can still view the latest head-to-head statistics online."
        buttonText="View Head-to-Head Online"
        searchQuery="Head-to-head football"
      />
    );
  }

  const firstMatch = h2h[0];

  const homeTeamName =
    firstMatch?.teams?.home?.id === homeTeamId
      ? firstMatch.teams.home.name
      : firstMatch?.teams.away?.name ?? "Home Team";

  const awayTeamName =
    firstMatch?.teams?.home?.id === awayTeamId
      ? firstMatch.teams.home.name
      : firstMatch?.teams.away?.name ?? "Away Team";

  let homeWins = 0;
  let awayWins = 0;
  let draws = 0;
  let totalGoals = 0;

  h2h.forEach((match) => {
    const homeGoals = match.goals.home ?? 0;
    const awayGoals = match.goals.away ?? 0;

    totalGoals += homeGoals + awayGoals;

    const actualHomeId = match.teams.home.id;
    const actualAwayId = match.teams.away.id;

    if (homeGoals === awayGoals) {
      draws++;
      return;
    }

    const winner =
      homeGoals > awayGoals
        ? actualHomeId
        : actualAwayId;

    if (winner === homeTeamId) {
      homeWins++;
    } else if (winner === awayTeamId) {
      awayWins++;
    }
  });

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-8 text-xl font-bold text-white">
        Head-to-Head
      </h2>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-zinc-950 p-4 text-center">
          <p className="text-sm text-zinc-500">
            Home Wins
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            {homeWins}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-4 text-center">
          <p className="text-sm text-zinc-500">
            Away Wins
          </p>

          <p className="mt-2 text-3xl font-bold text-red-400">
            {awayWins}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-4 text-center">
          <p className="text-sm text-zinc-500">
            Draws
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-400">
            {draws}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-950 p-4 text-center">
          <p className="text-sm text-zinc-500">
            Total Goals
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {totalGoals}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {h2h.map((match: any) => {
          const homeGoals = match.goals.home ?? 0;
          const awayGoals = match.goals.away ?? 0;

          const homeWinner = homeGoals > awayGoals;
          const awayWinner = awayGoals > homeGoals;

          return (
            <Link
              key={match.fixture.id}
              href={`/live/${match.fixture.id}`}
              className="block"
            >
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition-all duration-300 hover:border-green-500 hover:bg-zinc-900 hover:shadow-lg hover:shadow-green-500/10">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={match.league.logo}
                      alt={match.league.name}
                      width={28}
                      height={28}
                    />

                    <div>
                      <p className="text-sm font-medium text-white">
                        {match.league.name}
                      </p>

                      <p className="text-xs text-zinc-500">
                        {new Date(
                          match.fixture.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
                    {match.fixture.status.short}
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={match.teams.home.logo}
                      alt={match.teams.home.name}
                      width={34}
                      height={34}
                    />

                    <span
                      className={
                        homeWinner
                          ? "font-bold text-green-400"
                          : "text-white"
                      }
                    >
                      {match.teams.home.name}
                    </span>
                  </div>

                  <div className="rounded-xl bg-zinc-900 px-5 py-2 text-lg font-bold text-white">
                    {homeGoals} - {awayGoals}
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <span
                      className={
                        awayWinner
                          ? "font-bold text-green-400"
                          : "text-white"
                      }
                    >
                      {match.teams.away.name}
                    </span>

                    <Image
                      src={match.teams.away.logo}
                      alt={match.teams.away.name}
                      width={34}
                      height={34}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}