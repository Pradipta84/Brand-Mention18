import { prisma } from "@/lib/prisma";
import { detectTrends, Trend } from "@/lib/competitor/trend-detector";

export interface CompetitorUpdate {
  id: string;
  competitorId: string;
  competitorName: string;
  type: string;
  title: string;
  description: string;
  sourceUrl?: string;
  sourceChannel: string;
  publishedAt: string;
  impact: string;
  detectedAt: string;
}

export interface Competitor {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  notes?: string;
  updateCount: number;
  lastUpdate?: string;
}

export async function getCompetitors(): Promise<Competitor[]> {
  try {
    const competitors = await (prisma as any).competitor.findMany({
      include: {
        _count: {
          select: { updates: true },
        },
        updates: {
          orderBy: { publishedAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return competitors.map((comp: any) => ({
      id: comp.id,
      name: comp.name,
      website: comp.website || undefined,
      industry: comp.industry || undefined,
      notes: comp.notes || undefined,
      updateCount: comp._count.updates,
      lastUpdate: comp.updates[0]?.publishedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching competitors:", error);
    return [];
  }
}

export async function getCompetitorUpdates(
  limit = 50,
  competitorId?: string
): Promise<CompetitorUpdate[]> {
  try {
    const updates = await (prisma as any).competitorUpdate.findMany({
      where: competitorId ? { competitorId } : undefined,
      take: limit,
      orderBy: { publishedAt: "desc" },
      include: {
        competitor: true,
      },
    });

    return updates.map((update: any) => ({
      id: update.id,
      competitorId: update.competitorId,
      competitorName: update.competitor.name,
      type: update.type,
      title: update.title,
      description: update.description,
      sourceUrl: update.sourceUrl || undefined,
      sourceChannel: update.sourceChannel,
      publishedAt: update.publishedAt.toISOString(),
      impact: update.impact,
      detectedAt: update.detectedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching competitor updates:", error);
    return [];
  }
}

export async function getCompetitorTrends(days = 30): Promise<Trend[]> {
  try {
    return await detectTrends(days);
  } catch (error) {
    console.error("Error fetching trends:", error);
    return [];
  }
}

export async function getCompetitorStats() {
  try {
    const [totalCompetitors, totalUpdates, recentUpdates] = await Promise.all([
      (prisma as any).competitor.count(),
      (prisma as any).competitorUpdate.count(),
      (prisma as any).competitorUpdate.count({
        where: {
          publishedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    // Count by type
    const updatesByType = await (prisma as any).competitorUpdate.groupBy({
      by: ["type"],
      _count: true,
    });

    // Count high-impact updates
    const highImpactCount = await (prisma as any).competitorUpdate.count({
      where: {
        impact: {
          in: ["HIGH", "CRITICAL"],
        },
        publishedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    return {
      totalCompetitors,
      totalUpdates,
      recentUpdates,
      updatesByType: updatesByType.map((item: any) => ({
        type: item.type,
        count: item._count,
      })),
      highImpactUpdates: highImpactCount,
    };
  } catch (error) {
    console.error("Error fetching competitor stats:", error);
    return {
      totalCompetitors: 0,
      totalUpdates: 0,
      recentUpdates: 0,
      updatesByType: [],
      highImpactUpdates: 0,
    };
  }
}

