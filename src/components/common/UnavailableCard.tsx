"use client";

interface Props {
  title: string;
  description: string;
  buttonText: string;
  searchQuery: string;
}

export default function UnavailableCard({
  title,
  description,
  buttonText,
  searchQuery,
}: Props) {
  function handleSearch() {
    const url = `https://www.google.com/search?q=${encodeURIComponent(
      searchQuery
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900 px-8 py-16 text-center">
      <h2 className="text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
        {description}
      </p>

      <button
        onClick={handleSearch}
        className="mt-8 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500"
      >
        {buttonText}
      </button>
    </div>
  );
}