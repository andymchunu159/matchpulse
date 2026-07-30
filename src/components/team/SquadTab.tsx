interface Props {
  squad: any;
}

export default function SquadTab({
  squad,
}: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="text-2xl font-bold text-white">
        Squad
      </h2>

      <pre className="mt-4 overflow-auto text-sm text-zinc-400">
        {JSON.stringify(squad, null, 2)}
      </pre>
    </div>
  );
}