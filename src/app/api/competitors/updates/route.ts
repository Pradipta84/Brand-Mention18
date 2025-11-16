import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const competitorId = searchParams.get("competitorId");
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = {};
    if (competitorId) where.competitorId = competitorId;
    if (type) where.type = type;

    const updates = await (prisma as any).competitorUpdate.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { publishedAt: "desc" },
      include: {
        competitor: true,
      },
    });

    return NextResponse.json(updates);
  } catch (error) {
    console.error("Error fetching competitor updates:", error);
    return NextResponse.json(
      { error: "Failed to fetch competitor updates" },
      { status: 500 }
    );
  }
}

