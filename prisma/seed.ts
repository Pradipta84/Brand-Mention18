import "dotenv/config";
import {
  AlertSeverity,
  Channel,
  PrismaClient,
  Sentiment,
} from "../src/generated/prisma/client";

const prisma = new PrismaClient();

// Note: Type assertions (as any) are used temporarily for unique fields.
// After running `npm run db:migrate`, the types will be correct and these can be removed.

async function main() {
  const sources = await Promise.all([
    prisma.source.upsert({
      where: { name_channel: { name: "X (Twitter)", channel: Channel.TWITTER } },
      update: {},
      create: {
        name: "X (Twitter)",
        channel: Channel.TWITTER,
        url: "https://twitter.com/brandwatch",
      },
    }),
    prisma.source.upsert({
      where: { name_channel: { name: "Reddit", channel: Channel.REDDIT } },
      update: {},
      create: {
        name: "Reddit",
        channel: Channel.REDDIT,
        url: "https://reddit.com/r/marketing",
      },
    }),
    prisma.source.upsert({
      where: { name_channel: { name: "MarTech Today", channel: Channel.NEWS } },
      update: {},
      create: {
        name: "MarTech Today",
        channel: Channel.NEWS,
        url: "https://martechtoday.com",
      },
    }),
  ]);

  const [twitter, reddit, news] = sources;

  const topics = await Promise.all(
    ["pricing", "support", "ai", "alerts", "campaigns"].map((label) =>
      prisma.topic.upsert({
        where: { label },
        update: {},
        create: { label },
      })
    )
  );

  const topicMap = Object.fromEntries(
    topics.map((topic: { id: number; label: string }) => [topic.label, topic])
  );

  const mention1 = await prisma.mention.upsert({
    where: { permalink: "https://twitter.com/productgrowth/status/1" } as any,
    update: {},
    create: {
      sourceId: twitter.id,
      author: "Lisa K",
      handle: "@productgrowth",
      body:
        "Seeing lots of chatter about BrandWatch's Black Friday bundles. Pricing transparency looks great compared to competitors.",
      permalink: "https://twitter.com/productgrowth/status/1",
      sentiment: Sentiment.POSITIVE,
      reach: 57000,
      publishedAt: new Date("2025-11-15T05:04:00.000Z"),
      topics: {
        create: [
          { topic: { connect: { id: topicMap["pricing"].id } } },
          { topic: { connect: { id: topicMap["campaigns"].id } } },
        ],
      },
    },
  });

  const mention2 = await prisma.mention.upsert({
    where: { permalink: "https://reddit.com/r/marketing/comments/xyz" } as any,
    update: {},
    create: {
      sourceId: reddit.id,
      author: "u/opswizard",
      body:
        "Anyone else getting slower responses from BrandWatch support this week? Wondering if it's due to the new launch.",
      permalink: "https://reddit.com/r/marketing/comments/xyz",
      sentiment: Sentiment.NEGATIVE,
      reach: 4100,
      spike: true,
      publishedAt: new Date("2025-11-15T03:12:00.000Z"),
      topics: {
        create: [{ topic: { connect: { id: topicMap["support"].id } } }],
      },
    },
  });

  await prisma.mention.upsert({
    where: { permalink: "https://martechtoday.com/articles/brandwatch-v4" } as any,
    update: {},
    create: {
      sourceId: news.id,
      author: "Priya Das",
      body:
        "Breakdown of BrandWatch v4: AI-powered routing trims response times by 36% across enterprise pilots.",
      permalink: "https://martechtoday.com/articles/brandwatch-v4",
      sentiment: Sentiment.POSITIVE,
      reach: 89000,
      publishedAt: new Date("2025-11-14T17:45:00.000Z"),
      topics: {
        create: [{ topic: { connect: { id: topicMap["ai"].id } } }],
      },
    },
  });

  await prisma.alert.upsert({
    where: { title: "Spike in support complaints" } as any,
    update: {
      mentionId: mention2.id,
    },
    create: {
      title: "Spike in support complaints",
      description:
        "Negative sentiment up 63% in the last 6 hours across Reddit + Twitter. Top topic: onboarding lag.",
      severity: AlertSeverity.CRITICAL,
      mentionId: mention2.id,
    },
  });

  await prisma.alert.upsert({
    where: { title: "Influencer mention detected" } as any,
    update: {
      mentionId: mention1.id,
    },
    create: {
      title: "Influencer mention detected",
      description:
        "Creator @SaaSLiz published a deep dive on BrandWatch bundles (57k reach). Consider amplifying.",
      severity: AlertSeverity.MEDIUM,
      mentionId: mention1.id,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

