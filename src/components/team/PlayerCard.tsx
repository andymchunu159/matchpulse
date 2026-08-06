import Image from "next/image";
import { User, Hash, Calendar } from "lucide-react";

interface Props {
  player: {
    id: number;
    name: string;
    age: number | null;
    number: number | null;
    position: string | null;
    photo: string;
  };
}

export default function PlayerCard({
  player,
}: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 transition hover:border-green-600">
      <div className="flex items-center gap-4">
        <Image
          src={player.photo}
          alt={player.name}
          width={72}
          height={72}
          className="rounded-full border border-zinc-700"
        />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-white">
            {player.name}
          </h3>

          <p className="text-sm text-green-500">
            {player.position ?? "Unknown"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-xl bg-zinc-800 p-3">
          <Hash
            size={16}
            className="text-green-500"
          />

          <div>
            <p className="text-xs text-zinc-500">
              Number
            </p>

            <p className="font-medium text-white">
              {player.number ?? "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-zinc-800 p-3">
          <Calendar
            size={16}
            className="text-green-500"
          />

          <div>
            <p className="text-xs text-zinc-500">
              Age
            </p>

            <p className="font-medium text-white">
              {player.age ?? "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}