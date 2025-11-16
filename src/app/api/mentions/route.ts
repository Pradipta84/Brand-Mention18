import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Mention, MentionStats } from "@/lib/types";

// Map Prisma Channel enum to frontend Channel type
function mapChannel(channel: string): Mention["channel"] {
  const channelMap: Record<string, Mention["channel"]> = {
    TWITTER: "twitter",
    REDDIT: "reddit",
    NEWS: "news",
    BLOG: "blog",
    YOUTUBE: "youtube",
    FORUM: "forums",
  };
  return channelMap[channel] || "twitter";
}

// Map Prisma Sentiment enum to frontend Sentiment type
function mapSentiment(sentiment: string): Mention["sentiment"] {
  const sentimentMap: Record<string, Mention["sentiment"]> = {
    POSITIVE: "positive",
    NEUTRAL: "neutral",
    NEGATIVE: "negative",
  };
  return sentimentMap[sentiment] || "neutral";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const query = searchParams.get("q") || "";
    const channel = searchParams.get("channel");
    const sentiment = searchParams.get("sentiment");
    const author = searchParams.get("author");
    const topic = searchParams.get("topic");

    // Build where clause for filtering
    const where: any = {};

    // Text search in body, author, or handle
    if (query) {
      where.OR = [
        { body: { contains: query, mode: "insensitive" } },
        { author: { contains: query, mode: "insensitive" } },
        { handle: { contains: query, mode: "insensitive" } },
      ];
    }

    // Filter by channel
    if (channel) {
      const channelMap: Record<string, string> = {
        twitter: "TWITTER",
        reddit: "REDDIT",
        news: "NEWS",
        blog: "BLOG",
        youtube: "YOUTUBE",
        forums: "FORUM",
      };
      const dbChannel = channelMap[channel.toLowerCase()];
      if (dbChannel) {
        where.source = {
          channel: dbChannel,
        };
      }
    }

    // Filter by sentiment
    if (sentiment) {
      const sentimentMap: Record<string, string> = {
        positive: "POSITIVE",
        neutral: "NEUTRAL",
        negative: "NEGATIVE",
      };
      const dbSentiment = sentimentMap[sentiment.toLowerCase()];
      if (dbSentiment) {
        where.sentiment = dbSentiment;
      }
    }

    // Filter by author
    if (author) {
      where.author = { contains: author, mode: "insensitive" };
    }

    // Filter by topic
    if (topic) {
      where.topics = {
        some: {
          topic: {
            label: { contains: topic, mode: "insensitive" },
          },
        },
      };
    }

    // Fetch mentions with relations
    const mentions = await prisma.mention.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { publishedAt: "desc" },
      include: {
        source: true,
        topics: {
          include: {
            topic: true,
          },
        },
      },
    });

    // Transform to frontend format
    const transformedMentions: Mention[] = mentions.map((mention) => ({
      id: mention.id,
      channel: mapChannel(mention.source.channel),
      source: mention.source.name,
      author: mention.author,
      handle: mention.handle || undefined,
      body: mention.body,
      url: mention.permalink,
      publishedAt: mention.publishedAt.toISOString(),
      sentiment: mapSentiment(mention.sentiment),
      reach: mention.reach,
      topics: mention.topics.map((mt) => mt.topic.label),
      spike: mention.spike,
    }));

    return NextResponse.json(transformedMentions);
  } catch (error) {
    console.error("Error fetching mentions:", error);
    return NextResponse.json(
      { error: "Failed to fetch mentions" },
      { status: 500 }
    );
  }
}

