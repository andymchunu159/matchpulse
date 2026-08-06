import PlayerCard from "./PlayerCard";

interface Player {
  id: number;
  name: string;
  age: number | null;
  number: number | null;
  position: string | null;
  photo: string;
}

interface Props {
  title: string;
  players: Player[];
}

export default function SquadSection({
  title,
  players,
}: Props) {
  if (players.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {title}
        </h2>

        <span className="rounded-full bg-green-600/20 px-3 py-1 text-sm font-medium text-green-400">
          {players.length}
        </span>
      </div>

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