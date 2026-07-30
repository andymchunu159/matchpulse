import FixtureCard from "@/components/fixtures/FixtureCard";

interface Props {
  fixtures: any[];
}

export default function FixturesTab({
  fixtures,
}: Props) {
  const upcomingFixtures = fixtures.filter((fixture) => {
    const status = fixture.fixture.status.short;

    return [
      "NS",
      "TBD",
      "PST",
    ].includes(status);
  });

  if (upcomingFixtures.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h2 className="text-2xl font-bold text-white">
          Upcoming Fixtures
        </h2>

        <p className="mt-4 text-zinc-400">
          No upcoming fixtures.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        Upcoming Fixtures
      </h2>

      <div className="grid gap-3">
        {upcomingFixtures.map((fixture) => (
          <FixtureCard
            key={fixture.fixture.id}
            fixture={fixture}
          />
        ))}
      </div>
    </section>
  );
}