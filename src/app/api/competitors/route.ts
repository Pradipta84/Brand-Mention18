import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUpdates = searchParams.get("includeUpdates") === "true";

    const competitors = await (prisma as any).competitor.findMany({
      include: {
        updates: includeUpdates
          ? {
              orderBy: { publishedAt: "desc" },
              take: 5,
            }
          : false,
        _count: {
          select: { updates: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(competitors);
  } catch (error) {
    console.error("Error fetching competitors:", error);
    return NextResponse.json(
      { error: "Failed to fetch competitors" },
      { status: 500 }
    );
  }
}

