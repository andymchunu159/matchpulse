"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  date: string;
}

export default function FixturesHeader({ date }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function navigateToDate(value: string) {
    router.push(`/fixtures?date=${value}`);
  }

  function changeDate(days: number) {
    const current = new Date(date);
    current.setDate(current.getDate() + days);

    navigateToDate(current.toISOString().split("T")[0]);
  }

  function goToday() {
    navigateToDate(new Date().toISOString().split("T")[0]);
  }

  function openCalendar() {
    if (!inputRef.current) return;

    const input = inputRef.current as HTMLInputElement & {
      showPicker?: () => void;
    };

    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  }

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Hidden Native Date Picker */}
      <input
        ref={inputRef}
        type="date"
        value={date}
        onChange={(e) => navigateToDate(e.target.value)}
        className="fixed left-0 top-0 h-0 w-0 opacity-0 pointer-events-none"
      />

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 p-6">

        {/* Glow */}
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative flex items-start justify-between">

          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Fixtures
            </h1>

            <p className="mt-2 text-zinc-400">
              {formattedDate}
            </p>
          </div>

          <button
            type="button"
            onClick={openCalendar}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:scale-105 hover:border-green-500 hover:bg-green-500/10"
          >
            <CalendarDays
              size={22}
              className="text-green-400"
            />
          </button>
        </div>

        <div className="relative mt-8 flex items-center justify-between">

          <button
            type="button"
            onClick={() => changeDate(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:scale-110 hover:border-green-500 hover:bg-green-500/10"
          >
            <ChevronLeft
              size={22}
              className="text-white"
            />
          </button>

          <button
            type="button"
            onClick={goToday}
            className="rounded-full bg-green-600 px-8 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:scale-105 hover:bg-green-500"
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => changeDate(1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:scale-110 hover:border-green-500 hover:bg-green-500/10"
          >
            <ChevronRight
              size={22}
              className="text-white"
            />
          </button>
        </div>

        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
      </section>
    </>
  );
}