import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    // Total queries
    const totalQueries = await (prisma as any).query.count({
      where: {
        receivedAt: {
          gte: cutoffDate,
        },
      },
    });

    // Queries by status
    const byStatus = await (prisma as any).query.groupBy({
      by: ["status"],
      where: {
        receivedAt: {
          gte: cutoffDate,
        },
      },
      _count: true,
    });

    // Queries by priority
    const byPriority = await (prisma as any).query.groupBy({
      by: ["priority"],
      where: {
        receivedAt: {
          gte: cutoffDate,
        },
      },
      _count: true,
    });

    // Queries by channel
    const byChannel = await (prisma as any).query.groupBy({
      by: ["channel"],
      where: {
        receivedAt: {
          gte: cutoffDate,
        },
      },
      _count: true,
    });

    // Queries by tag
    const tagStats = await (prisma as any).queryTagRelation.groupBy({
      by: ["tagId"],
      where: {
        query: {
          receivedAt: {
            gte: cutoffDate,
          },
        },
      },
      _count: true,
    });

    const tagDetails = await Promise.all(
      tagStats.map(async (stat: any) => {
        const tag = await (prisma as any).queryTag.findUnique({
          where: { id: stat.tagId },
        });
        return {
          tagId: stat.tagId,
          label: tag?.label || "Unknown",
          type: tag?.type || "GENERAL",
          count: stat._count,
        };
      })
    );

    // Average response time
    const queriesWithResponse = await (prisma as any).query.findMany({
      where: {
        receivedAt: {
          gte: cutoffDate,
        },
        firstResponseAt: {
          not: null,
        },
      },
      select: {
        receivedAt: true,
        firstResponseAt: true,
      },
    });

    const responseTimes = queriesWithResponse.map((q: any) => {
      const diff = q.firstResponseAt.getTime() - q.receivedAt.getTime();
      return diff / (1000 * 60 * 60); // Convert to hours
    });

    const avgResponseTimeHours =
      responseTimes.length > 0
        ? responseTimes.reduce((a: number, b: number) => a + b, 0) /
          responseTimes.length
        : 0;

    // Resolution time
    const resolvedQueries = await (prisma as any).query.findMany({
      where: {
        receivedAt: {
          gte: cutoffDate,
        },
        resolvedAt: {
          not: null,
        },
      },
      select: {
        receivedAt: true,
        resolvedAt: true,
      },
    });

    const resolutionTimes = resolvedQueries.map((q: any) => {
      const diff = q.resolvedAt.getTime() - q.receivedAt.getTime();
      return diff / (1000 * 60 * 60); // Convert to hours
    });

    const avgResolutionTimeHours =
      resolutionTimes.length > 0
        ? resolutionTimes.reduce((a: number, b: number) => a + b, 0) /
          resolutionTimes.length
        : 0;

    // Response time by priority
    const responseTimeByPriority: Record<string, number[]> = {};
    for (const q of queriesWithResponse) {
      const query = await (prisma as any).query.findFirst({
        where: {
          receivedAt: q.receivedAt,
          firstResponseAt: q.firstResponseAt,
        },
        select: { priority: true },
      });
      if (query) {
        if (!responseTimeByPriority[query.priority]) {
          responseTimeByPriority[query.priority] = [];
        }
        const diff = q.firstResponseAt.getTime() - q.receivedAt.getTime();
        responseTimeByPriority[query.priority].push(diff / (1000 * 60 * 60));
      }
    }

    const avgResponseTimeByPriority: Record<string, number> = {};
    for (const [priority, times] of Object.entries(responseTimeByPriority)) {
      avgResponseTimeByPriority[priority] =
        times.reduce((a, b) => a + b, 0) / times.length;
    }

    return NextResponse.json({
      period: {
        days,
        startDate: cutoffDate.toISOString(),
        endDate: new Date().toISOString(),
      },
      totals: {
        queries: totalQueries,
        responded: queriesWithResponse.length,
        resolved: resolvedQueries.length,
      },
      byStatus: byStatus.map((item: any) => ({
        status: item.status,
        count: item._count,
      })),
      byPriority: byPriority.map((item: any) => ({
        priority: item.priority,
        count: item._count,
      })),
      byChannel: byChannel.map((item: any) => ({
        channel: item.channel,
        count: item._count,
      })),
      byTag: tagDetails.sort((a, b) => b.count - a.count),
      responseTimes: {
        averageHours: avgResponseTimeHours,
        averageByPriority: avgResponseTimeByPriority,
      },
      resolutionTimes: {
        averageHours: avgResolutionTimeHours,
      },
    });
  } catch (error) {
    console.error("Error fetching query analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

