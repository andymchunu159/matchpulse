export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">

      {/* Hero */}

      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-10 shadow-2xl md:p-16">

        {/* Background Glow */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="relative">

          <span className="inline-flex items-center rounded-full border border-green-400/30 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400 backdrop-blur">
            ⚽ Live Football Platform
          </span>

          <h1 className="mt-8 max-w-4xl bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-5xl font-black leading-tight text-transparent md:text-7xl">
            Football Live Scores,
            <br />
            Statistics &
            <br />
            Predictions
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-300">
            Follow every match with live scores,
            detailed statistics, standings,
            AI-powered predictions,
            lineups and fan reactions —
            all in one modern football platform.
          </p>

          {/* Hero Stats */}

          <div className="mt-12 flex flex-wrap gap-8">

            <div>
              <h2 className="text-3xl font-bold text-white">
                1000+
              </h2>

              <p className="text-sm text-zinc-400">
                Matches Daily
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">
                500+
              </h2>

              <p className="text-sm text-zinc-400">
                Competitions
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">
                24/7
              </h2>

              <p className="text-sm text-zinc-400">
                Live Updates
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="mt-20">

        <div className="mb-10">

          <h2 className="text-3xl font-bold text-white">
            Everything Football
          </h2>

          <p className="mt-2 text-zinc-400">
            Built for football fans, analysts and bettors.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {/* Card */}

          <div className="group rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-green-500/40 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-green-500/10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-2xl">
              ⚽
            </div>

            <h3 className="text-2xl font-bold text-white">
              Live Matches
            </h3>

            <p className="mt-4 leading-7 text-zinc-400">
              Track every football match
              in real time with minute-by-minute
              updates and live events.
            </p>

          </div>

          {/* Card */}

          <div className="group rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-green-500/40 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-green-500/10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-2xl">
              📈
            </div>

            <h3 className="text-2xl font-bold text-white">
              Predictions
            </h3>

            <p className="mt-4 leading-7 text-zinc-400">
              View AI-assisted predictions,
              betting insights and probability
              analysis before kickoff.
            </p>

          </div>

          {/* Card */}

          <div className="group rounded-3xl border border-white/10 bg-zinc-900/70 p-8 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-green-500/40 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-green-500/10">

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-2xl">
              📊
            </div>

            <h3 className="text-2xl font-bold text-white">
              Statistics
            </h3>

            <p className="mt-4 leading-7 text-zinc-400">
              Explore standings, advanced
              match statistics and team
              performance across competitions.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}