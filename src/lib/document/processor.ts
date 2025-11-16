import { prisma } from "@/lib/prisma";
import { categorizeDocument, extractTags } from "./categorizer";

// DocumentType enum values
enum DocumentType {
  PDF = "PDF",
  DOCX = "DOCX",
  DOC = "DOC",
  TXT = "TXT",
  MARKDOWN = "MARKDOWN",
  HTML = "HTML",
  IMAGE = "IMAGE",
  SPREADSHEET = "SPREADSHEET",
  PRESENTATION = "PRESENTATION",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  OTHER = "OTHER",
}

export interface RawDocument {
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

/**
 * Index and store a document
 */
export async function indexDocument(raw: RawDocument): Promise<string> {
  try {
    // Map file type string to enum
    const typeMap: Record<string, DocumentType> = {
      pdf: DocumentType.PDF,
      docx: DocumentType.DOCX,
      doc: DocumentType.DOC,
      txt: DocumentType.TXT,
      md: DocumentType.MARKDOWN,
      markdown: DocumentType.MARKDOWN,
      html: DocumentType.HTML,
      jpg: DocumentType.IMAGE,
      jpeg: DocumentType.IMAGE,
      png: DocumentType.IMAGE,
      gif: DocumentType.IMAGE,
      xlsx: DocumentType.SPREADSHEET,
      xls: DocumentType.SPREADSHEET,
      csv: DocumentType.SPREADSHEET,
      pptx: DocumentType.PRESENTATION,
      ppt: DocumentType.PRESENTATION,
      mp4: DocumentType.VIDEO,
      mov: DocumentType.VIDEO,
      mp3: DocumentType.AUDIO,
      wav: DocumentType.AUDIO,
    };

    const fileType =
      typeMap[raw.fileType?.toLowerCase()] || DocumentType.OTHER;

    // Auto-categorize
    const { categories, detectedTeam, detectedProject } = categorizeDocument(
      raw.title,
      raw.description || null,
      raw.content || null,
      raw.team || null,
      raw.project || null
    );

    // Extract tags
    const tags = raw.tags || extractTags(raw.title, raw.description || null, raw.content || null);

    // Create document
    const document = await (prisma as any).document.create({
      data: {
        title: raw.title,
        description: raw.description,
        content: raw.content,
        fileType,
        fileUrl: raw.fileUrl,
        fileSize: raw.fileSize,
        mimeType: raw.mimeType,
        author: raw.author,
        team: detectedTeam || raw.team,
        project: detectedProject || raw.project,
        tags,
      },
    });

    // Create or link categories
    for (const cat of categories) {
      let category = await (prisma as any).documentCategory.findFirst({
        where: {
          name: cat.name,
          type: cat.type,
        },
      });

      if (!category) {
        category = await (prisma as any).documentCategory.create({
          data: {
            name: cat.name,
            type: cat.type,
          },
        });
      }

      // Link document to category
      await (prisma as any).documentCategoryRelation.upsert({
        where: {
          documentId_categoryId: {
            documentId: document.id,
            categoryId: category.id,
          },
        },
        create: {
          documentId: document.id,
          categoryId: category.id,
        },
        update: {},
      });
    }

    return document.id;
  } catch (error) {
    console.error("Error indexing document:", error);
    throw error;
  }
}

/**
 * Batch index multiple documents
 */
export async function indexDocumentsBatch(
  rawDocuments: RawDocument[]
): Promise<string[]> {
  const ids: string[] = [];
  for (const raw of rawDocuments) {
    try {
      const id = await indexDocument(raw);
      ids.push(id);
    } catch (error) {
      console.error("Error indexing document:", error);
    }
  }
  return ids;
}

