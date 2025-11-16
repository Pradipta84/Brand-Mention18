import { prisma } from "@/lib/prisma";

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

export interface SearchFilters {
  query?: string;
  fileType?: DocumentType;
  team?: string;
  project?: string;
  category?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  fileType: string;
  fileUrl?: string;
  fileSize?: number;
  author?: string;
  team?: string;
  project?: string;
  tags: string[];
  categories: Array<{ id: number; name: string; type: string }>;
  indexedAt: string;
  createdAt: string;
  relevanceScore?: number;
}

/**
 * Smart search across documents
 * Searches in title, description, and content
 */
export async function searchDocuments(
  filters: SearchFilters = {}
): Promise<{ results: SearchResult[]; total: number }> {
  try {
    const {
      query,
      fileType,
      team,
      project,
      category,
      tags,
      limit = 50,
      offset = 0,
    } = filters;

    const where: any = {};

    // Text search in title, description, or content
    if (query && query.trim()) {
      const searchQuery = query.trim();
      where.OR = [
        { title: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        { content: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    // Filter by file type
    if (fileType) {
      where.fileType = fileType;
    }

    // Filter by team
    if (team) {
      where.team = team;
    }

    // Filter by project
    if (project) {
      where.project = project;
    }

    // Filter by tags
    if (tags && tags.length > 0) {
      where.tags = {
        hasEvery: tags,
      };
    }

    // Filter by category
    if (category) {
      where.categories = {
        some: {
          category: {
            name: category,
          },
        },
      };
    }

    const [documents, total] = await Promise.all([
      (prisma as any).document.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { indexedAt: "desc" },
          { updatedAt: "desc" },
        ],
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      }),
      (prisma as any).document.count({ where }),
    ]);

    // Calculate relevance score for text search
    const results: SearchResult[] = documents.map((doc: any) => {
      let relevanceScore = 0;
      if (query) {
        const searchQuery = query.toLowerCase();
        const titleLower = doc.title.toLowerCase();
        const descLower = (doc.description || "").toLowerCase();
        const contentLower = (doc.content || "").toLowerCase();

        // Title matches are most relevant
        if (titleLower.includes(searchQuery)) relevanceScore += 10;
        if (titleLower === searchQuery) relevanceScore += 5;

        // Description matches
        if (descLower.includes(searchQuery)) relevanceScore += 5;

        // Content matches
        if (contentLower.includes(searchQuery)) relevanceScore += 2;

        // Word matches
        const queryWords = searchQuery.split(/\s+/);
        queryWords.forEach((word: string) => {
          if (titleLower.includes(word)) relevanceScore += 2;
          if (descLower.includes(word)) relevanceScore += 1;
        });
      }

      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        fileType: doc.fileType,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        author: doc.author,
        team: doc.team,
        project: doc.project,
        tags: doc.tags || [],
        categories: doc.categories.map((rel: any) => ({
          id: rel.category.id,
          name: rel.category.name,
          type: rel.category.type,
        })),
        indexedAt: doc.indexedAt.toISOString(),
        createdAt: doc.createdAt.toISOString(),
        relevanceScore: query ? relevanceScore : undefined,
      };
    });

    // Sort by relevance if search query provided
    if (query) {
      results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }

    return { results, total };
  } catch (error) {
    console.error("Error searching documents:", error);
    return { results: [], total: 0 };
  }
}

/**
 * Get document by ID
 */
export async function getDocumentById(id: string): Promise<SearchResult | null> {
  try {
    const doc = await (prisma as any).document.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!doc) return null;

    return {
      id: doc.id,
      title: doc.title,
      description: doc.description,
      fileType: doc.fileType,
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
      author: doc.author,
      team: doc.team,
      project: doc.project,
      tags: doc.tags || [],
      categories: doc.categories.map((rel: any) => ({
        id: rel.category.id,
        name: rel.category.name,
        type: rel.category.type,
      })),
      indexedAt: doc.indexedAt.toISOString(),
      createdAt: doc.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}

