import { NextResponse } from "next/server";
import { processMention } from "@/lib/ingestion/processor";
import { analyzeSentiment, extractTopics } from "@/lib/ingestion/sentiment";
import { checkAndCreateAlerts } from "@/lib/ingestion/spike-detector";
import { Channel, Sentiment } from "@/generated/prisma/client";

interface IngestRequest {
  sourceName: string;
  channel: string;
  sourceUrl?: string;
  author: string;
  handle?: string;
  body: string;
  permalink: string;
  publishedAt: string;
  reach?: number;
}

export async function POST(request: Request) {
  try {
    const body: IngestRequest = await request.json();

    // Validate required fields
    if (!body.sourceName || !body.channel || !body.author || !body.body || !body.permalink) {
      return NextResponse.json(
        { error: "Missing required fields" },
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

    const channel = channelMap[body.channel.toLowerCase()];
    if (!channel) {
      return NextResponse.json(
        { error: `Invalid channel: ${body.channel}` },
        { status: 400 }
      );
    }

    // Analyze sentiment
    const sentiment = await analyzeSentiment(body.body);

    // Extract topics
    const topics = extractTopics(body.body);

    // Process the mention
    await processMention({
      sourceName: body.sourceName,
      channel,
      sourceUrl: body.sourceUrl,
      author: body.author,
      handle: body.handle,
      body: body.body,
      permalink: body.permalink,
      publishedAt: new Date(body.publishedAt),
      reach: body.reach,
      sentiment: sentiment as Sentiment,
      topics,
    });

    // Check for spikes (async, don't wait)
    checkAndCreateAlerts().catch((err) => {
      console.error("Error checking spikes:", err);
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error ingesting mention:", error);
    return NextResponse.json(
      { error: "Failed to ingest mention" },
      { status: 500 }
    );
  }
}

