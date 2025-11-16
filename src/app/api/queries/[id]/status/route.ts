import { NextResponse } from "next/server";
import { updateQueryStatus } from "@/lib/query/processor";
import { QueryStatus } from "@/generated/prisma/client";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, userId, notes } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Missing required field: status" },
        { status: 400 }
      );
    }

    const statusMap: Record<string, QueryStatus> = {
      new: QueryStatus.NEW,
      assigned: QueryStatus.ASSIGNED,
      in_progress: QueryStatus.IN_PROGRESS,
      waiting_customer: QueryStatus.WAITING_CUSTOMER,
      resolved: QueryStatus.RESOLVED,
      closed: QueryStatus.CLOSED,
    };

    const queryStatus = statusMap[status.toLowerCase()];
    if (!queryStatus) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    await updateQueryStatus(params.id, queryStatus, userId, notes);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating query status:", error);
    return NextResponse.json(
      { error: "Failed to update query status" },
      { status: 500 }
    );
  }
}

