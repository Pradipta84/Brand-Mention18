import { QueryTagType, QueryPriority } from "@/generated/prisma/client";

/**
 * Auto-tag queries based on content analysis
 */
export function autoTagQuery(
  subject: string | null,
  body: string
): QueryTagType[] {
  const text = `${subject || ""} ${body}`.toLowerCase();
  const tags: QueryTagType[] = [];

  // Question detection
  if (
    text.match(/\b(how|what|when|where|why|can you|could you|is it|does it|will it)\b/i) ||
    text.includes("?")
  ) {
    tags.push(QueryTagType.QUESTION);
  }

  // Request detection
  if (
    text.match(/\b(please|request|need|want|would like|can i|could i|help me)\b/i)
  ) {
    tags.push(QueryTagType.REQUEST);
  }

  // Complaint detection
  if (
    text.match(/\b(complaint|disappointed|frustrated|angry|upset|unhappy|terrible|awful|horrible|worst|bad service|poor|issue|problem|broken|not working|error|bug)\b/i)
  ) {
    tags.push(QueryTagType.COMPLAINT);
  }

  // Bug report detection
  if (
    text.match(/\b(bug|error|crash|broken|not working|doesn't work|failed|failure|exception|issue|glitch)\b/i)
  ) {
    tags.push(QueryTagType.BUG_REPORT);
  }

  // Feature request detection
  if (
    text.match(/\b(feature|add|implement|suggest|idea|wish|would be great|could you add|please add)\b/i)
  ) {
    tags.push(QueryTagType.FEATURE_REQUEST);
  }

  // Billing detection
  if (
    text.match(/\b(billing|payment|invoice|charge|refund|subscription|plan|price|cost|bill|payment issue|payment problem)\b/i)
  ) {
    tags.push(QueryTagType.BILLING);
  }

  // Technical detection
  if (
    text.match(/\b(technical|api|integration|code|technical support|developer|technical issue|configuration|setup|install)\b/i)
  ) {
    tags.push(QueryTagType.TECHNICAL);
  }

  // Feedback detection
  if (
    text.match(/\b(feedback|suggestion|improve|better|love|great|awesome|amazing|thank you|thanks)\b/i) &&
    !tags.includes(QueryTagType.COMPLAINT)
  ) {
    tags.push(QueryTagType.FEEDBACK);
  }

  // If no specific tags found, mark as general
  if (tags.length === 0) {
    tags.push(QueryTagType.GENERAL);
  }

  return tags;
}

/**
 * Detect priority based on content and keywords
 */
export function detectPriority(
  subject: string | null,
  body: string,
  channel: string
): QueryPriority {
  const text = `${subject || ""} ${body}`.toLowerCase();

  // Urgent keywords
  const urgentKeywords = [
    "urgent",
    "asap",
    "immediately",
    "critical",
    "emergency",
    "down",
    "outage",
    "broken",
    "not working",
    "critical issue",
    "urgent help",
  ];

  const hasUrgentKeyword = urgentKeywords.some((keyword) =>
    text.includes(keyword)
  );

  if (hasUrgentKeyword) {
    return QueryPriority.URGENT;
  }

  // High priority indicators
  const highPriorityKeywords = [
    "important",
    "priority",
    "escalate",
    "complaint",
    "refund",
    "billing issue",
    "payment",
    "account",
    "security",
  ];

  const hasHighPriorityKeyword = highPriorityKeywords.some((keyword) =>
    text.includes(keyword)
  );

  // Complaints are usually high priority
  if (hasHighPriorityKeyword || text.match(/\b(complaint|disappointed|frustrated)\b/i)) {
    return QueryPriority.HIGH;
  }

  // Channel-based priority
  if (channel === "SUPPORT_TICKET" || channel === "EMAIL") {
    return QueryPriority.MEDIUM;
  }

  // Social media queries are often lower priority unless urgent
  if (channel === "TWITTER" || channel === "REDDIT" || channel === "FORUM") {
    return QueryPriority.LOW;
  }

  return QueryPriority.MEDIUM;
}

/**
 * Escalate priority if query is old and unresolved
 */
export function shouldEscalate(
  receivedAt: Date,
  currentPriority: QueryPriority,
  status: string
): QueryPriority {
  // Don't escalate if already urgent or resolved
  if (currentPriority === QueryPriority.URGENT || status === "RESOLVED" || status === "CLOSED") {
    return currentPriority;
  }

  const hoursSinceReceived = (Date.now() - receivedAt.getTime()) / (1000 * 60 * 60);

  // Escalate to URGENT if older than 24 hours and still NEW
  if (hoursSinceReceived > 24 && status === "NEW") {
    return QueryPriority.URGENT;
  }

  // Escalate to HIGH if older than 12 hours and still NEW or ASSIGNED
  if (hoursSinceReceived > 12 && (status === "NEW" || status === "ASSIGNED")) {
    if (currentPriority === QueryPriority.LOW || currentPriority === QueryPriority.MEDIUM) {
      return QueryPriority.HIGH;
    }
  }

  // Escalate to MEDIUM if older than 6 hours and still LOW
  if (hoursSinceReceived > 6 && currentPriority === QueryPriority.LOW) {
    return QueryPriority.MEDIUM;
  }

  return currentPriority;
}

