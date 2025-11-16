import { NextResponse } from "next/server";
import { updateQueryPriority } from "@/lib/query/processor";
import { QueryPriority } from "@/generated/prisma/client";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { priority, userId, notes } = body;

    if (!priority) {
      return NextResponse.json(
        { error: "Missing required field: priority" },
        { status: 400 }
      );
    }

    const priorityMap: Record<string, QueryPriority> = {
      low: QueryPriority.LOW,
      medium: QueryPriority.MEDIUM,
      high: QueryPriority.HIGH,
      urgent: QueryPriority.URGENT,
    };

    const queryPriority = priorityMap[priority.toLowerCase()];
    if (!queryPriority) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }

    await updateQueryPriority(params.id, queryPriority, userId, notes);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating query priority:", error);
    return NextResponse.json(
      { error: "Failed to update query priority" },
      { status: 500 }
    );
  }
}

