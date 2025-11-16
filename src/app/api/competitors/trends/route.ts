import { NextResponse } from "next/server";
import { detectTrends } from "@/lib/competitor/trend-detector";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const trends = await detectTrends(days);

    return NextResponse.json(trends);
  } catch (error) {
    console.error("Error detecting trends:", error);
    return NextResponse.json(
      { error: "Failed to detect trends" },
      { status: 500 }
    );
  }
}

