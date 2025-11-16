import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SentimentSeriesPoint } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get("range") || "7d"; // Default to 7 days

    // Calculate date range based on filter
    const now = new Date();
    let startDate: Date;
    let groupBy: "day" | "week" | "month" = "day";

    switch (range) {
      case "7d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        groupBy = "day";
        break;
      case "28d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 28);
        groupBy = "day";
        break;
      case "90d":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 90);
        groupBy = "week";
        break;
      case "1y":
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = "week";
        break;
      case "all":
        startDate = new Date(0); // Beginning of time
        groupBy = "month";
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        groupBy = "day";
    }

    const mentions = await prisma.mention.findMany({
      where: {
        publishedAt: {
          gte: startDate,
        },
      },
      orderBy: {
        publishedAt: "asc",
      },
    });

    // Group by date/week/month and calculate sentiment percentages
    const groupedByPeriod: Record<string, { positive: number; neutral: number; negative: number; total: number }> = {};

    mentions.forEach((mention) => {
      let periodKey: string;
      const date = new Date(mention.publishedAt);

      if (groupBy === "day") {
        periodKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
      } else if (groupBy === "week") {
        // Get start of week (Monday as start of week for ISO standard)
        // Create a new date to avoid mutating the original
        const weekStart = new Date(date);
        const dayOfWeek = weekStart.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Calculate days to subtract to get to Monday (or previous Monday if Sunday)
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        weekStart.setDate(weekStart.getDate() - daysToMonday);
        weekStart.setHours(0, 0, 0, 0);
        periodKey = weekStart.toISOString().split("T")[0]; // YYYY-MM-DD of week start
      } else {
        // Month - format as YYYY-MM-01 for consistency
        periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
      }

      if (!groupedByPeriod[periodKey]) {
        groupedByPeriod[periodKey] = { positive: 0, neutral: 0, negative: 0, total: 0 };
      }
      groupedByPeriod[periodKey].total++;
      if (mention.sentiment === "POSITIVE") groupedByPeriod[periodKey].positive++;
      else if (mention.sentiment === "NEUTRAL") groupedByPeriod[periodKey].neutral++;
      else if (mention.sentiment === "NEGATIVE") groupedByPeriod[periodKey].negative++;
    });

    // Convert to array format
    const series: SentimentSeriesPoint[] = Object.entries(groupedByPeriod)
      .map(([timestamp, counts]) => ({
        timestamp,
        positive: counts.total > 0 ? Math.round((counts.positive / counts.total) * 100) : 0,
        neutral: counts.total > 0 ? Math.round((counts.neutral / counts.total) * 100) : 0,
        negative: counts.total > 0 ? Math.round((counts.negative / counts.total) * 100) : 0,
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    // Log for debugging
    console.log(`Sentiment trend for range ${range}: Found ${mentions.length} mentions, grouped into ${series.length} periods`);
    if (series.length > 0) {
      console.log("Sample periods:", series.slice(0, 5).map(s => ({ timestamp: s.timestamp, positive: s.positive, neutral: s.neutral, negative: s.negative })));
    }
    if (mentions.length > 0 && series.length === 1) {
      console.log("WARNING: All mentions grouped into single period. Sample dates:", 
        mentions.slice(0, 5).map(m => ({ date: m.publishedAt, weekStart: new Date(m.publishedAt).toISOString().split("T")[0] }))
      );
    }

    return NextResponse.json(series);
  } catch (error) {
    console.error("Error fetching sentiment trend:", error);
    return NextResponse.json(
      { error: "Failed to fetch sentiment trend" },
      { status: 500 }
    );
  }
}

