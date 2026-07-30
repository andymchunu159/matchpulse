import { Table2 } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">
      <Table2 className="mx-auto mb-4 h-10 w-10 text-zinc-500" />

      <h2 className="text-xl font-bold text-white">
        No Standings Available
      </h2>

      <p className="mt-2 text-zinc-400">
        League standings could not be loaded.
      </p>
    </div>
  );
}