"use client";

import Link from "next/link";
import { Menu, Bell, Search } from "lucide-react";
import { NAV_ITEMS } from "@/constants/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import MatchPulseLogo from "@/components/ui/match-pulse-logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
{/* Logo */}
<Link
  href="/"
  className="group flex items-center gap-4"
>
  <MatchPulseLogo />

  <div className="space-y-1">

    <h1 className="text-2xl font-black tracking-[-0.05em] text-white transition-colors duration-300 group-hover:text-zinc-100">
      Match<span className="text-green-400">Pulse</span>
    </h1>

    <p className="text-[11px] font-medium tracking-[0.28em] text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">
      Live Football Intelligence
    </p>

  </div>

</Link>
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              {item.title}

              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-green-500 transition-all duration-300 group-hover:w-8" />
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden items-center gap-2 md:flex">

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-green-500 ring-2 ring-zinc-950" />
          </Button>

          <Button className="ml-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 font-semibold text-white shadow-lg shadow-green-500/25 transition-all duration-300 hover:scale-105 hover:from-green-400 hover:to-emerald-500 hover:shadow-green-500/50">
            Login
          </Button>
        </div>

        {/* Mobile */}
        <Sheet>
<SheetTrigger
  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition-all hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400 md:hidden"
>
  <Menu className="h-6 w-6" />
</SheetTrigger>

          <SheetContent
            side="left"
            className="border-r border-white/10 bg-zinc-950 text-white"
          >
            <div className="mt-6 flex items-center gap-3 border-b border-white/10 pb-6">

              <MatchPulseLogo className="h-10 w-10" />

              <div>
                <h2 className="font-bold">MatchPulse</h2>

                <p className="text-xs text-green-400">
                  Live Football Intelligence
                </p>
              </div>

            </div>

            <nav className="mt-8 flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-base font-medium text-zinc-300 transition-all hover:bg-green-500/10 hover:text-green-400"
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            <div className="mt-10">
              <Button className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 font-semibold">
                Login
              </Button>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}