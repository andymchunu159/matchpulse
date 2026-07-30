"use client";

import { ReactNode } from "react";
import { CalendarDays } from "lucide-react";

interface Props {
  leagueName?: string;
  season?: number;
  children?: ReactNode;
}

export default function StandingsHeader({
  leagueName = "Premier League",
  season = 2024,
  children,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 p-6">
      {/* Background Glow */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

      <div className="relative space-y-8">
        {/* Hero */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left */}
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white">
              {leagueName}
            </h1>

            <p className="mt-2 text-zinc-400">
              Current league standings
            </p>
          </div>

          {/* Season Card */}
          <div className="self-start rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center gap-2 text-green-400">
              <CalendarDays size={18} />

              <span className="text-sm font-semibold">
                Season
              </span>
            </div>

            <p className="mt-2 text-center text-3xl font-black text-white">
              {season}
            </p>
          </div>
        </div>

        {/* Controls */}
        {children && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              {children}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />
      </div>
    </section>
  );
}