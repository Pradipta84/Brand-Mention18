import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const where: any = {};
    if (type) {
      where.type = type.toUpperCase();
    }

    const categories = await (prisma as any).documentCategory.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { documents: true },
        },
      },
    });

    return NextResponse.json(
      categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        type: cat.type,
        documentCount: cat._count.documents,
      }))
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

