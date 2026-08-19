"use client";

import { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  date: string;
  basePath?: string;
}

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function FixturesHeaderForPredictions({
  date,
  basePath = "/predictions",
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const todayISO = getTodayISO();

  // Never allow the Predictions module to display a past date.
  const effectiveDate =
    date < todayISO ? todayISO : date;

  function navigateToDate(value: string) {
    // Hard protection against navigating to a past date.
    if (value < todayISO) {
      value = todayISO;
    }

    router.push(`${basePath}?date=${value}`);
  }

  function changeDate(days: number) {
    const current = new Date(
      `${effectiveDate}T00:00:00`
    );

    current.setDate(current.getDate() + days);

    const nextDate = current
      .toISOString()
      .split("T")[0];

    // Never allow previous dates.
    if (nextDate < todayISO) {
      return;
    }

    navigateToDate(nextDate);
  }

  function goToday() {
    navigateToDate(todayISO);
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

  const formattedDate = new Date(
    `${effectiveDate}T00:00:00`
  ).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isToday = effectiveDate === todayISO;

  return (
    <>
      {/* ====================================================
          Hidden Native Date Picker
          ==================================================== */}

      <input
        ref={inputRef}
        type="date"
        value={effectiveDate}
        min={todayISO}
        onChange={(e) =>
          navigateToDate(e.target.value)
        }
        className="pointer-events-none fixed left-0 top-0 h-0 w-0 opacity-0"
      />

      {/* ====================================================
          Header
          ==================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 p-6">

        {/* Glow */}
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

        {/* Title */}
        <div className="relative flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              Predictions
            </h1>

            <p className="mt-2 text-zinc-400">
              {formattedDate}
            </p>
          </div>

          {/* Calendar */}
          <button
            type="button"
            onClick={openCalendar}
            aria-label="Select prediction date"
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:scale-105 hover:border-green-500 hover:bg-green-500/10"
          >
            <CalendarDays
              size={22}
              className="text-green-400"
            />
          </button>
        </div>

        {/* ==================================================
            Date Navigation
            ================================================== */}

        <div className="relative mt-8 flex items-center justify-between">

          {/* Previous Day */}
          <button
            type="button"
            onClick={() => changeDate(-1)}
            disabled={isToday}
            aria-label="Previous day"
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 ${
              isToday
                ? "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-30"
                : "border-white/10 bg-white/5 hover:scale-110 hover:border-green-500 hover:bg-green-500/10"
            }`}
          >
            <ChevronLeft
              size={22}
              className="text-white"
            />
          </button>

          {/* Today — ALWAYS GREEN */}
          <button
            type="button"
            onClick={goToday}
            className="rounded-full bg-green-600 px-8 py-3 font-semibold text-white shadow-lg shadow-green-600/20 transition-all duration-300 hover:scale-105 hover:bg-green-500"
          >
            Today
          </button>

          {/* Next Day */}
          <button
            type="button"
            onClick={() => changeDate(1)}
            aria-label="Next day"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:scale-110 hover:border-green-500 hover:bg-green-500/10"
          >
            <ChevronRight
              size={22}
              className="text-white"
            />
          </button>
        </div>

        {/* Divider */}
        <div className="mt-6 h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
      </section>
    </>
  );
}