import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "TAVILY_API_KEY is not configured.",
      },
      { status: 500 },
    );
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        query:
          "Liverpool vs Arsenal latest team news injuries suspensions recent form expected lineups Premier League",
        search_depth: "advanced",
        topic: "general",
        max_results: 8,
        include_answer: true,
        include_raw_content: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Tavily request failed.",
          details: data,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Tavily test error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected Tavily error.",
      },
      { status: 500 },
    );
  }
}