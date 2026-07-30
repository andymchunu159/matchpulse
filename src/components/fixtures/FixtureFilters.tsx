"use client";

export type FixtureFilter =
  | "all"
  | "live"
  | "upcoming"
  | "finished";

interface Props {
  value: FixtureFilter;
  onChange: (filter: FixtureFilter) => void;
}

const filters: {
  label: string;
  value: FixtureFilter;
}[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Live",
    value: "live",
  },
  {
    label: "Upcoming",
    value: "upcoming",
  },
  {
    label: "Finished",
    value: "finished",
  },
];

export default function FixtureFilters({
  value,
  onChange,
}: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`rounded-full px-4 py-2 whitespace-nowrap transition ${
            value === filter.value
              ? "bg-green-600 text-white"
              : "bg-zinc-900 hover:bg-zinc-800"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}