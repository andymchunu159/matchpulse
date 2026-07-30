"use client";

export default function Error() {
  return (
    <main className="container mx-auto py-8">
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center">
        <h2 className="text-2xl font-bold text-red-400">
          Unable to load team.
        </h2>

        <p className="mt-3 text-zinc-400">
          Please try again later.
        </p>
      </div>
    </main>
  );
}