import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to resolve params (handles both sync and async)
async function resolveParams(params: Promise<{ id: string }> | { id: string }): Promise<{ id: string }> {
  return await Promise.resolve(params);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await resolveParams(params);
    const { searchParams } = new URL(request.url);
    const permalink = searchParams.get("permalink") || (id.startsWith("http") ? id : null);

    // Delete by permalink if provided, otherwise by ID
    if (permalink) {
      console.log("Attempting to delete mention by permalink:", permalink);

      // Find mention by permalink
      const mention = await (prisma as any).mention.findUnique({
        where: { permalink },
      });

      if (!mention) {
        console.log("Mention not found with permalink:", permalink);
        return NextResponse.json(
          { error: "Mention not found" },
          { status: 404 }
        );
      }

      console.log("Mention found, deleting:", mention.id);

      // Delete the mention (cascade will handle related records)
      await (prisma as any).mention.delete({
        where: { permalink },
      });

      console.log("Mention deleted successfully:", permalink);

      return NextResponse.json({ success: true, message: "Mention deleted successfully" });
    } else {
      // Delete by ID
      console.log("Attempting to delete mention by ID:", id);

      // Check if mention exists
      const mention = await (prisma as any).mention.findUnique({
        where: { id },
      });

      if (!mention) {
        console.log("Mention not found with ID:", id);
        return NextResponse.json(
          { error: "Mention not found" },
          { status: 404 }
        );
      }

      console.log("Mention found, deleting:", mention.id);

      // Delete the mention (cascade will handle related records)
      await (prisma as any).mention.delete({
        where: { id },
      });

      console.log("Mention deleted successfully:", id);

      return NextResponse.json({ success: true, message: "Mention deleted successfully" });
    }
  } catch (error: any) {
    console.error("Error deleting mention:", error);
    return NextResponse.json(
      {
        error: "Failed to delete mention",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

