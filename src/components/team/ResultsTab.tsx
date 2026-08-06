import TeamFixtureCard from "@/components/team/TeamFixtureCard";

import { Fixture } from "@/lib/football";


interface Props {
  fixtures: Fixture[];
}


export default function ResultsTab({
  fixtures,
}: Props) {


  return (

    <div className="space-y-4">


      <h2 className="text-2xl font-bold text-white">
        Recent Results
      </h2>



      {fixtures.length === 0 ? (

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">

          <p className="text-center text-zinc-400">
            No recent results available.
          </p>

        </div>

      ) : (

        <div className="grid gap-3">

          {fixtures.map((fixture) => (

            <TeamFixtureCard

              key={fixture.fixture.id}

              fixture={fixture}

            />

          ))}

        </div>

      )}


    </div>

  );
}