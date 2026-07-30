interface Props {
  fixture: any;
  events: any[];
}

export default function MatchMomentum({
  fixture,
  events,
}: Props) {
  if (!events || events.length === 0) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
        <h2 className="mb-6 text-xl font-bold text-white">
          Match Momentum
        </h2>

        <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-10 text-center">
          <p className="text-lg font-semibold text-white">
            Momentum Unavailable
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            There are no match events available.
          </p>
        </div>
      </section>
    );
  }

  const homeId = fixture.teams.home.id;
  const awayId = fixture.teams.away.id;

  const homeScore = events.reduce((score: number, event: any) => {
    if (event.team.id !== homeId) return score;

    switch (event.type) {
      case "Goal":
        return score + 8;

      case "Var":
        return score + 2;

      case "subst":
        return score + 1;

      case "Card":
        return score - 2;

      default:
        return score;
    }
  }, 50);

  const awayScore = events.reduce((score: number, event: any) => {
    if (event.team.id !== awayId) return score;

    switch (event.type) {
      case "Goal":
        return score + 8;

      case "Var":
        return score + 2;

      case "subst":
        return score + 1;

      case "Card":
        return score - 2;

      default:
        return score;
    }
  }, 50);

  const total = homeScore + awayScore;

  const homePercent =
    total === 0 ? 50 : (homeScore / total) * 100;

  const awayPercent =
    total === 0 ? 50 : (awayScore / total) * 100;

  function getMomentumColor(percent: number) {
    if (percent >= 80) return "bg-green-500";
    if (percent >= 60) return "bg-lime-500";
    if (percent >= 40) return "bg-yellow-400";
    if (percent >= 20) return "bg-orange-500";
    return "bg-red-500";
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-8 text-xl font-bold text-white">
        Match Momentum
      </h2>

      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-3xl font-bold text-green-400">
            {homePercent.toFixed(0)}%
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            {fixture.teams.home.name}
          </p>
        </div>

        <div className="mx-6 flex-1">
          <div className="h-5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getMomentumColor(
                homePercent
              )}`}
              style={{
                width: `${homePercent}%`,
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-3xl font-bold text-green-400">
            {awayPercent.toFixed(0)}%
          </p>

          <p className="mt-1 text-sm text-zinc-400">
            {fixture.teams.away.name}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {events
          .slice(-8)
          .reverse()
          .map((event: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-3"
            >
              <div>
                <p className="font-medium text-white">
                  {event.player?.name ?? "Unknown"}
                </p>

                <p className="text-sm text-zinc-500">
                  {event.type}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-white">
                  {event.team.name}
                </p>

                <p className="text-sm text-zinc-500">
                  {event.time.elapsed}'
                </p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}