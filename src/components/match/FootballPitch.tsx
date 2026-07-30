interface Player {
  id: number;
  name: string;
  number: number;
  grid?: string;
}

interface Props {
  players: Player[];
}

export default function FootballPitch({
  players,
}: Props) {
  const positionedPlayers = players.filter(
    (player) => player.grid
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-green-800 bg-gradient-to-b from-green-900 via-green-800 to-green-900 p-6">

      {/* Pitch markings */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />

        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />

        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/30" />

      </div>

      <div className="relative h-[640px]">

        {positionedPlayers.map((player) => {
          const [row, col] = player.grid!.split(":").map(Number);

          const top = ((row - 1) / 10) * 100;
          const left = ((col - 1) / 4) * 100;

          return (
            <div
              key={player.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${top}%`,
                left: `${left}%`,
              }}
            >
              <div className="flex flex-col items-center">

                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-green-600 font-bold text-white shadow-lg">
                  {player.number}
                </div>

                <div className="mt-2 max-w-[80px] text-center text-xs font-medium text-white">
                  {player.name}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}