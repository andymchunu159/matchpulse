import { supabaseServer } from "@/lib/supabase/server";

import {
  predictionSchema,
  type Prediction,
} from "./types";

const CACHE_TTL_HOURS = 24;

function buildCacheKey(
  homeTeam: string,
  awayTeam: string,
  competition: string,
  fixtureDate: string,
): string {
  return [
    homeTeam,
    awayTeam,
    competition,
    fixtureDate,
  ]
    .map((value) => value.trim().toLowerCase())
    .join(":");
}

export async function getCachedPrediction(
  homeTeam: string,
  awayTeam: string,
  competition: string,
  fixtureDate: string,
): Promise<Prediction | null> {
  const cacheKey = buildCacheKey(
    homeTeam,
    awayTeam,
    competition,
    fixtureDate,
  );

  const { data, error } = await supabaseServer
    .from("prediction_cache")
    .select("prediction, expires_at")
    .eq("cache_key", cacheKey)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("Prediction cache lookup failed:", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const parsedPrediction = predictionSchema.safeParse(
    data.prediction,
  );

  if (!parsedPrediction.success) {
    console.error(
      "Invalid cached prediction detected:",
      parsedPrediction.error.flatten(),
    );

    return null;
  }

  return parsedPrediction.data;
}

export async function cachePrediction(
  homeTeam: string,
  awayTeam: string,
  competition: string,
  fixtureDate: string,
  prediction: Prediction,
): Promise<void> {
  const cacheKey = buildCacheKey(
    homeTeam,
    awayTeam,
    competition,
    fixtureDate,
  );

  const now = new Date();

  const expiresAt = new Date(
    now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000,
  );

  const { error } = await supabaseServer
    .from("prediction_cache")
    .upsert(
      {
        cache_key: cacheKey,
        home_team: homeTeam,
        away_team: awayTeam,
        competition,
        fixture_date: fixtureDate,
        prediction,
        created_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      },
      {
        onConflict: "cache_key",
      },
    );

  if (error) {
    console.error("Prediction cache save failed:", error);
  }
}