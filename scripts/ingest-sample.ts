/**
 * Sample script to ingest test mentions
 * Run with: npx tsx scripts/ingest-sample.ts
 */

import { processMention } from "../src/lib/ingestion/processor";
import { analyzeSentiment, extractTopics } from "../src/lib/ingestion/sentiment";
import { Channel, Sentiment } from "../src/generated/prisma/client";

const sampleMentions = [
  {
    sourceName: "X (Twitter)",
    channel: Channel.TWITTER,
    sourceUrl: "https://twitter.com",
    author: "TechReviewer",
    handle: "@techreviewer",
    body: "Just tried BrandWatch and it's amazing! The sentiment analysis is spot on and the dashboard is super intuitive.",
    permalink: "https://twitter.com/techreviewer/status/12345",
    publishedAt: new Date(),
    reach: 12000,
  },
  {
    sourceName: "Reddit",
    channel: Channel.REDDIT,
    sourceUrl: "https://reddit.com",
    author: "u/marketingpro",
    body: "Has anyone else noticed BrandWatch's pricing increased? It's getting expensive for small teams.",
    permalink: "https://reddit.com/r/marketing/comments/abc123",
    publishedAt: new Date(),
    reach: 3500,
  },
  {
    sourceName: "MarTech Today",
    channel: Channel.NEWS,
    sourceUrl: "https://martechtoday.com",
    author: "Sarah Johnson",
    body: "BrandWatch launches new AI-powered alerting system that reduces false positives by 40%.",
    permalink: "https://martechtoday.com/articles/brandwatch-ai-alerts",
    publishedAt: new Date(),
    reach: 45000,
  },
];

async function ingestSamples() {
  console.log("Starting sample data ingestion...");

  for (const raw of sampleMentions) {
    try {
      // Analyze sentiment
      const sentiment = await analyzeSentiment(raw.body);
      const topics = extractTopics(raw.body);

      await processMention({
        ...raw,
        sentiment: sentiment as Sentiment,
        topics,
      });

      console.log(`✓ Ingested: ${raw.author} - ${raw.body.substring(0, 50)}...`);
    } catch (error) {
      console.error(`✗ Failed to ingest ${raw.author}:`, error);
    }
  }

  console.log("Sample ingestion complete!");
}

ingestSamples()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

