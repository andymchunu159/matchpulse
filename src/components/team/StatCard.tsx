interface Props {
  title: string;
  value: string | number;
}

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-green-500/30 hover:bg-zinc-900">
      <p className="text-sm font-medium text-zinc-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black text-white">
        {value}
      </p>
    </div>
  );
}