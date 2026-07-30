import { WifiOff } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No Live Matches",
  description = "There are currently no matches being played.",
}: Props) {
  return (
    <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900 p-12 text-center">
      <WifiOff className="mx-auto mb-4 h-10 w-10 text-zinc-500" />

      <h2 className="text-xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-2 text-zinc-400">
        {description}
      </p>
    </div>
  );
}