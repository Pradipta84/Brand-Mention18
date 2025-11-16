import {
  AlertItem,
  Mention,
  MentionStats,
  SentimentSeriesPoint,
  SourceSplit,
} from "@/lib/types";

export const mentionStats: MentionStats = {
  total: 1284,
  positive: 54,
  neutral: 28,
  negative: 18,
  deltaWeek: 12,
};

export const sentimentSeries: SentimentSeriesPoint[] = [
  { timestamp: "2025-11-09", positive: 42, neutral: 31, negative: 15 },
  { timestamp: "2025-11-10", positive: 48, neutral: 26, negative: 19 },
  { timestamp: "2025-11-11", positive: 52, neutral: 30, negative: 17 },
  { timestamp: "2025-11-12", positive: 47, neutral: 32, negative: 21 },
  { timestamp: "2025-11-13", positive: 58, neutral: 29, negative: 14 },
  { timestamp: "2025-11-14", positive: 61, neutral: 33, negative: 12 },
  { timestamp: "2025-11-15", positive: 66, neutral: 28, negative: 10 },
];

export const sourceSplit: SourceSplit[] = [
  { label: "Twitter/X", value: 54, delta: 8 },
  { label: "Reddit", value: 18, delta: -2 },
  { label: "News", value: 14, delta: 3 },
  { label: "YouTube", value: 8, delta: 5 },
  { label: "Blogs", value: 6, delta: 1 },
];

export const mentionFeed: Mention[] = [
  {
    id: "mnt-01",
    channel: "twitter",
    source: "X (Twitter)",
    author: "Lisa K",
    handle: "@productgrowth",
    body:
      "Seeing lots of chatter about BrandWatch's Black Friday bundles. Pricing transparency looks great compared to competitors.",
    url: "https://twitter.com/productgrowth/status/1",
    publishedAt: "2025-11-15T05:04:00.000Z",
    sentiment: "positive",
    reach: 57000,
    topics: ["pricing", "campaigns"],
  },
  {
    id: "mnt-02",
    channel: "reddit",
    source: "Reddit",
    author: "u/opswizard",
    body:
      "Any one else getting slower responses from BrandWatch support this week? Wondering if it's due to the new launch.",
    url: "https://reddit.com/r/marketing/comments/xyz",
    publishedAt: "2025-11-15T03:12:00.000Z",
    sentiment: "negative",
    reach: 4100,
    topics: ["support", "experience"],
    spike: true,
  },
  {
    id: "mnt-03",
    channel: "news",
    source: "MarTech Today",
    author: "Priya Das",
    body:
      "Breakdown of BrandWatch v4: AI-powered routing trims response times by 36% across enterprise pilots.",
    url: "https://martechtoday.com/articles/brandwatch-v4",
    publishedAt: "2025-11-14T17:45:00.000Z",
    sentiment: "positive",
    reach: 89000,
    topics: ["ai", "product"],
  },
  {
    id: "mnt-04",
    channel: "forums",
    source: "GrowthHackers",
    author: "Diego",
    body:
      "We're evaluating BrandWatch vs Signal; curious how their alerting works for localized launches.",
    url: "https://growthhackers.com/posts/brandwatch",
    publishedAt: "2025-11-14T12:02:00.000Z",
    sentiment: "neutral",
    reach: 2200,
    topics: ["alerts", "evaluation"],
  },
];

export const alertQueue: AlertItem[] = [
  {
    id: "alert-01",
    severity: "critical",
    title: "Spike in support complaints",
    description:
      "Negative sentiment up 63% in the last 6 hours across Reddit + Twitter. Top topic: onboarding lag.",
    createdAt: "2025-11-15T05:30:00.000Z",
    actionLabel: "View queue",
  },
  {
    id: "alert-02",
    severity: "medium",
    title: "Influencer mention detected",
    description:
      "Creator @SaaSLiz published a deep dive on BrandWatch bundles (57k reach). Consider amplifying.",
    createdAt: "2025-11-15T04:10:00.000Z",
    actionLabel: "Open mention",
  },
];

