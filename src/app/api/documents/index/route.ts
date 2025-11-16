import { NextResponse } from "next/server";
import { indexDocument } from "@/lib/document/processor";

interface IndexRequest {
  title: string;
  description?: string;
  content?: string;
  fileType: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  author?: string;
  team?: string;
  project?: string;
  tags?: string[];
}

export async function POST(request: Request) {
  try {
    const body: IndexRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.fileType) {
      return NextResponse.json(
        { error: "Missing required fields: title, fileType" },
        { status: 400 }
      );
    }

    // Index the document
    const documentId = await indexDocument({
      title: body.title,
      description: body.description,
      content: body.content,
      fileType: body.fileType,
      fileUrl: body.fileUrl,
      fileSize: body.fileSize,
      mimeType: body.mimeType,
      author: body.author,
      team: body.team,
      project: body.project,
      tags: body.tags,
    });

    return NextResponse.json({ success: true, documentId });
  } catch (error) {
    console.error("Error indexing document:", error);
    return NextResponse.json(
      { error: "Failed to index document" },
      { status: 500 }
    );
  }
}

