import { prisma } from "@/lib/prisma";
import { Channel, AlertSeverity } from "@/generated/prisma/client";

type UpdateType = "PRICING" | "CAMPAIGN" | "RELEASE" | "PARTNERSHIP" | "FEATURE" | "ANNOUNCEMENT" | "OTHER";

export interface RawCompetitorUpdate {
  competitorName: string;
  competitorWebsite?: string;
  type?: UpdateType;
  title: string;
  description: string;
  sourceUrl?: string;
  sourceChannel: Channel;
  publishedAt: Date;
  impact?: AlertSeverity;
}

/**
 * Process and store a competitor update in the database
 */
export async function processCompetitorUpdate(
  raw: RawCompetitorUpdate
): Promise<void> {
  try {
    // Upsert competitor
    const competitor = await (prisma as any).competitor.upsert({
      where: { name: raw.competitorName },
      update: {
        website: raw.competitorWebsite || undefined,
        updatedAt: new Date(),
      },
      create: {
        name: raw.competitorName,
        website: raw.competitorWebsite,
      },
    });

    // Check if update already exists (by sourceUrl if provided)
    if (raw.sourceUrl) {
      const existing = await (prisma as any).competitorUpdate.findFirst({
        where: {
          competitorId: competitor.id,
          sourceUrl: raw.sourceUrl,
        },
      });

      if (existing) {
        // Update existing update
        await (prisma as any).competitorUpdate.update({
          where: { id: existing.id },
          data: {
            type: raw.type || existing.type,
            title: raw.title,
            description: raw.description,
            impact: raw.impact || existing.impact,
            updatedAt: new Date(),
          },
        });
        return;
      }
    }

    // Create new update
    const update = await (prisma as any).competitorUpdate.create({
      data: {
        competitorId: competitor.id,
        type: raw.type || "OTHER",
        title: raw.title,
        description: raw.description,
        sourceUrl: raw.sourceUrl,
        sourceChannel: raw.sourceChannel,
        publishedAt: raw.publishedAt,
        impact: raw.impact || AlertSeverity.MEDIUM,
      },
    });

    // Check if this is a high-impact update and create alert
    if (raw.impact === AlertSeverity.HIGH || raw.impact === AlertSeverity.CRITICAL) {
      await prisma.alert.upsert({
        where: {
          title: `High-impact update: ${raw.competitorName} - ${raw.title}`,
        },
        update: {
          competitorUpdateId: update.id,
          severity: raw.impact,
          createdAt: new Date(),
        } as any,
        create: {
          title: `High-impact update: ${raw.competitorName} - ${raw.title}`,
          description: raw.description,
          severity: raw.impact,
          competitorUpdateId: update.id,
        } as any,
      });
    }
  } catch (error) {
    console.error("Error processing competitor update:", error);
    throw error;
  }
}

/**
 * Batch process multiple competitor updates
 */
export async function processCompetitorUpdatesBatch(
  rawUpdates: RawCompetitorUpdate[]
): Promise<void> {
  for (const raw of rawUpdates) {
    await processCompetitorUpdate(raw);
  }
}

