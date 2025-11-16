import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SourceSplit } from "@/lib/types";

export async function GET() {
  try {
    // Get mentions from last 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    // Get mentions from previous day for delta calculation
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

    // Group by source
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

    // Calculate percentages and deltas
    const breakdown: SourceSplit[] = Object.entries(currentCounts)
      .map(([label, count]) => {
        const value = totalCurrent > 0 ? Math.round((count / totalCurrent) * 100) : 0;
        const previous = previousCounts[label] || 0;
        const delta = previous > 0 ? Math.round(((count - previous) / previous) * 100) : count > 0 ? 100 : 0;
        return { label, value, delta };
      })
      .sort((a, b) => b.value - a.value);

    return NextResponse.json(breakdown);
  } catch (error) {
    console.error("Error fetching source breakdown:", error);
    return NextResponse.json(
      { error: "Failed to fetch source breakdown" },
      { status: 500 }
    );
  }
}

