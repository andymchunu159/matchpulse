"use client";

import { useEffect, useState } from "react";
import type { FixtureResponse } from "@/lib/football-server";
import type { Prediction } from "@/lib/predictions/types";

interface Props {
  fixture: FixtureResponse;
}

interface PredictionResponse {
  success: boolean;
  prediction?: Prediction;
  cached?: boolean;
  error?: string;
  message?: string;
}

export default function PredictionDetails({
  fixture,
}: Props) {
  const [prediction, setPrediction] =
    useState<Prediction | null>(null);

  const [cached, setCached] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPrediction() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/predictions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              homeTeam: fixture.teams.home.name,
              awayTeam: fixture.teams.away.name,
              competition: fixture.league.name,
              fixtureDate: fixture.fixture.date,
            }),
          },
        );

        const data: PredictionResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ??
              data.error ??
              "Unable to load prediction.",
          );
        }

        if (cancelled) {
          return;
        }

        setPrediction(data.prediction ?? null);
        setCached(data.cached ?? false);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load prediction.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPrediction();

    return () => {
      cancelled = true;
    };
  }, [
    fixture.fixture.date,
    fixture.league.name,
    fixture.teams.home.name,
    fixture.teams.away.name,
  ]);

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-zinc-800" />
          <div className="h-24 rounded-lg bg-zinc-800" />
          <div className="h-32 rounded-lg bg-zinc-800" />
          <div className="h-40 rounded-lg bg-zinc-800" />
        </div>

        <p className="mt-5 text-center text-sm text-zinc-400">
          Analysing this fixture...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          Prediction unavailable
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {error}
        </p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-zinc-400">
          No prediction is currently available
          for this fixture.
        </p>
      </div>
    );
  }

  const result = prediction.prediction;

  return (
    <div className="space-y-6">

      {/* Match Header */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="text-center">
          <p className="text-sm text-zinc-400">
            {prediction.match.competition}
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white">
            {prediction.match.homeTeam}

            <span className="mx-3 text-zinc-500">
              vs
            </span>

            {prediction.match.awayTeam}
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            {new Date(
              prediction.match.fixtureDate,
            ).toLocaleString()}
          </p>
        </div>
      </section>

      {/* AI Prediction */}
      <section className="rounded-xl border border-green-900/50 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            AI Prediction
          </h2>

          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
            {cached ? "Cached" : "Fresh"}
          </span>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-400">
            Most likely score
          </p>

          <p className="mt-2 text-4xl font-bold text-white">
            {result.mostLikelyScore}
          </p>

          <p className="mt-4 text-sm text-zinc-400">
            Double Chance
          </p>

          <p className="mt-1 text-xl font-semibold text-green-400">
            {result.doubleChance}
          </p>
        </div>
      </section>

      {/* Match Result */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <h2 className="text-lg font-semibold text-white">
          Match Result
        </h2>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <ProbabilityCard
            label="Home Win"
            value={result.homeWin}
          />

          <ProbabilityCard
            label="Draw"
            value={result.draw}
          />

          <ProbabilityCard
            label="Away Win"
            value={result.awayWin}
          />
        </div>
      </section>

      {/* Goal Markets */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <h2 className="text-lg font-semibold text-white">
          Goal Markets
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <ProbabilityCard
            label="Over 1.5"
            value={result.over15}
          />

          <ProbabilityCard
            label="Over 2.5"
            value={result.over25}
          />

          <ProbabilityCard
            label="Over 3.5"
            value={result.over35}
          />
        </div>
      </section>

      {/* BTTS */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <h2 className="text-lg font-semibold text-white">
          Both Teams To Score
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <ProbabilityCard
            label="Yes"
            value={result.bttsYes}
          />

          <ProbabilityCard
            label="No"
            value={result.bttsNo}
          />
        </div>
      </section>

      {/* Confidence */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            AI Confidence
          </h2>

          <span className="text-2xl font-bold text-green-400">
            {result.confidence}%
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-green-500 transition-all"
            style={{
              width: `${Math.min(
                Math.max(result.confidence, 0),
                100,
              )}%`,
            }}
          />
        </div>
      </section>

      {/* Analysis */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <h2 className="text-lg font-semibold text-white">
          AI Analysis
        </h2>

        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-300">
          {prediction.analysis}
        </p>
      </section>

      {/* Key Factors */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <h2 className="text-lg font-semibold text-white">
          Key Factors
        </h2>

        <ul className="mt-4 space-y-3">
          {prediction.keyFactors.map(
            (factor, index) => (
              <li
                key={`${factor}-${index}`}
                className="rounded-lg bg-zinc-800/70 p-3 text-sm text-zinc-300"
              >
                {factor}
              </li>
            ),
          )}
        </ul>
      </section>

      {/* Risks */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <h2 className="text-lg font-semibold text-white">
          Prediction Risks
        </h2>

        <ul className="mt-4 space-y-3">
          {prediction.risks.map(
            (risk, index) => (
              <li
                key={`${risk}-${index}`}
                className="rounded-lg bg-zinc-800/70 p-3 text-sm text-zinc-300"
              >
                {risk}
              </li>
            ),
          )}
        </ul>
      </section>

    </div>
  );
}

interface ProbabilityCardProps {
  label: string;
  value: number;
}

function ProbabilityCard({
  label,
  value,
}: ProbabilityCardProps) {
  return (
    <div className="rounded-lg bg-zinc-800/70 p-4 text-center">
      <p className="text-xs text-zinc-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-white">
        {value}%
      </p>
    </div>
  );
}