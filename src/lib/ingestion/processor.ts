import { prisma } from "@/lib/prisma";
import { Sentiment, Channel } from "@/generated/prisma/client";

export interface RawMention {
  sourceName: string;
  channel: Channel;
  sourceUrl?: string;
  author: string;
  handle?: string;
  body: string;
  permalink: string;
  publishedAt: Date;
  reach?: number;
  sentiment?: Sentiment;
  topics?: string[];
  spike?: boolean;
}

/**
 * Process and store a mention in the database
 */
export async function processMention(raw: RawMention): Promise<void> {
  try {
    // Upsert source
    const source = await prisma.source.upsert({
      where: {
        name_channel: {
          name: raw.sourceName,
          channel: raw.channel,
        },
      },
      update: {},
      create: {
        name: raw.sourceName,
        channel: raw.channel,
        url: raw.sourceUrl,
      },
    });

    // Check if mention already exists
    const existing = await prisma.mention.findUnique({
      where: {
        permalink: raw.permalink,
      },
    });

    if (existing) {
      // Update existing mention
      await prisma.mention.update({
        where: { id: existing.id },
        data: {
          reach: raw.reach ?? existing.reach,
          sentiment: raw.sentiment ?? existing.sentiment,
          spike: raw.spike ?? existing.spike,
        },
      });
      return;
    }

    // Create new mention
    const mention = await prisma.mention.create({
      data: {
        sourceId: source.id,
        author: raw.author,
        handle: raw.handle,
        body: raw.body,
        permalink: raw.permalink,
        sentiment: raw.sentiment ?? Sentiment.NEUTRAL,
        reach: raw.reach ?? 0,
        publishedAt: raw.publishedAt,
        spike: raw.spike ?? false,
      },
    });

    // Add topics if provided
    if (raw.topics && raw.topics.length > 0) {
      for (const topicLabel of raw.topics) {
        const topic = await prisma.topic.upsert({
          where: { label: topicLabel },
          update: {},
          create: { label: topicLabel },
        });

        await prisma.mentionTopic.upsert({
          where: {
            mentionId_topicId: {
              mentionId: mention.id,
              topicId: topic.id,
            },
          },
          update: {},
          create: {
            mentionId: mention.id,
            topicId: topic.id,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error processing mention:", error);
    throw error;
  }
}

/**
 * Batch process multiple mentions
 */
export async function processMentionsBatch(rawMentions: RawMention[]): Promise<void> {
  for (const raw of rawMentions) {
    await processMention(raw);
  }
}

