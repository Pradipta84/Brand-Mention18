import { prisma } from "@/lib/prisma";

type UpdateType = "PRICING" | "CAMPAIGN" | "RELEASE" | "PARTNERSHIP" | "FEATURE" | "ANNOUNCEMENT" | "OTHER";

/**
 * Detect trends in competitor activities
 * Returns patterns like frequent pricing changes, release cycles, etc.
 */
export interface Trend {
  competitorId: string;
  competitorName: string;
  type: UpdateType;
  frequency: number; // Updates per week
  trend: "increasing" | "decreasing" | "stable";
  lastUpdate: Date;
}

export async function detectTrends(
  days: number = 30
): Promise<Trend[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  // Get all updates in the period
  const updates = await (prisma as any).competitorUpdate.findMany({
    where: {
      publishedAt: {
        gte: cutoffDate,
      },
    },
    include: {
      competitor: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });

  // Group by competitor and type
  const grouped: Record<
    string,
    Record<string, { count: number; dates: Date[] }>
  > = {};

  updates.forEach((update: any) => {
    const key = `${update.competitorId}-${update.type}`;
    if (!grouped[update.competitorId]) {
      grouped[update.competitorId] = {};
    }
    if (!grouped[update.competitorId][update.type]) {
      grouped[update.competitorId][update.type] = { count: 0, dates: [] };
    }
    grouped[update.competitorId][update.type].count++;
    grouped[update.competitorId][update.type].dates.push(update.publishedAt);
  });

  // Calculate trends
  const trends: Trend[] = [];

  for (const [competitorId, types] of Object.entries(grouped)) {
    const competitor = updates.find((u: any) => u.competitorId === competitorId)
      ?.competitor;
    if (!competitor) continue;

    for (const [type, data] of Object.entries(types)) {
      const frequency = (data.count / days) * 7; // Updates per week

      // Determine trend (simple: compare first half vs second half)
      const sortedDates = data.dates.sort((a, b) => a.getTime() - b.getTime());
      const midPoint = Math.floor(sortedDates.length / 2);
      const firstHalf = sortedDates.slice(0, midPoint).length;
      const secondHalf = sortedDates.slice(midPoint).length;

      let trendDirection: "increasing" | "decreasing" | "stable" = "stable";
      if (secondHalf > firstHalf * 1.2) {
        trendDirection = "increasing";
      } else if (firstHalf > secondHalf * 1.2) {
        trendDirection = "decreasing";
      }

      trends.push({
        competitorId,
        competitorName: competitor.name,
        type: type as UpdateType,
        frequency,
        trend: trendDirection,
        lastUpdate: sortedDates[sortedDates.length - 1],
      });
    }
  }

  return trends.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Detect repeated patterns (e.g., competitor releases every 2 weeks)
 */
export async function detectPatterns(
  competitorId: string,
  type: UpdateType
): Promise<{ pattern: string; confidence: number } | null> {
  const updates = await (prisma as any).competitorUpdate.findMany({
    where: {
      competitorId,
      type,
    },
    orderBy: {
      publishedAt: "asc",
    },
    take: 10, // Analyze last 10 updates
  });

  if (updates.length < 3) {
    return null; // Not enough data
  }

  // Calculate average interval
  const intervals: number[] = [];
  for (let i = 1; i < updates.length; i++) {
    const diff =
      updates[i].publishedAt.getTime() - updates[i - 1].publishedAt.getTime();
    intervals.push(diff / (1000 * 60 * 60 * 24)); // Convert to days
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

  // Check consistency (standard deviation)
  const variance =
    intervals.reduce(
      (sum, interval) => sum + Math.pow(interval - avgInterval, 2),
      0
    ) / intervals.length;
  const stdDev = Math.sqrt(variance);

  // If standard deviation is low, pattern is consistent
  const confidence = Math.max(0, 1 - stdDev / avgInterval);

  if (confidence > 0.6 && avgInterval > 0) {
    const pattern =
      avgInterval < 7
        ? `Every ${Math.round(avgInterval)} days`
        : avgInterval < 30
          ? `Every ${Math.round(avgInterval / 7)} weeks`
          : `Every ${Math.round(avgInterval / 30)} months`;

    return { pattern, confidence };
  }

  return null;
}

