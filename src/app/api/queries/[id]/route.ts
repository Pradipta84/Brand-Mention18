import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to resolve params (handles both sync and async)
async function resolveParams(params: Promise<{ id: string }> | { id: string }): Promise<{ id: string }> {
  return await Promise.resolve(params);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await resolveParams(params);

    const query = await (prisma as any).query.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!query) {
      return NextResponse.json(
        { error: "Query not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: query.id,
      subject: query.subject,
      status: query.status,
      priority: query.priority,
    });
  } catch (error: any) {
    console.error("Error fetching query:", error);
    return NextResponse.json(
      { error: "Failed to fetch query", details: error?.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await resolveParams(params);

    console.log("Attempting to delete query:", id);

    // Check if query exists
    const query = await (prisma as any).query.findUnique({
      where: { id },
    });

    if (!query) {
      console.log("Query not found:", id);
      return NextResponse.json(
        { error: "Query not found" },
        { status: 404 }
      );
    }

    console.log("Query found, deleting:", query.id);

    // Delete the query (cascade will handle related records)
    await (prisma as any).query.delete({
      where: { id },
    });

    console.log("Query deleted successfully:", id);

    return NextResponse.json({ success: true, message: "Query deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting query:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete query",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

