import Image from "next/image";

interface Props {
  fixture: any;
}

export default function MatchHero({ fixture }: Props) {
  const home = fixture.teams.home;
  const away = fixture.teams.away;

  const status = fixture.fixture.status.short;
  const elapsed = fixture.fixture.status.elapsed;
  const date = fixture.fixture.date;

  const formatKickoff = (value: string) => {
    return new Date(value).toLocaleString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case "NS":
        return {
          label: "Upcoming",
          value: formatKickoff(date),
          className:
            "bg-blue-500/20 text-blue-400",
        };

      case "1H":
      case "2H":
      case "ET":
        return {
          label: "LIVE",
          value: `${elapsed ?? 0}'`,
          className:
            "bg-red-500/20 text-red-400",
        };

      case "HT":
        return {
          label: "Half Time",
          value: "45'",
          className:
            "bg-orange-500/20 text-orange-400",
        };

      case "BT":
        return {
          label: "Break",
          value: "",
          className:
            "bg-orange-500/20 text-orange-400",
        };

      case "FT":
        return {
          label: "Full Time",
          value: "FT",
          className:
            "bg-green-500/20 text-green-400",
        };

      case "AET":
        return {
          label: "After Extra Time",
          value: "AET",
          className:
            "bg-green-500/20 text-green-400",
        };

      case "PEN":
        return {
          label: "Penalties",
          value: "PEN",
          className:
            "bg-purple-500/20 text-purple-400",
        };

      case "PST":
        return {
          label: "Postponed",
          value: "PST",
          className:
            "bg-yellow-500/20 text-yellow-400",
        };

      case "CANC":
        return {
          label: "Cancelled",
          value: "CANC",
          className:
            "bg-zinc-600/20 text-zinc-300",
        };

      case "ABD":
        return {
          label: "Abandoned",
          value: "ABD",
          className:
            "bg-zinc-600/20 text-zinc-300",
        };

      default:
        return {
          label: status,
          value: elapsed ? `${elapsed}'` : "",
          className:
            "bg-zinc-700/20 text-zinc-300",
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8">
      {/* League */}

      <div className="mb-8 flex items-center justify-center gap-3">
        <Image
          src={fixture.league.logo}
          alt={fixture.league.name}
          width={26}
          height={26}
        />

        <span className="text-lg font-semibold text-yellow-400">
          {fixture.league.name}
        </span>
      </div>

      {/* Teams */}

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-10">
        {/* Home */}

        <div className="flex flex-col items-center">
          <Image
            src={home.logo}
            alt={home.name}
            width={80}
            height={80}
          />

          <h2 className="mt-4 text-center text-xl font-bold text-white">
            {home.name}
          </h2>
        </div>

        {/* Score */}

        <div className="text-center">
          <div className="text-6xl font-black text-white">
            {fixture.goals.home ?? 0} - {fixture.goals.away ?? 0}
          </div>

          <div className="mt-4 text-xl font-bold text-yellow-400">
            {badge.value}
          </div>

          <div
            className={`mt-2 inline-flex rounded-full px-4 py-1 text-sm font-bold uppercase tracking-widest ${badge.className}`}
          >
            {badge.label}
          </div>
        </div>

        {/* Away */}

        <div className="flex flex-col items-center">
          <Image
            src={away.logo}
            alt={away.name}
            width={80}
            height={80}
          />

          <h2 className="mt-4 text-center text-xl font-bold text-white">
            {away.name}
          </h2>
        </div>
      </div>
    </section>
  );
}