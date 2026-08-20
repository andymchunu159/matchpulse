import Link from "next/link";
import { redirect } from "next/navigation";

import FixturesHeaderForPredictions from "@/components/fixtures/FixturesHeaderForPredictions";
import DateStripForPredictions from "@/components/fixtures/DateStripForPredictions";

import { getUpcomingFixtures } from "@/lib/football-server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface Props {
  searchParams: Promise<{
    date?: string;
  }>;
}

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

export default async function PredictionsPage({
  searchParams,
}: Props) {
  // ============================================================
  // AUTHENTICATION
  // ============================================================

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
    redirect("/login?redirect=/predictions");
  }

  // ============================================================
  // DATE LOGIC
  // ============================================================

  const params = await searchParams;

  const today = getTodayISO();

  /*
   * ==========================================================
   * DATE RESTRICTION
   * ==========================================================
   *
   * Predictions can only be viewed for:
   *
   * Today
   * Future dates
   *
   * Past dates are automatically reset to Today.
   */
  const requestedDate = params.date;

  const selectedDate =
    requestedDate && requestedDate >= today
      ? requestedDate
      : today;

  /*
   * ==========================================================
   * UPCOMING FIXTURES ONLY
   * ==========================================================
   *
   * getUpcomingFixtures() filters the API response to:
   *
   * NS = Not Started
   *
   * Therefore:
   *
   * FT / HT / 1H / 2H / AET / PEN / LIVE / etc.
   * never reach the UI.
   */
  const upcomingFixtures =
    await getUpcomingFixtures(selectedDate);

  return (
    <main className="container mx-auto space-y-6 py-8">

      {/* ======================================================
          Predictions Header
          ====================================================== */}

      <FixturesHeaderForPredictions
        date={selectedDate}
        basePath="/predictions"
      />

      {/* ======================================================
          Date Strip
          ====================================================== */}

      <DateStripForPredictions
        selectedDate={selectedDate}
        basePath="/predictions"
        minDate={today}
      />

      {/* ======================================================
          Prediction Fixtures
          ====================================================== */}

      {upcomingFixtures.length === 0 ? (
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-zinc-400">
            There are no upcoming fixtures available
            for AI prediction on this date.
          </p>
        </section>
      ) : (
        <section className="space-y-4">

          {/* Section Heading */}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                AI Predictions
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Upcoming fixtures only
              </p>
            </div>

            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
              {upcomingFixtures.length}{" "}
              {upcomingFixtures.length === 1
                ? "Fixture"
                : "Fixtures"}
            </span>
          </div>

          {/* Fixture Cards */}

          <div className="grid gap-4">
            {upcomingFixtures.map((fixture) => (
              <Link
                key={fixture.fixture.id}
                href={`/predictions/${fixture.fixture.id}`}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-300 hover:border-green-500 hover:bg-zinc-800"
              >
                {/* Competition */}

                <div className="flex items-center gap-3">
                  {fixture.league.logo && (
                    <img
                      src={fixture.league.logo}
                      alt={fixture.league.name}
                      className="h-8 w-8 object-contain"
                    />
                  )}

                  <div>
                    <p className="font-semibold text-white">
                      {fixture.league.name}
                    </p>

                    <p className="text-sm text-zinc-500">
                      {fixture.league.country}
                    </p>
                  </div>
                </div>

                {/* Teams */}

                <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4">

                  {/* Home */}

                  <div className="flex items-center gap-3">
                    {fixture.teams.home.logo && (
                      <img
                        src={fixture.teams.home.logo}
                        alt={fixture.teams.home.name}
                        className="h-10 w-10 object-contain"
                      />
                    )}

                    <span className="font-semibold text-white">
                      {fixture.teams.home.name}
                    </span>
                  </div>

                  {/* VS */}

                  <div className="text-center">
                    <span className="text-sm font-bold text-zinc-500">
                      VS
                    </span>

                    <p className="mt-1 text-xs text-zinc-600">
                      {new Date(
                        fixture.fixture.date,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Away */}

                  <div className="flex items-center justify-end gap-3">
                    <span className="text-right font-semibold text-white">
                      {fixture.teams.away.name}
                    </span>

                    {fixture.teams.away.logo && (
                      <img
                        src={fixture.teams.away.logo}
                        alt={fixture.teams.away.name}
                        className="h-10 w-10 object-contain"
                      />
                    )}
                  </div>

                </div>

                {/* Footer */}

                <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-green-400">
                      Upcoming
                    </span>

                    <span className="text-sm text-zinc-500">
                      AI Prediction Available
                    </span>
                  </div>

                  <span className="font-semibold text-green-400 transition group-hover:text-green-300">
                    🔮 View Prediction →
                  </span>

                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}