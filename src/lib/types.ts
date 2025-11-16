export type Sentiment = "positive" | "neutral" | "negative";

export type Channel =
  | "twitter"
  | "reddit"
  | "news"
  | "blog"
  | "youtube"
  | "forums";

export interface Mention {
  id: string;
  channel: Channel;
  source: string;
  author: string;
  handle?: string;
  avatar?: string;
  body: string;
  url: string;
  publishedAt: string;
  sentiment: Sentiment;
  reach: number;
  topics: string[];
  spike?: boolean;
}

export interface MentionStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
  deltaWeek: number;
}

export interface SentimentSeriesPoint {
  timestamp: string;
  positive: number;
  neutral: number;
  negative: number;
}

export interface SourceSplit {
  label: string;
  value: number;
  delta: number;
}

export interface AlertItem {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  createdAt: string;
  actionLabel?: string;
}

