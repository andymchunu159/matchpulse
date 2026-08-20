import { NextResponse } from "next/server";
import { z } from "zod";

import {
  generatePrediction,
} from "@/lib/predictions/gemini";

import {
  getCachedPrediction,
  cachePrediction,
} from "@/lib/predictions/cache";

import { createClient } from "@/lib/supabase/server-auth";

const predictionRequestSchema = z.object({
  homeTeam: z.string().trim().min(1),
  awayTeam: z.string().trim().min(1),
  competition: z.string().trim().min(1),
  fixtureDate: z.string().trim().min(1),
});

function isServiceUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("503") ||
    message.includes("unavailable") ||
    message.includes("high demand") ||
    message.includes("service unavailable")
  );
}

export async function POST(request: Request) {
  try {
    // --------------------------------------------------------
    // 0. REQUIRE AUTHENTICATED USER
    // --------------------------------------------------------

    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required.",
          message:
            "You must be logged in to access MatchPulse predictions.",
        },
        {
          status: 401,
        },
      );
    }

    // --------------------------------------------------------
    // 1. VALIDATE REQUEST
    // --------------------------------------------------------

    const body = await request.json();

    const parsedRequest =
      predictionRequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid prediction request.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      homeTeam,
      awayTeam,
      competition,
      fixtureDate,
    } = parsedRequest.data;

    // --------------------------------------------------------
    // 2. CHECK SUPABASE PREDICTION CACHE
    // --------------------------------------------------------

    const cachedPrediction =
      await getCachedPrediction(
        homeTeam,
        awayTeam,
        competition,
        fixtureDate,
      );

    if (cachedPrediction) {
      return NextResponse.json(
        {
          success: true,
          prediction: cachedPrediction,
          cached: true,
        },
        {
          status: 200,
        },
      );
    }

    // --------------------------------------------------------
    // 3. GENERATE FRESH PREDICTION
    // --------------------------------------------------------

    const prediction = await generatePrediction({
      homeTeam,
      awayTeam,
      competition,
      fixtureDate,
    });

    // --------------------------------------------------------
    // 4. SAVE PREDICTION TO SUPABASE CACHE
    // --------------------------------------------------------

    await cachePrediction(
      homeTeam,
      awayTeam,
      competition,
      fixtureDate,
      prediction,
    );

    // --------------------------------------------------------
    // 5. RETURN FRESH PREDICTION
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        prediction,
        cached: false,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "Prediction API error:",
      error,
    );

    // --------------------------------------------------------
    // GEMINI / AI SERVICE UNAVAILABLE
    // --------------------------------------------------------

    if (isServiceUnavailableError(error)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Prediction service temporarily unavailable.",
          message:
            "Our prediction engine is currently experiencing high demand. Please try again shortly.",
        },
        {
          status: 503,
        },
      );
    }

    // --------------------------------------------------------
    // GENERAL ERROR
    // --------------------------------------------------------

    return NextResponse.json(
      {
        success: false,
        error:
          "Prediction service unavailable.",
        message:
          "We were unable to generate a prediction right now. Please try again shortly.",
      },
      {
        status: 500,
      },
    );
  }
}