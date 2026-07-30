"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

interface Props {
  selectedDate: string;
  basePath?: string;
}

export default function DateStrip({
  selectedDate,
  basePath = "/fixtures",
}: Props) {
  const router = useRouter();

  const days = useMemo(() => {
    const center = new Date(selectedDate);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(center);
      date.setDate(center.getDate() - 3 + index);
      return date;
    });
  }, [selectedDate]);

  const todayISO = new Date().toISOString().split("T")[0];

  return (
    <div className="relative">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#07140d] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#07140d] to-transparent" />

      <div className="flex gap-3 overflow-x-auto py-2 scrollbar-none">
        {days.map((date) => {
          const iso = date.toISOString().split("T")[0];

          const active = iso === selectedDate;
          const today = iso === todayISO;

          return (
            <button
              key={iso}
              onClick={() =>
                router.push(`${basePath}?date=${iso}`)
              }
              className={`group relative min-w-[92px] overflow-hidden rounded-2xl border transition-all duration-300
              ${
                active
                  ? "scale-105 border-green-500/70 bg-gradient-to-b from-green-500 to-emerald-600 shadow-[0_0_30px_rgba(34,197,94,0.35)]"
                  : "border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/10"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-0 h-1 w-full bg-white/70" />
              )}

              <div className="px-4 py-4">
                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    active ? "text-green-50" : "text-zinc-400"
                  }`}
                >
                  {today
                    ? "TODAY"
                    : date.toLocaleDateString(undefined, {
                        weekday: "short",
                      })}
                </p>

                <h2
                  className={`mt-2 text-3xl font-black leading-none ${
                    active ? "text-white" : "text-zinc-100"
                  }`}
                >
                  {date.getDate()}
                </h2>

                <p
                  className={`mt-2 text-sm ${
                    active ? "text-green-100" : "text-zinc-500"
                  }`}
                >
                  {date.toLocaleDateString(undefined, {
                    month: "short",
                  })}
                </p>
              </div>

              {!active && (
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}