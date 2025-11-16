import {
  AlertItem,
  Mention,
  MentionStats,
  SentimentSeriesPoint,
  SourceSplit,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    cache: "no-store", // Always fetch fresh data
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchMentions(): Promise<Mention[]> {
  return fetchAPI<Mention[]>("/api/mentions");
}

export async function fetchStats(): Promise<MentionStats> {
  return fetchAPI<MentionStats>("/api/stats");
}

export async function fetchSentimentTrend(): Promise<SentimentSeriesPoint[]> {
  return fetchAPI<SentimentSeriesPoint[]>("/api/sentiment-trend");
}

export async function fetchSourceBreakdown(): Promise<SourceSplit[]> {
  return fetchAPI<SourceSplit[]>("/api/source-breakdown");
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  return fetchAPI<AlertItem[]>("/api/alerts");
}

