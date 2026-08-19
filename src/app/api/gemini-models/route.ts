import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "GEMINI_API_KEY is not configured.",
      },
      { status: 500 },
    );
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
    });

    const models = await ai.models.list();

    const availableModels = [];

    for await (const model of models) {
availableModels.push({
  name: model.name ?? null,
  displayName: model.displayName ?? null,
  supportedActions: model.supportedActions ?? [],
});
    }

    return NextResponse.json({
      success: true,
      count: availableModels.length,
      models: availableModels,
    });
  } catch (error) {
    console.error("Gemini models error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve Gemini models.",
      },
      { status: 500 },
    );
  }
}