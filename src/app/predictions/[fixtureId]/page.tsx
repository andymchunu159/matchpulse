import { notFound, redirect } from "next/navigation";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import PredictionDetails from "@/components/predictions/PredictionDetails";
import { getMatchDetails } from "@/lib/match-details";

interface Props {
  params: Promise<{
    fixtureId: string;
  }>;
}

export default async function PredictionPage({
  params,
}: Props) {
  // ============================================================
  // AUTHENTICATION
  // ============================================================

  const { fixtureId } = await params;

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Cookie writes may not be available in some
            // Server Component contexts.
            // Proxy handles session refreshes.
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?redirect=/predictions/${fixtureId}`,
    );
  }

  // ============================================================
  // MATCH DATA
  // ============================================================

  const match = await getMatchDetails(fixtureId);

  if (!match) {
    notFound();
  }

  const fixture = match.fixture;

  const matchDate = new Date(
    fixture.fixture.date,
  );

  const formattedDate = matchDate.toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  const formattedTime = matchDate.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07140d]">

      {/* ====================================================
          Ambient Background
          ==================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[120px]" />

        <div className="absolute -left-40 top-[35%] h-[320px] w-[320px] rounded-full bg-emerald-500/5 blur-[100px]" />

        <div className="absolute -right-40 top-[55%] h-[320px] w-[320px] rounded-full bg-green-500/5 blur-[100px]" />

      </div>

      {/* ====================================================
          Content
          ==================================================== */}

      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ==================================================
            Top Navigation / Context
            ================================================== */}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
              AI Prediction Center
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5">

            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

            <span className="text-xs font-semibold uppercase tracking-wider text-green-400">
              AI Analysis
            </span>

          </div>

        </div>

        {/* ==================================================
            Match Hero
            ================================================== */}

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/30 shadow-2xl shadow-black/20">

          {/* Hero glow */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

          <div className="relative p-6 sm:p-8">

            {/* Competition */}

            <div className="flex flex-col items-center text-center">

              <div className="flex items-center gap-3">

                {fixture.league?.logo && (
                  <img
                    src={fixture.league.logo}
                    alt={fixture.league.name}
                    className="h-9 w-9 object-contain"
                  />
                )}

                <div>
                  <p className="font-semibold text-white">
                    {fixture.league?.name}
                  </p>

                  <p className="text-xs text-zinc-500">
                    {fixture.league?.country}
                  </p>
                </div>

              </div>

              {/* Date */}

              <div className="mt-5">

                <p className="text-sm font-medium text-zinc-400">
                  {formattedDate}
                </p>

                <p className="mt-1 text-2xl font-black tracking-tight text-white">
                  {formattedTime}
                </p>

              </div>

            </div>

            {/* ==================================================
                Teams
                ================================================== */}

            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">

              {/* Home */}

              <div className="flex flex-col items-center text-center">

                {fixture.teams?.home?.logo && (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl sm:h-24 sm:w-24">

                    <img
                      src={fixture.teams.home.logo}
                      alt={fixture.teams.home.name}
                      className="h-full w-full object-contain"
                    />

                  </div>
                )}

                <h2 className="mt-4 text-lg font-bold text-white sm:text-xl">
                  {fixture.teams.home.name}
                </h2>

                <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-green-400">
                  Home
                </span>

              </div>

              {/* VS */}

              <div className="flex flex-col items-center">

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10">

                  <span className="text-sm font-black text-green-400">
                    VS
                  </span>

                </div>

                <span className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  Prediction
                </span>

              </div>

              {/* Away */}

              <div className="flex flex-col items-center text-center">

                {fixture.teams?.away?.logo && (
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 shadow-xl sm:h-24 sm:w-24">

                    <img
                      src={fixture.teams.away.logo}
                      alt={fixture.teams.away.name}
                      className="h-full w-full object-contain"
                    />

                  </div>
                )}

                <h2 className="mt-4 text-lg font-bold text-white sm:text-xl">
                  {fixture.teams.away.name}
                </h2>

                <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-green-400">
                  Away
                </span>

              </div>

            </div>

            {/* Divider */}

            <div className="mt-8 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

            {/* Status */}

            <div className="mt-5 flex justify-center">

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">

                <span className="h-2 w-2 rounded-full bg-green-400" />

                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Prediction Available
                </span>

              </div>

            </div>

          </div>
        </section>

        {/* ==================================================
            Prediction Engine
            ================================================== */}

        <section className="mt-6">

          <div className="mb-4 flex items-end justify-between">

            <div>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                AI Match Prediction
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Data-driven analysis generated for this fixture.
              </p>

            </div>

          </div>

          <PredictionDetails
            fixture={match.fixture}
          />

        </section>

      </div>
    </main>
  );
}