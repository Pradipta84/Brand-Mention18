import { NextResponse } from "next/server";
import { processCompetitorUpdate } from "@/lib/competitor/processor";
import { classifyUpdateType, assessImpact } from "@/lib/competitor/classifier";
import { Channel } from "@/generated/prisma/client";

interface IngestRequest {
  competitorName: string;
  competitorWebsite?: string;
  title: string;
  description: string;
  sourceUrl?: string;
  channel: string;
  publishedAt: string;
  type?: string;
  impact?: string;
}

export async function POST(request: Request) {
  try {
    const body: IngestRequest = await request.json();

    // Validate required fields
    if (!body.competitorName || !body.title || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields: competitorName, title, description" },
        { status: 400 }
      );
    }

    // Map channel string to enum
    const channelMap: Record<string, Channel> = {
      twitter: Channel.TWITTER,
      reddit: Channel.REDDIT,
      news: Channel.NEWS,
      blog: Channel.BLOG,
      youtube: Channel.YOUTUBE,
      forum: Channel.FORUM,
    };

    const channel = channelMap[body.channel?.toLowerCase()] || Channel.NEWS;

    // Classify update type if not provided
    const type = body.type
      ? (body.type.toUpperCase() as any)
      : classifyUpdateType(body.title, body.description);

    // Assess impact if not provided
    const impact = body.impact
      ? (body.impact.toUpperCase() as any)
      : assessImpact(body.title, body.description, type);

    // Process the competitor update
    await processCompetitorUpdate({
      competitorName: body.competitorName,
      competitorWebsite: body.competitorWebsite,
      type,
      title: body.title,
      description: body.description,
      sourceUrl: body.sourceUrl,
      sourceChannel: channel,
      publishedAt: new Date(body.publishedAt),
      impact,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error ingesting competitor update:", error);
    return NextResponse.json(
      { error: "Failed to ingest competitor update" },
      { status: 500 }
    );
  }
}

