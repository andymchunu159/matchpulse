import Image from "next/image";

interface Props {
  squad: any;
}

export default function SquadTab({
  squad,
}: Props) {
  const players = squad?.players ?? [];

  const goalkeepers = players.filter(
    (player: any) =>
      player.position === "Goalkeeper"
  );

  const defenders = players.filter(
    (player: any) =>
      player.position === "Defender"
  );

  const midfielders = players.filter(
    (player: any) =>
      player.position === "Midfielder"
  );

  const forwards = players.filter(
    (player: any) =>
      player.position === "Attacker"
  );

  return (
    <div className="space-y-8">
      <PositionSection
        title="Goalkeepers"
        players={goalkeepers}
      />

      <PositionSection
        title="Defenders"
        players={defenders}
      />

      <PositionSection
        title="Midfielders"
        players={midfielders}
      />

      <PositionSection
        title="Forwards"
        players={forwards}
      />
    </div>
  );
}

interface SectionProps {
  title: string;
  players: any[];
}

function PositionSection({
  title,
  players,
}: SectionProps) {
  if (players.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-6 text-2xl font-bold text-white">
        {title}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
          />
        ))}
      </div>
    </section>
  );
}

function PlayerCard({
  player,
}: {
  player: any;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 transition hover:border-green-500/40">
      <Image
        src={player.photo}
        alt={player.name}
        width={64}
        height={64}
        className="rounded-full border border-zinc-700"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-white">
          {player.name}
        </h3>

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-zinc-800 px-2 py-1 text-zinc-300">
            #{player.number ?? "-"}
          </span>

          <span className="rounded-full bg-zinc-800 px-2 py-1 text-zinc-300">
            {player.age} yrs
          </span>

          <span className="rounded-full bg-green-600/20 px-2 py-1 text-green-400">
            {player.position}
          </span>
        </div>
      </div>
    </div>
  );
}