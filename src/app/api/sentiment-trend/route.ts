import { NextRequest, NextResponse } from "next/server";
import { getSentimentTrend } from "@/lib/data/server";

export async function GET(request: NextRequest) {
  try {
    const series = await getSentimentTrend();
    return NextResponse.json(series);
  } catch (error) {
    console.error("Error fetching sentiment trend:", error);
    return NextResponse.json(
      { error: "Failed to fetch sentiment trend" },
      { status: 500 }
    );
  }
}

