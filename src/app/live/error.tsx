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

      <p className="max-w-md text-zinc-400">
        We couldn't load the fixture details.
        Please try again.
      </p>

      <button
        onClick={reset}
        className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-500"
      >
        Try Again
      </button>
    </main>
  );
}