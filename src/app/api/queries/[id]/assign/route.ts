import { NextResponse } from "next/server";
import { assignQuery } from "@/lib/query/processor";

// Helper to resolve params (handles both sync and async)
async function resolveParams(params: Promise<{ id: string }> | { id: string }): Promise<{ id: string }> {
  return await Promise.resolve(params);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await resolveParams(params);
    const body = await request.json();
    const { assigneeId, notes } = body;

    if (!assigneeId) {
      return NextResponse.json(
        { error: "Missing required field: assigneeId" },
        { status: 400 }
      );
    }

    await assignQuery(id, assigneeId, notes);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error assigning query:", error);
    return NextResponse.json(
      { error: "Failed to assign query" },
      { status: 500 }
    );
  }
}

