import { NextResponse } from "next/server";
import { getSourceBreakdown } from "@/lib/data/server";

export async function GET() {
  try {
    const breakdown = await getSourceBreakdown();
    return NextResponse.json(breakdown);
  } catch (error) {
    console.error("Error fetching source breakdown:", error);
    return NextResponse.json(
      { error: "Failed to fetch source breakdown" },
      { status: 500 }
    );
  }
}

