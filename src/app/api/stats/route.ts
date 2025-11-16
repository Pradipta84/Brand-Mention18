import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MentionStats } from "@/lib/types";

export async function GET() {
  try {
    // Get mentions from last 24 hours
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const mentions = await prisma.mention.findMany({
      where: {
        publishedAt: {
          gte: last24Hours,
        },
      },
    });

    // Get mentions from last week for comparison
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

    // Calculate sentiment percentages
    const positive = mentions.filter((m) => m.sentiment === "POSITIVE").length;
    const neutral = mentions.filter((m) => m.sentiment === "NEUTRAL").length;
    const negative = mentions.filter((m) => m.sentiment === "NEGATIVE").length;

    const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
    const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0;
    const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;

    // Calculate week-over-week delta
    const deltaWeek =
      lastWeekTotal > 0
        ? Math.round(((total - lastWeekTotal) / lastWeekTotal) * 100)
        : total > 0 ? 100 : 0;

    const stats: MentionStats = {
      total,
      positive: positivePercent,
      neutral: neutralPercent,
      negative: negativePercent,
      deltaWeek,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

