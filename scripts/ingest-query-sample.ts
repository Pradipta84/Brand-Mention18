/**
 * Sample script to ingest test queries
 * Run with: npx tsx scripts/ingest-query-sample.ts
 */

import { processQuery } from "../src/lib/query/processor";
import { QueryPriority } from "../src/generated/prisma/client";

const sampleQueries = [
  {
    channel: "email",
    authorName: "Sarah Johnson",
    authorEmail: "sarah.j@example.com",
    subject: "Billing Issue - Incorrect Charge",
    body: "Hi, I noticed an incorrect charge on my account this month. I was charged $99 but should have been charged $49. Can you please look into this and issue a refund? This is urgent as it's affecting my budget.",
    priority: QueryPriority.URGENT,
  },
  {
    channel: "twitter",
    authorName: "TechEnthusiast",
    authorHandle: "@techfan123",
    subject: null,
    body: "Hey @BrandWatch, how do I integrate your API with my React app? Looking for documentation or examples. Thanks!",
  },
  {
    channel: "support_ticket",
    authorName: "Mike Chen",
    authorEmail: "mike.chen@company.com",
    subject: "Feature Request: Dark Mode",
    body: "I would love to see a dark mode option in the dashboard. Many of us work late hours and the bright interface is hard on the eyes. Could you consider adding this feature?",
  },
  {
    channel: "reddit",
    authorName: "u/developer_pro",
    authorHandle: "u/developer_pro",
    subject: null,
    body: "Is anyone else experiencing crashes when trying to export reports? The app keeps freezing when I click export. This is really frustrating and I need to get this report to my manager ASAP.",
  },
  {
    channel: "email",
    authorName: "Emily Rodriguez",
    authorEmail: "emily.r@startup.io",
    subject: "Question about Pricing Plans",
    body: "I'm interested in upgrading to the Pro plan. Can you tell me what features are included and if there's a discount for annual billing?",
  },
  {
    channel: "chat",
    authorName: "Alex Thompson",
    authorEmail: "alex.t@example.com",
    subject: null,
    body: "The login page isn't working. I keep getting an error message saying 'Invalid credentials' even though I'm using the correct password. This started happening yesterday.",
    priority: QueryPriority.HIGH,
  },
  {
    channel: "forum",
    authorName: "Community Member",
    authorHandle: "cm_user456",
    subject: null,
    body: "Great product! I've been using it for 3 months now and it's really helped streamline our workflow. Just wanted to share some positive feedback.",
  },
  {
    channel: "email",
    authorName: "David Kim",
    authorEmail: "david.kim@corp.com",
    subject: "Technical Support Needed",
    body: "We're having issues with the API rate limits. Our application is hitting the limits frequently and we need to increase our quota. Can someone from technical support contact us?",
    priority: QueryPriority.HIGH,
  },
  {
    channel: "twitter",
    authorName: "HappyCustomer",
    authorHandle: "@happy_customer",
    subject: null,
    body: "Just wanted to say thanks to @BrandWatch team for the amazing support! You guys are the best! 🙌",
  },
  {
    channel: "support_ticket",
    authorName: "Lisa Wang",
    authorEmail: "lisa.wang@business.com",
    subject: "Bug Report: Dashboard Not Loading",
    body: "The dashboard is not loading properly. I see a blank screen with just the sidebar. This happens in both Chrome and Firefox. I've tried clearing cache and cookies but the issue persists. Please help!",
    priority: QueryPriority.HIGH,
  },
];

async function ingestSamples() {
  console.log("Starting sample query ingestion...");

  for (const raw of sampleQueries) {
    try {
      await processQuery({
        channel: raw.channel,
        authorName: raw.authorName,
        authorEmail: raw.authorEmail || undefined,
        authorHandle: raw.authorHandle || undefined,
        subject: raw.subject || undefined,
        body: raw.body,
        priority: raw.priority,
      });

      console.log(`✓ Ingested: ${raw.authorName} - ${raw.subject || raw.body.substring(0, 50)}...`);
    } catch (error) {
      console.error(`✗ Failed to ingest ${raw.authorName}:`, error);
    }
  }

  console.log("Sample query ingestion complete!");
}

ingestSamples()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

