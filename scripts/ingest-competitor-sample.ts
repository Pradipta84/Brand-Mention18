/**
 * Sample script to ingest test competitor updates
 * Run with: npx tsx scripts/ingest-competitor-sample.ts
 */

import { processCompetitorUpdate } from "../src/lib/competitor/processor";
import { Channel, AlertSeverity } from "../src/generated/prisma/client";

const sampleUpdates = [
  {
    competitorName: "CompetitorA",
    competitorWebsite: "https://competitora.com",
    title: "New Pricing Plans Launched",
    description: "CompetitorA announced new tiered pricing with 30% discount for annual subscriptions. Starting at $99/month.",
    sourceUrl: "https://competitora.com/blog/pricing-update",
    sourceChannel: Channel.NEWS,
    publishedAt: new Date(),
    impact: AlertSeverity.HIGH,
  },
  {
    competitorName: "CompetitorB",
    competitorWebsite: "https://competitorb.io",
    title: "Major Product Release: v3.0",
    description: "CompetitorB released version 3.0 with AI-powered features and improved dashboard. Available now.",
    sourceUrl: "https://competitorb.io/releases/v3",
    sourceChannel: Channel.BLOG,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    impact: AlertSeverity.CRITICAL,
  },
  {
    competitorName: "CompetitorA",
    title: "Summer Marketing Campaign",
    description: "CompetitorA launched a new summer campaign targeting SMBs with free trial offers.",
    sourceUrl: "https://twitter.com/competitora/status/123",
    sourceChannel: Channel.TWITTER,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    impact: AlertSeverity.MEDIUM,
  },
];

async function ingestSamples() {
  console.log("Starting competitor update ingestion...");

  for (const raw of sampleUpdates) {
    try {
      await processCompetitorUpdate(raw);
      console.log(`✓ Ingested: ${raw.competitorName} - ${raw.title}`);
    } catch (error) {
      console.error(`✗ Failed to ingest ${raw.competitorName}:`, error);
    }
  }

  console.log("Competitor update ingestion complete!");
}

ingestSamples()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

