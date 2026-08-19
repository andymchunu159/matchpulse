import { z } from "zod";

/**
 * Probability value between 0 and 100.
 *
 * Gemini may occasionally return numeric values as strings,
 * so we coerce them safely before validation.
 */
const probability = z.coerce
  .number()
  .min(0)
  .max(100);

/**
 * Prediction result schema returned by Gemini.
 */
export const predictionSchema = z.object({
  match: z.object({
    homeTeam: z.string().trim().min(1),
    awayTeam: z.string().trim().min(1),
    competition: z.string().trim().min(1),
    fixtureDate: z.string().trim().min(1),
  }),

  prediction: z.object({
    homeWin: probability,
    draw: probability,
    awayWin: probability,

    over15: probability,
    over25: probability,
    over35: probability,

    bttsYes: probability,
    bttsNo: probability,

    mostLikelyScore: z.string().trim().min(1),

    doubleChance: z.enum([
      "1X",
      "X2",
      "12",
    ]),

    confidence: z.coerce
      .number()
      .min(0)
      .max(100),
  }),

  analysis: z.string().trim().min(1),

  keyFactors: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(10),

  risks: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(10),
});

export type Prediction = z.infer<typeof predictionSchema>;