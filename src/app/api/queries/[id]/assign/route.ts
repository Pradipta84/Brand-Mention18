import { NextResponse } from "next/server";
import { assignQuery } from "@/lib/query/processor";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { assigneeId, notes } = body;

    if (!assigneeId) {
      return NextResponse.json(
        { error: "Missing required field: assigneeId" },
        { status: 400 }
      );
    }

    await assignQuery(params.id, assigneeId, notes);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error assigning query:", error);
    return NextResponse.json(
      { error: "Failed to assign query" },
      { status: 500 }
    );
  }
}

