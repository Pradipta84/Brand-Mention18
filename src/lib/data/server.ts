import { prisma } from "@/lib/prisma";
import {
  AlertItem,
  Mention,
  MentionStats,
  SentimentSeriesPoint,
  SourceSplit,
} from "@/lib/types";

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

export async function getMentions(limit = 50): Promise<Mention[]> {
  try {
    const mentions = await prisma.mention.findMany({
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
    console.error("Error fetching mentions:", error);
    return [];
  }
}

export async function getStats(): Promise<MentionStats> {
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
    console.error("Error fetching stats:", error);
    return {
      total: 0,
      positive: 0,
      neutral: 0,
      negative: 0,
      deltaWeek: 0,
    };
  }
}

export async function getSentimentTrend(): Promise<SentimentSeriesPoint[]> {
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
    console.error("Error fetching sentiment trend:", error);
    return [];
  }
}

export async function getSourceBreakdown(): Promise<SourceSplit[]> {
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
    console.error("Error fetching source breakdown:", error);
    return [];
  }
}

export async function getAlerts(): Promise<AlertItem[]> {
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
    console.error("Error fetching alerts:", error);
    return [];
  }
}

