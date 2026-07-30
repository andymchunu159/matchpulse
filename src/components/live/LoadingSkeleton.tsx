export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-zinc-800 bg-zinc-900 p-6">

      <div className="mb-6 h-5 w-40 rounded bg-zinc-800" />

      <div className="flex items-center justify-between">

        <div className="h-10 w-36 rounded bg-zinc-800" />

        <div className="h-12 w-20 rounded bg-zinc-800" />

        <div className="h-10 w-36 rounded bg-zinc-800" />

      </div>

    </div>
  );
}