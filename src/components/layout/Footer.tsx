import Link from "next/link";
import MatchPulseLogo from "@/components/ui/match-pulse-logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-zinc-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">

          <div className="space-y-6">
            <Link href="/" className="group flex items-center gap-4">
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

            <p className="max-w-sm text-sm font-medium leading-7 text-zinc-400">
              Live scores, statistics, standings, predictions, and AI-powered football insights for fans around the world.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">Football</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/live" className="group relative rounded-lg px-2 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/5 hover:text-white">
                Live Scores
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-green-500 transition-all duration-300 group-hover:w-8" />
              </Link>
              <Link href="/fixtures" className="group relative rounded-lg px-2 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/5 hover:text-white">
                Fixtures
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-green-500 transition-all duration-300 group-hover:w-8" />
              </Link>
              <Link href="/results" className="group relative rounded-lg px-2 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/5 hover:text-white">
                Results
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-green-500 transition-all duration-300 group-hover:w-8" />
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">Community</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/predictions" className="group relative rounded-lg px-2 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/5 hover:text-white">
                Predictions
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-green-500 transition-all duration-300 group-hover:w-8" />
              </Link>
              <Link href="/" className="group relative rounded-lg px-2 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/5 hover:text-white">
                Fan Votes
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-green-500 transition-all duration-300 group-hover:w-8" />
              </Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">Legal</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="group relative rounded-lg px-2 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/5 hover:text-white">
                Privacy
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-green-500 transition-all duration-300 group-hover:w-8" />
              </Link>
              <Link href="/" className="group relative rounded-lg px-2 py-2 text-sm font-medium text-zinc-300 transition-all duration-300 hover:bg-white/5 hover:text-white">
                Terms
                <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-green-500 transition-all duration-300 group-hover:w-8" />
              </Link>
            </nav>
          </div>

        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm font-medium text-zinc-500 md:flex-row">
          <p>© {new Date().getFullYear()} <span className="font-semibold text-zinc-300">MatchPulse</span>. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow shadow-green-500" />
              Live Football Intelligence
            </span>

            <span className="hidden text-zinc-600 md:block">•</span>

            <span className="hidden md:block text-zinc-300">V1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
