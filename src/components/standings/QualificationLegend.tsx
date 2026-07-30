export default function QualificationLegend() {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
      <h2 className="mb-5 text-xl font-bold text-white">
        Qualification Legend
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Legend
          color="bg-green-500"
          title="Champions League"
          description="Automatic qualification"
        />

        <Legend
          color="bg-blue-500"
          title="Europa League"
          description="Automatic qualification"
        />

        <Legend
          color="bg-orange-500"
          title="Conference League"
          description="Automatic qualification"
        />

        <Legend
          color="bg-red-500"
          title="Relegation"
          description="Relegated to lower division"
        />
      </div>
    </section>
  );
}

function Legend({
  color,
  title,
  description,
}: {
  color: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
      <div
        className={`mt-1 h-4 w-4 rounded-full ${color}`}
      />

      <div>
        <p className="font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}