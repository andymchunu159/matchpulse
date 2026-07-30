import { NextResponse } from "next/server";
import { footballFetch } from "@/lib/football";

export async function GET() {
  try {
    const data = await footballFetch("/fixtures?live=all");

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Unable to fetch live matches." },
      { status: 500 }
    );
  }
}