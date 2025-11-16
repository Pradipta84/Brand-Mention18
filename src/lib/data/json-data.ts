import { promises as fs } from "fs";
import path from "path";
import type {
  Mention,
  MentionStats,
  SentimentSeriesPoint,
  SourceSplit,
  AlertItem,
} from "@/lib/types";

interface JsonData {
  mentions: Mention[];
  stats: MentionStats;
  sentimentTrend: SentimentSeriesPoint[];
  sourceBreakdown: SourceSplit[];
  alerts: AlertItem[];
}

let cachedData: JsonData | null = null;

async function loadJsonData(): Promise<JsonData> {
  // Return cached data if available
  if (cachedData) {
    return cachedData;
  }

  try {
    // Try multiple possible paths for Vercel/serverless environments
    const possiblePaths = [
      path.join(process.cwd(), "data", "mentions-data.json"),
      path.join(process.cwd(), "..", "data", "mentions-data.json"),
    ];

    let fileContents: string | null = null;
    let lastError: Error | null = null;

    for (const dataPath of possiblePaths) {
      try {
        fileContents = await fs.readFile(dataPath, "utf8");
        console.log(`Successfully loaded JSON from: ${dataPath}`);
        break;
      } catch (err) {
        lastError = err as Error;
        // Try next path
      }
    }

    if (fileContents) {
      cachedData = JSON.parse(fileContents);
      return cachedData!;
    } else {
      throw lastError || new Error("Could not find mentions-data.json in any expected location");
    }
  } catch (error) {
    console.error("Error loading JSON data:", error);
    console.error("Current working directory:", process.cwd());
    // Return empty data structure if file can't be loaded
    return {
      mentions: [],
      stats: {
        total: 0,
        positive: 0,
        neutral: 0,
        negative: 0,
        deltaWeek: 0,
      },
      sentimentTrend: [],
      sourceBreakdown: [],
      alerts: [],
    };
  }
}

export async function getMentionsFromJson(
  limit = 50,
  filters?: {
    q?: string;
    channel?: string;
    sentiment?: string;
    author?: string;
    topic?: string;
  }
): Promise<Mention[]> {
  const data = await loadJsonData();
  let mentions = [...data.mentions];

  // Apply filters
  if (filters?.q) {
    const query = filters.q.toLowerCase();
    mentions = mentions.filter(
      (m) =>
        m.body.toLowerCase().includes(query) ||
        m.author.toLowerCase().includes(query) ||
        (m.handle && m.handle.toLowerCase().includes(query))
    );
  }

  if (filters?.channel) {
    mentions = mentions.filter((m) => m.channel === filters.channel);
  }

  if (filters?.sentiment) {
    mentions = mentions.filter((m) => m.sentiment === filters.sentiment);
  }

  if (filters?.author) {
    mentions = mentions.filter((m) =>
      m.author.toLowerCase().includes(filters.author!.toLowerCase())
    );
  }

  if (filters?.topic) {
    mentions = mentions.filter((m) =>
      m.topics.some((t) =>
        t.toLowerCase().includes(filters.topic!.toLowerCase())
      )
    );
  }

  // Sort by publishedAt descending and limit
  mentions.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return mentions.slice(0, limit);
}

export async function getStatsFromJson(): Promise<MentionStats> {
  const data = await loadJsonData();
  return data.stats;
}

export async function getSentimentTrendFromJson(): Promise<
  SentimentSeriesPoint[]
> {
  const data = await loadJsonData();
  return data.sentimentTrend;
}

export async function getSourceBreakdownFromJson(): Promise<SourceSplit[]> {
  const data = await loadJsonData();
  return data.sourceBreakdown;
}

export async function getAlertsFromJson(): Promise<AlertItem[]> {
  const data = await loadJsonData();
  return data.alerts;
}

