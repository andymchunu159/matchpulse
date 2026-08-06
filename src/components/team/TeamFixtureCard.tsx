import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { Fixture } from "@/lib/football";

interface Props {
  fixture: Fixture;
}

export default function TeamFixtureCard({
  fixture,
}: Props) {
  const status =
    fixture.fixture.status.short;

  const isFinished = [
    "FT",
    "AET",
    "PEN",
  ].includes(status);


  const kickoff = format(
    new Date(fixture.fixture.date),
    "EEE, dd MMM • HH:mm"
  );


  return (
    <Link
      href={`/fixtures/${fixture.fixture.id}`}
      className="
        group block rounded-2xl
        border border-zinc-800
        bg-zinc-900 p-5
        transition-all
        hover:border-green-500
        hover:bg-zinc-800
      "
    >

      {/* Competition Header */}

      <div className="mb-4 flex items-center justify-between">

        <div>
          <p className="text-sm text-zinc-400">
            {fixture.league.name}
          </p>

          <p className="text-xs text-zinc-500">
            {fixture.league.round}
          </p>
        </div>


        <span
          className="
            rounded-full
            bg-zinc-800
            px-3 py-1
            text-xs
            text-zinc-300
          "
        >
          {status}
        </span>

      </div>


      {/* Teams */}

      <div className="space-y-4">


        {/* Home */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Image
              src={fixture.teams.home.logo}
              alt={fixture.teams.home.name}
              width={36}
              height={36}
            />

            <span className="font-semibold text-white">
              {fixture.teams.home.name}
            </span>

          </div>


          {isFinished && (
            <span className="text-2xl font-bold text-white">
              {fixture.goals.home ?? "-"}
            </span>
          )}

        </div>



        {/* Away */}

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Image
              src={fixture.teams.away.logo}
              alt={fixture.teams.away.name}
              width={36}
              height={36}
            />

            <span className="font-semibold text-white">
              {fixture.teams.away.name}
            </span>

          </div>


          {isFinished && (
            <span className="text-2xl font-bold text-white">
              {fixture.goals.away ?? "-"}
            </span>
          )}

        </div>

      </div>



      {/* Footer */}

      <div
        className="
          mt-5 flex
          items-center
          justify-between
          text-sm
          text-zinc-500
        "
      >

        <div className="flex items-center gap-2">
          <Clock size={15} />
          <span>
            {isFinished ? status : kickoff}
          </span>
        </div>


        <div className="flex items-center gap-2">

          <MapPin size={15} />

          <span>
            {fixture.fixture.venue?.name ??
              "Venue TBA"}
          </span>

        </div>


        <ChevronRight
          size={18}
          className="
            text-zinc-600
            transition-transform
            group-hover:translate-x-1
            group-hover:text-green-500
          "
        />

      </div>

    </Link>
  );
}