interface Props {
  label: string;
  home: number;
  away: number;
  suffix?: string;
}

export default function StatisticBar({
  label,
  home,
  away,
  suffix = "",
}: Props) {
  const total = home + away;

  const homeWidth =
    total === 0 ? 50 : (home / total) * 100;

  const awayWidth =
    total === 0 ? 50 : (away / total) * 100;

  return (
    <div className="space-y-2">

      <div className="flex items-center justify-between text-sm">

        <span className="font-bold text-white">
          {home}
          {suffix}
        </span>

        <span className="text-zinc-400">
          {label}
        </span>

        <span className="font-bold text-white">
          {away}
          {suffix}
        </span>

      </div>

      <div className="flex h-3 overflow-hidden rounded-full bg-zinc-800">

        <div
          className="bg-green-500 transition-all duration-700"
          style={{
            width: `${homeWidth}%`,
          }}
        />

        <div
          className="bg-zinc-600 transition-all duration-700"
          style={{
            width: `${awayWidth}%`,
          }}
        />

      </div>

    </div>
  );
}