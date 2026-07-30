import { NextRequest, NextResponse } from "next/server";
import { footballFetch } from "@/lib/football";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await footballFetch(`/fixtures?id=${id}`);

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Unable to load fixture." },
      { status: 500 }
    );
  }
}
