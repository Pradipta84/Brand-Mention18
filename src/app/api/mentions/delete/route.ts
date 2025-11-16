import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const permalink = searchParams.get("permalink");
    const id = searchParams.get("id");

    if (!permalink && !id) {
      return NextResponse.json(
        { error: "Either 'permalink' or 'id' parameter is required" },
        { status: 400 }
      );
    }

    // Delete by permalink if provided
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

      return NextResponse.json({ 
        success: true, 
        message: "Mention deleted successfully",
        deletedId: mention.id
      });
    } else if (id) {
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

      return NextResponse.json({ 
        success: true, 
        message: "Mention deleted successfully" 
      });
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

