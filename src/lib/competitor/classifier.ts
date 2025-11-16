import { AlertSeverity } from "@/generated/prisma/client";

type UpdateType = "PRICING" | "CAMPAIGN" | "RELEASE" | "PARTNERSHIP" | "FEATURE" | "ANNOUNCEMENT" | "OTHER";

/**
 * Classify competitor update type based on content
 */
export function classifyUpdateType(
  title: string,
  description: string
): UpdateType {
  const text = `${title} ${description}`.toLowerCase();

  // Pricing keywords
  if (
    text.match(/\b(price|pricing|cost|priced|discount|deal|offer|sale|free|trial|subscription|plan|tier)\b/i)
  ) {
    return "PRICING";
  }

  // Campaign keywords
  if (
    text.match(/\b(campaign|promotion|marketing|launch|advertising|ad|sponsor|partnership|collaboration)\b/i)
  ) {
    return "CAMPAIGN";
  }

  // Release keywords
  if (
    text.match(/\b(release|launch|announce|new|version|update|upgrade|beta|alpha|preview|coming soon)\b/i)
  ) {
    return "RELEASE";
  }

  // Feature keywords
  if (
    text.match(/\b(feature|functionality|capability|tool|integration|api|sdk)\b/i)
  ) {
    return "FEATURE";
  }

  // Partnership keywords
  if (
    text.match(/\b(partnership|partner|collaboration|integration|alliance|merger|acquisition)\b/i)
  ) {
    return "PARTNERSHIP";
  }

  // Announcement keywords
  if (
    text.match(/\b(announce|announcement|news|update|statement|press release)\b/i)
  ) {
    return "ANNOUNCEMENT";
  }

  return "OTHER";
}

/**
 * Assess impact level of competitor update
 */
export function assessImpact(
  title: string,
  description: string,
  type: UpdateType
): AlertSeverity {
  const text = `${title} ${description}`.toLowerCase();

  // High-impact keywords
  const highImpactKeywords = [
    "major",
    "significant",
    "breaking",
    "important",
    "critical",
    "urgent",
    "game changer",
    "revolutionary",
    "disruptive",
  ];

  const hasHighImpactKeyword = highImpactKeywords.some((keyword) =>
    text.includes(keyword)
  );

  // Pricing changes are usually high impact
  if (type === "PRICING") {
    return hasHighImpactKeyword ? AlertSeverity.CRITICAL : AlertSeverity.HIGH;
  }

  // Releases and features can be high impact
  if (type === "RELEASE" || type === "FEATURE") {
    return hasHighImpactKeyword ? AlertSeverity.HIGH : AlertSeverity.MEDIUM;
  }

  // Campaigns are usually medium
  if (type === "CAMPAIGN") {
    return AlertSeverity.MEDIUM;
  }

  // Default to medium
  return AlertSeverity.MEDIUM;
}

