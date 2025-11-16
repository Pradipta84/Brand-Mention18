import { NextResponse } from "next/server";
import { searchDocuments } from "@/lib/document/search";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const fileType = searchParams.get("fileType");
    const team = searchParams.get("team");
    const project = searchParams.get("project");
    const category = searchParams.get("category");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const filters: any = {
      query: query || undefined,
      team: team || undefined,
      project: project || undefined,
      category: category || undefined,
      tags: tags && tags.length > 0 ? tags : undefined,
      limit,
      offset,
    };

    if (fileType) {
      // Map string to enum value
      const typeMap: Record<string, string> = {
        pdf: "PDF",
        docx: "DOCX",
        doc: "DOC",
        txt: "TXT",
        markdown: "MARKDOWN",
        html: "HTML",
        image: "IMAGE",
        spreadsheet: "SPREADSHEET",
        presentation: "PRESENTATION",
        video: "VIDEO",
        audio: "AUDIO",
        other: "OTHER",
      };
      filters.fileType = typeMap[fileType.toLowerCase()] as any;
    }

    const { results, total } = await searchDocuments(filters);

    return NextResponse.json({
      results,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error searching documents:", error);
    return NextResponse.json(
      { error: "Failed to search documents" },
      { status: 500 }
    );
  }
}

