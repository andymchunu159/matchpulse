import { Trophy } from "lucide-react";
import { Fixture } from "@/lib/football";

interface Props {
  fixture: Fixture;
}

export default function StandingsTab({
  fixture,
}: Props) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <div className="mb-6 flex items-center gap-3">
        <Trophy className="text-green-500" />

        <h2 className="text-xl font-bold text-white">
          League Standings
        </h2>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-950/40 p-8 text-center">
        <p className="text-lg font-semibold text-white">
          Standings Coming Soon
        </p>

        <p className="mt-2 text-sm text-zinc-400">
          League standings for{" "}
          <span className="font-medium text-zinc-300">
            {fixture.league.name}
          </span>{" "}
          will be available in the next update.
        </p>
      </div>
    </section>
  );
}