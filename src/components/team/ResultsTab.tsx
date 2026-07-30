interface Props {
  fixtures: any[];
}

export default function ResultsTab({
  fixtures,
}: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Results
      </h2>

      <p className="mt-4 text-zinc-400">
        Results module coming next.
      </p>
    </div>
  );
}