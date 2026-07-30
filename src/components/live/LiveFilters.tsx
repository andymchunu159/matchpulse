"use client";

const filters = [
  "All",
  "Live",
  "1H",
  "HT",
  "2H",
  "ET",
  "FT",
];

interface Props {
  selected: string;
  onChange: (filter: string) => void;
}

export default function LiveFilters({
  selected,
  onChange,
}: Props) {
  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {filters.map((filter) => {
        const active = selected === filter;

        return (
          <button
            key={filter}
            onClick={() => onChange(filter)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
              active
                ? "border-yellow-500 bg-yellow-500 text-zinc-950 shadow-lg shadow-yellow-500/20"
                : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-yellow-500 hover:text-yellow-400"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}