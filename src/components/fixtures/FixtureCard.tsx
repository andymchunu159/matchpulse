import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { FixtureResponse } from "@/lib/football-server";

interface Props {
  fixture: FixtureResponse;
}

export default function FixtureCard({
  fixture,
}: Props) {
  const kickoff = format(
    new Date(fixture.fixture.date),
    "HH:mm"
  );

  const status =
    fixture.fixture.status.short;

  const isFinished = [
    "FT",
    "AET",
    "PEN",
  ].includes(status);

  const showStatus =
    status !== "NS";


  return (
    <Link
      href={`/fixtures/${fixture.fixture.id}`}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-green-500 hover:bg-zinc-800"
    >
      <div className="flex items-start justify-between gap-4">

        <div className="flex-1">

          <div className="mb-4 flex items-center justify-between">

            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Clock size={16} />
              <span>
                {kickoff}
              </span>
            </div>


            {showStatus && (
              <span className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300">
                {status}
              </span>
            )}

          </div>


          <div className="space-y-4">

            {/* Home Team */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Image
                  src={fixture.teams.home.logo}
                  alt={fixture.teams.home.name}
                  width={28}
                  height={28}
                />

                <span className="font-medium text-white">
                  {fixture.teams.home.name}
                </span>

              </div>


              {isFinished && (
                <span className="text-xl font-bold text-white">
                  {fixture.goals.home ?? "-"}
                </span>
              )}

            </div>



            {/* Away Team */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <Image
                  src={fixture.teams.away.logo}
                  alt={fixture.teams.away.name}
                  width={28}
                  height={28}
                />

                <span className="font-medium text-white">
                  {fixture.teams.away.name}
                </span>

              </div>


              {isFinished && (
                <span className="text-xl font-bold text-white">
                  {fixture.goals.away ?? "-"}
                </span>
              )}

            </div>

          </div>


          <div className="mt-4 flex items-center gap-2 text-sm text-zinc-500">

            <MapPin size={16} />

            <span>
              {fixture.fixture.venue?.name ??
                "Venue TBA"}
            </span>

          </div>

        </div>


        <ChevronRight
          size={20}
          className="mt-1 text-zinc-600 transition-transform group-hover:translate-x-1 group-hover:text-green-500"
        />

      </div>
    </Link>
  );
}