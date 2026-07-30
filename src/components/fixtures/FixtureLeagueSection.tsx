import Image from "next/image";
import FixtureCard from "./FixtureCard";
import { FixtureResponse } from "@/lib/football-server";

interface Props {
  league: FixtureResponse["league"];
  fixtures: FixtureResponse[];
}

export default function FixtureLeagueSection({
  league,
  fixtures,
}: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
        <Image
          src={league.logo}
          alt={league.name}
          width={24}
          height={24}
          className="rounded-full"
        />

        <div className="flex flex-col">
          <span className="font-semibold text-white">
            {league.name}
          </span>

          <span className="text-xs text-zinc-400">
            {league.country}
          </span>
        </div>
      </div>

      <div>
        {fixtures.map((fixture) => (
          <FixtureCard
            key={fixture.fixture.id}
            fixture={fixture}
          />
        ))}
      </div>
    </section>
  );
}