import { NextResponse } from "next/server";
import { z } from "zod";

import {
  generatePrediction,
} from "@/lib/predictions/gemini";

import {
  getCachedPrediction,
  cachePrediction,
} from "@/lib/predictions/cache";

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
    const body = await request.json();

    const parsedRequest = predictionRequestSchema.safeParse(body);

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
    // 1. Check Supabase prediction cache
    // --------------------------------------------------------

    const cachedPrediction = await getCachedPrediction(
      homeTeam,
      awayTeam,
      competition,
      fixtureDate,
    );

    if (cachedPrediction) {
      console.log(
        `Prediction cache HIT: ${homeTeam} vs ${awayTeam}`,
      );

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

    console.log(
      `Prediction cache MISS: ${homeTeam} vs ${awayTeam}`,
    );

    // --------------------------------------------------------
    // 2. Generate fresh prediction
    // --------------------------------------------------------

    const prediction = await generatePrediction({
      homeTeam,
      awayTeam,
      competition,
      fixtureDate,
    });

    // --------------------------------------------------------
    // 3. Save prediction to Supabase cache
    // --------------------------------------------------------

    await cachePrediction(
      homeTeam,
      awayTeam,
      competition,
      fixtureDate,
      prediction,
    );

    // --------------------------------------------------------
    // 4. Return fresh prediction
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
    console.error("Prediction API error:", error);

    if (isServiceUnavailableError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: "Prediction service temporarily unavailable.",
          message:
            "Our prediction engine is currently experiencing high demand. Please try again shortly.",
        },
        {
          status: 503,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Prediction service unavailable.",
        message:
          "We were unable to generate a prediction right now. Please try again shortly.",
      },
      {
        status: 500,
      },
    );
  }
}