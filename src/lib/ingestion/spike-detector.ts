import { prisma } from "@/lib/prisma";

/**
 * Detect if there's a spike in mentions for a given topic or sentiment
 * Returns true if mentions in the last hour are significantly higher than average
 */
export async function detectSpike(
  topicLabel?: string,
  sentiment?: "POSITIVE" | "NEGATIVE" | "NEUTRAL"
): Promise<boolean> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Count mentions in the last hour
  const recentCount = await prisma.mention.count({
    where: {
      publishedAt: {
        gte: oneHourAgo,
      },
      ...(topicLabel && {
        topics: {
          some: {
            topic: {
              label: topicLabel,
            },
          },
        },
      }),
      ...(sentiment && { sentiment }),
    },
  });

  // Count mentions in the previous 23 hours (to get average)
  const previousCount = await prisma.mention.count({
    where: {
      publishedAt: {
        gte: oneDayAgo,
        lt: oneHourAgo,
      },
      ...(topicLabel && {
        topics: {
          some: {
            topic: {
              label: topicLabel,
            },
          },
        },
      }),
      ...(sentiment && { sentiment }),
    },
  });

  // Calculate average per hour
  const avgPerHour = previousCount / 23;

  // Spike if recent count is 3x the average
  return recentCount > avgPerHour * 3 && recentCount > 5;
}

/**
 * Check for spikes and create alerts if detected
 */
export async function checkAndCreateAlerts(): Promise<void> {
  // Check for negative sentiment spikes
  const negativeSpike = await detectSpike(undefined, "NEGATIVE");
  if (negativeSpike) {
    const recentNegative = await prisma.mention.findFirst({
      where: {
        publishedAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000),
        },
        sentiment: "NEGATIVE",
      },
      orderBy: {
        publishedAt: "desc",
      },
    });

    if (recentNegative) {
      await prisma.alert.upsert({
        where: {
          title: "Spike in negative sentiment",
        },
        update: {
          mentionId: recentNegative.id,
          createdAt: new Date(),
        },
        create: {
          title: "Spike in negative sentiment",
          description: `Detected a significant increase in negative mentions in the last hour. Consider immediate response.`,
          severity: "CRITICAL",
          mentionId: recentNegative.id,
        },
      });

      // Mark mentions as spikes
      await prisma.mention.updateMany({
        where: {
          publishedAt: {
            gte: new Date(Date.now() - 60 * 60 * 1000),
          },
          sentiment: "NEGATIVE",
        },
        data: {
          spike: true,
        },
      });
    }
  }
}

