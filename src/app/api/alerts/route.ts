import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AlertItem } from "@/lib/types";

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

export async function GET() {
  try {
    const alerts = await prisma.alert.findMany({
      where: {
        resolvedAt: null, // Only get unresolved alerts
      },
      orderBy: [
        { severity: "desc" }, // Critical first
        { createdAt: "desc" }, // Then by newest
      ],
      take: 10, // Limit to 10 most recent
      include: {
        mention: true,
      },
    });

    // Transform to frontend format
    const transformedAlerts: AlertItem[] = alerts.map((alert) => ({
      id: alert.id,
      severity: mapSeverity(alert.severity),
      title: alert.title,
      description: alert.description,
      createdAt: alert.createdAt.toISOString(),
      actionLabel: alert.mention ? "View mention" : undefined,
    }));

    return NextResponse.json(transformedAlerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}

