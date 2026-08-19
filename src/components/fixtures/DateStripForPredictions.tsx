"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

interface Props {
  selectedDate: string;
  basePath?: string;
  minDate?: string;
}

/**
 * Convert a Date object to a local YYYY-MM-DD string.
 *
 * Do NOT use toISOString() here because that converts
 * the date to UTC and can shift the displayed day.
 */
function formatLocalDate(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayISO() {
  return formatLocalDate(new Date());
}

export default function DateStrip({
  selectedDate,
  basePath = "/fixtures",
  minDate,
}: Props) {
  const router = useRouter();

  const todayISO = getTodayISO();

  /**
   * Previous dates are disabled.
   *
   * Today and future dates remain selectable.
   */
  const minimumDate = minDate ?? todayISO;

  const days = useMemo(() => {
    /**
     * Parse YYYY-MM-DD as a LOCAL date.
     *
     * Adding T00:00:00 prevents the browser from
     * interpreting the date as UTC.
     */
    const center = new Date(
      `${selectedDate}T00:00:00`
    );

    return Array.from(
      { length: 7 },
      (_, index) => {
        const date = new Date(center);

        date.setDate(
          center.getDate() - 3 + index
        );

        return date;
      }
    );
  }, [selectedDate]);

  return (
    <div className="relative">
      {/* ====================================================
          Fade Edges
          ==================================================== */}

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#07140d] to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#07140d] to-transparent" />

      {/* ====================================================
          Date Strip
          ==================================================== */}

      <div className="flex gap-3 overflow-x-auto py-2 scrollbar-none">
        {days.map((date) => {
          /**
           * IMPORTANT:
           * Use local date formatting instead of
           * date.toISOString().
           */
          const iso = formatLocalDate(date);

          const active =
            iso === selectedDate;

          const today =
            iso === todayISO;

          /**
           * Previous dates are disabled.
           *
           * Today is NOT disabled.
           */
          const disabled =
            iso < minimumDate;

          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (disabled) return;

                router.push(
                  `${basePath}?date=${iso}`
                );
              }}
              className={`group relative min-w-[92px] overflow-hidden rounded-2xl border transition-all duration-300 ${
                disabled
                  ? "cursor-not-allowed border-white/5 bg-white/[0.02] opacity-30"
                  : active
                    ? "scale-105 border-green-500/70 bg-gradient-to-b from-green-500 to-emerald-600 shadow-[0_0_30px_rgba(34,197,94,0.35)]"
                    : "border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-1 hover:border-green-500/40 hover:bg-white/10"
              }`}
            >
              {/* ==================================================
                  Active Indicator
                  ================================================== */}

              {active && !disabled && (
                <div className="absolute left-0 top-0 h-1 w-full bg-white/70" />
              )}

              <div className="px-4 py-4">
                {/* ==================================================
                    Weekday
                    ================================================== */}

                <p
                  className={`text-xs font-semibold uppercase tracking-widest ${
                    active
                      ? "text-green-50"
                      : disabled
                        ? "text-zinc-700"
                        : "text-zinc-400"
                  }`}
                >
                  {today
                    ? "TODAY"
                    : date.toLocaleDateString(
                        undefined,
                        {
                          weekday: "short",
                        }
                      )}
                </p>

                {/* ==================================================
                    Day
                    ================================================== */}

                <h2
                  className={`mt-2 text-3xl font-black leading-none ${
                    active
                      ? "text-white"
                      : disabled
                        ? "text-zinc-700"
                        : "text-zinc-100"
                  }`}
                >
                  {date.getDate()}
                </h2>

                {/* ==================================================
                    Month
                    ================================================== */}

                <p
                  className={`mt-2 text-sm ${
                    active
                      ? "text-green-100"
                      : disabled
                        ? "text-zinc-700"
                        : "text-zinc-500"
                  }`}
                >
                  {date.toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                    }
                  )}
                </p>
              </div>

              {/* ==================================================
                  Hover Indicator
                  ================================================== */}

              {!active && !disabled && (
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}