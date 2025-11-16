import { NextResponse } from "next/server";
import { getDocumentById } from "@/lib/document/search";
import { prisma } from "@/lib/prisma";

async function resolveParams(params: Promise<{ id: string }> | { id: string }): Promise<{ id: string }> {
  return await Promise.resolve(params);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await resolveParams(params);
    const document = await getDocumentById(id);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
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

    console.log("Attempting to delete document:", id);

    // Check if document exists
    const document = await (prisma as any).document.findUnique({
      where: { id },
    });

    if (!document) {
      console.log("Document not found:", id);
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    console.log("Document found, deleting:", document.id);

    // Delete the document (cascade will handle related records like categories)
    await (prisma as any).document.delete({
      where: { id },
    });

    console.log("Document deleted successfully:", id);

    return NextResponse.json({ 
      success: true, 
      message: "Document deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete document",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

