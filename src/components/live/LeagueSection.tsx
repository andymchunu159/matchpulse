import Image from "next/image";
import LiveScoreCard from "./LiveScoreCard";

interface Props {
  league?: {
    league: {
      id: number;
      name: string;
      logo: string;
      country: string;
    };
    matches: any[];
  };

  leagueName?: string;
  leagueLogo?: string;
  country?: string;
  matches?: any[];

  basePath?: string;
}

export default function LeagueSection({
  league,
  leagueName,
  leagueLogo,
  country,
  matches,
  basePath = "/live",
}: Props) {
  const name = league?.league.name ?? leagueName ?? "";
  const logo = league?.league.logo ?? leagueLogo ?? "";
  const nation = league?.league.country ?? country ?? "";
  const fixtures = league?.matches ?? matches ?? [];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
        <Image
          src={logo}
          alt={name}
          width={24}
          height={24}
        />

        <div>
          <h2 className="text-lg font-bold text-white">
            {name}
          </h2>

          <p className="text-sm text-zinc-400">
            {nation}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {fixtures.map((match) => (
          <LiveScoreCard
            key={match.fixture.id}
            match={match}
            basePath={basePath}
          />
        ))}
      </div>
    </section>
  );
}