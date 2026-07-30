"use client";

interface Props {
  error: Error;
  reset: () => void;
}

export default function Error({
  reset,
}: Props) {
  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-white">
        Something went wrong
      </h1>

      <p className="text-zinc-400">
        We couldn't load the standings.
      </p>

      <button
        onClick={reset}
        className="rounded-lg bg-green-600 px-5 py-2 text-white"
      >
        Try Again
      </button>
    </main>
  );
}