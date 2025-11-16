import { NextResponse } from "next/server";
import { getMentions } from "@/lib/data/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const query = searchParams.get("q") || "";
    const channel = searchParams.get("channel") || undefined;
    const sentiment = searchParams.get("sentiment") || undefined;
    const author = searchParams.get("author") || undefined;
    const topic = searchParams.get("topic") || undefined;

    const mentions = await getMentions(limit, {
      q: query || undefined,
      channel,
      sentiment,
      author,
      topic,
    });

    return NextResponse.json(mentions);
  } catch (error) {
    console.error("Error fetching mentions:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentions" },
      { status: 500 }
    );
  }
}

