"use client";

interface Props {
  error: Error;
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: Props) {
  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-white">
        Something went wrong
      </h1>

      <p className="max-w-md text-zinc-400">
        We couldn't load the match details.
        Please try again.
      </p>

      {process.env.NODE_ENV === "development" && (
        <pre className="max-w-2xl overflow-auto rounded-lg bg-zinc-900 p-4 text-left text-xs text-red-400">
          {error.message}
        </pre>
      )}

      <button
        onClick={reset}
        className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white transition hover:bg-green-500"
      >
        Try Again
      </button>
    </main>
  );
}