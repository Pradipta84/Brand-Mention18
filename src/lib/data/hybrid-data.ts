import { prisma } from "@/lib/prisma";
import type {
  Mention,
  MentionStats,
  SentimentSeriesPoint,
  SourceSplit,
  AlertItem,
} from "@/lib/types";
import {
  getMentionsFromJson,
  getStatsFromJson,
  getSentimentTrendFromJson,
  getSourceBreakdownFromJson,
  getAlertsFromJson,
} from "./json-data";

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

// Map Prisma AlertSeverity to frontend severity type
function mapSeverity(severity: string): AlertItem["severity"] {
  const severityMap: Record<string, AlertItem["severity"]> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    CRITICAL: "critical",
  };
  return severityMap[severity] || "medium";
}

/**
 * Check if database is available
 */
async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err: any) {
    // Catch any errors (connection, query, etc.)
    console.log("Database not available, using JSON fallback:", err?.message || "Unknown error");
    return false;
  }
}

/**
 * Get mentions - tries database first, falls back to JSON
 */
export async function getMentions(
  limit = 50,
  filters?: {
    q?: string;
    channel?: string;
    sentiment?: string;
    author?: string;
    topic?: string;
  }
): Promise<Mention[]> {
  // Try database first
  try {
    if (await isDatabaseAvailable()) {
      try {
      const where: any = {};

      // Text search in body, author, or handle
      if (filters?.q) {
        where.OR = [
          { body: { contains: filters.q, mode: "insensitive" } },
          { author: { contains: filters.q, mode: "insensitive" } },
          { handle: { contains: filters.q, mode: "insensitive" } },
        ];
      }

      // Filter by channel
      if (filters?.channel) {
        const channelMap: Record<string, string> = {
          twitter: "TWITTER",
          reddit: "REDDIT",
          news: "NEWS",
          blog: "BLOG",
          youtube: "YOUTUBE",
          forums: "FORUM",
        };
        const dbChannel = channelMap[filters.channel.toLowerCase()];
        if (dbChannel) {
          where.source = { channel: dbChannel };
        }
      }

      // Filter by sentiment
      if (filters?.sentiment) {
        const sentimentMap: Record<string, string> = {
          positive: "POSITIVE",
          neutral: "NEUTRAL",
          negative: "NEGATIVE",
        };
        const dbSentiment = sentimentMap[filters.sentiment.toLowerCase()];
        if (dbSentiment) {
          where.sentiment = dbSentiment;
        }
      }

      // Filter by author
      if (filters?.author) {
        where.author = { contains: filters.author, mode: "insensitive" };
      }

      // Filter by topic
      if (filters?.topic) {
        where.topics = {
          some: {
            topic: {
              label: { contains: filters.topic, mode: "insensitive" },
            },
          },
        };
      }

      const mentions = await prisma.mention.findMany({
        where,
        take: limit,
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

      return mentions.map((mention) => ({
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
      } catch (error) {
        console.error("Error fetching mentions from database:", error);
        // Fall through to JSON fallback
      }
    }
  } catch (error) {
    console.error("Error checking database availability:", error);
    // Fall through to JSON fallback
  }

  // Fallback to JSON
  try {
    return await getMentionsFromJson(limit, filters);
  } catch (error) {
    console.error("Error fetching mentions from JSON:", error);
    // Return empty array as last resort
    return [];
  }
}

/**
 * Get stats - tries database first, falls back to JSON
 */
export async function getStats(): Promise<MentionStats> {
  if (await isDatabaseAvailable()) {
    try {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const mentions = await prisma.mention.findMany({
        where: {
          publishedAt: {
            gte: last24Hours,
          },
        },
      });

      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const lastWeekMentions = await prisma.mention.findMany({
        where: {
          publishedAt: {
            gte: lastWeek,
            lt: last24Hours,
          },
        },
      });

      const total = mentions.length;
      const lastWeekTotal = lastWeekMentions.length;

      const positive = mentions.filter((m) => m.sentiment === "POSITIVE").length;
      const neutral = mentions.filter((m) => m.sentiment === "NEUTRAL").length;
      const negative = mentions.filter((m) => m.sentiment === "NEGATIVE").length;

      const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
      const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0;
      const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;

      const deltaWeek =
        lastWeekTotal > 0
          ? Math.round(((total - lastWeekTotal) / lastWeekTotal) * 100)
          : total > 0
            ? 100
            : 0;

      return {
        total,
        positive: positivePercent,
        neutral: neutralPercent,
        negative: negativePercent,
        deltaWeek,
      };
    } catch (error) {
      console.error("Error fetching stats from database:", error);
      // Fall through to JSON fallback
    }
  }

  return getStatsFromJson();
}

/**
 * Get sentiment trend - tries database first, falls back to JSON
 */
export async function getSentimentTrend(): Promise<SentimentSeriesPoint[]> {
  if (await isDatabaseAvailable()) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const mentions = await prisma.mention.findMany({
        where: {
          publishedAt: {
            gte: sevenDaysAgo,
          },
        },
        orderBy: {
          publishedAt: "asc",
        },
      });

      const groupedByDate: Record<
        string,
        { positive: number; neutral: number; negative: number; total: number }
      > = {};

      mentions.forEach((mention) => {
        const date = mention.publishedAt.toISOString().split("T")[0];
        if (!groupedByDate[date]) {
          groupedByDate[date] = { positive: 0, neutral: 0, negative: 0, total: 0 };
        }
        groupedByDate[date].total++;
        if (mention.sentiment === "POSITIVE") groupedByDate[date].positive++;
        else if (mention.sentiment === "NEUTRAL") groupedByDate[date].neutral++;
        else if (mention.sentiment === "NEGATIVE") groupedByDate[date].negative++;
      });

      return Object.entries(groupedByDate)
        .map(([timestamp, counts]) => ({
          timestamp,
          positive: counts.total > 0 ? Math.round((counts.positive / counts.total) * 100) : 0,
          neutral: counts.total > 0 ? Math.round((counts.neutral / counts.total) * 100) : 0,
          negative: counts.total > 0 ? Math.round((counts.negative / counts.total) * 100) : 0,
        }))
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    } catch (error) {
      console.error("Error fetching sentiment trend from database:", error);
      // Fall through to JSON fallback
    }
  }

  return getSentimentTrendFromJson();
}

/**
 * Get source breakdown - tries database first, falls back to JSON
 */
export async function getSourceBreakdown(): Promise<SourceSplit[]> {
  if (await isDatabaseAvailable()) {
    try {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const previousDay = new Date(last24Hours);
      previousDay.setDate(previousDay.getDate() - 1);

      const currentMentions = await prisma.mention.findMany({
        where: {
          publishedAt: {
            gte: last24Hours,
          },
        },
        include: {
          source: true,
        },
      });

      const previousMentions = await prisma.mention.findMany({
        where: {
          publishedAt: {
            gte: previousDay,
            lt: last24Hours,
          },
        },
        include: {
          source: true,
        },
      });

      const currentCounts: Record<string, number> = {};
      const previousCounts: Record<string, number> = {};

      currentMentions.forEach((mention) => {
        const sourceName = mention.source.name;
        currentCounts[sourceName] = (currentCounts[sourceName] || 0) + 1;
      });

      previousMentions.forEach((mention) => {
        const sourceName = mention.source.name;
        previousCounts[sourceName] = (previousCounts[sourceName] || 0) + 1;
      });

      const totalCurrent = Object.values(currentCounts).reduce((a, b) => a + b, 0);

      return Object.entries(currentCounts)
        .map(([label, count]) => {
          const value = totalCurrent > 0 ? Math.round((count / totalCurrent) * 100) : 0;
          const previous = previousCounts[label] || 0;
          const delta = previous > 0 ? Math.round(((count - previous) / previous) * 100) : count > 0 ? 100 : 0;
          return { label, value, delta };
        })
        .sort((a, b) => b.value - a.value);
    } catch (error) {
      console.error("Error fetching source breakdown from database:", error);
      // Fall through to JSON fallback
    }
  }

  return getSourceBreakdownFromJson();
}

/**
 * Get alerts - tries database first, falls back to JSON
 */
export async function getAlerts(): Promise<AlertItem[]> {
  if (await isDatabaseAvailable()) {
    try {
      const alerts = await prisma.alert.findMany({
        where: {
          resolvedAt: null,
        },
        orderBy: [
          { severity: "desc" },
          { createdAt: "desc" },
        ],
        take: 10,
        include: {
          mention: true,
        },
      });

      return alerts.map((alert) => ({
        id: alert.id,
        severity: mapSeverity(alert.severity),
        title: alert.title,
        description: alert.description,
        createdAt: alert.createdAt.toISOString(),
        actionLabel: alert.mention ? "View mention" : undefined,
      }));
    } catch (error) {
      console.error("Error fetching alerts from database:", error);
      // Fall through to JSON fallback
    }
  }

  return getAlertsFromJson();
}

