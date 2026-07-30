import Link from "next/link";
import Image from "next/image";

interface Props {
  match: any;
  basePath?: string;
}

export default function LiveScoreCard({
  match,
  basePath = "/live",
}: Props) {
  const status = match.fixture.status.short;
  const elapsed = match.fixture.status.elapsed;

  const getStatus = () => {
    switch (status) {
      case "NS":
        return {
          label: "Upcoming",
          value: new Date(match.fixture.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          badge: "bg-blue-500/20 text-blue-400",
          live: false,
        };

      case "1H":
      case "2H":
      case "ET":
        return {
          label: "LIVE",
          value: `${elapsed ?? 0}'`,
          badge: "bg-red-500/20 text-red-400",
          live: true,
        };

      case "HT":
        return {
          label: "HT",
          value: "45'",
          badge: "bg-orange-500/20 text-orange-400",
          live: false,
        };

      case "FT":
        return {
          label: "FT",
          value: "Full Time",
          badge: "bg-green-500/20 text-green-400",
          live: false,
        };

      case "AET":
        return {
          label: "AET",
          value: "After ET",
          badge: "bg-green-500/20 text-green-400",
          live: false,
        };

      case "PEN":
        return {
          label: "PEN",
          value: "Penalties",
          badge: "bg-purple-500/20 text-purple-400",
          live: false,
        };

      case "PST":
        return {
          label: "Postponed",
          value: "",
          badge: "bg-yellow-500/20 text-yellow-400",
          live: false,
        };

      case "CANC":
        return {
          label: "Cancelled",
          value: "",
          badge: "bg-zinc-600/20 text-zinc-300",
          live: false,
        };

      default:
        return {
          label: status,
          value: elapsed ? `${elapsed}'` : "",
          badge: "bg-zinc-700/20 text-zinc-300",
          live: false,
        };
    }
  };

  const matchStatus = getStatus();

  return (
    <Link href={`${basePath}/${match.fixture.id}`}>
      <div className="group cursor-pointer rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-500/40 hover:bg-zinc-900 hover:shadow-lg hover:shadow-green-500/10">
        {/* League */}

        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={match.league.logo}
              alt={match.league.name}
              width={20}
              height={20}
            />

            <span className="text-sm font-medium text-yellow-400">
              {match.league.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {matchStatus.live && (
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
              </span>
            )}

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${matchStatus.badge}`}
            >
              {matchStatus.label}
            </span>
          </div>
        </div>

        {/* Teams */}

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          {/* Home */}

          <div className="flex items-center gap-3">
            <Image
              src={match.teams.home.logo}
              alt={match.teams.home.name}
              width={42}
              height={42}
            />

            <span className="font-semibold text-white">
              {match.teams.home.name}
            </span>
          </div>

          {/* Score */}

          <div className="text-center">
            <div className="text-4xl font-black text-white">
              {match.goals.home ?? 0} : {match.goals.away ?? 0}
            </div>

            <div className="mt-2 text-sm font-semibold text-yellow-400">
              {matchStatus.value}
            </div>
          </div>

          {/* Away */}

          <div className="flex items-center justify-end gap-3">
            <span className="text-right font-semibold text-white">
              {match.teams.away.name}
            </span>

            <Image
              src={match.teams.away.logo}
              alt={match.teams.away.name}
              width={42}
              height={42}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}