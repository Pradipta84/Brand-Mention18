/**
 * Sentiment analysis using OpenAI API
 * Falls back to simple keyword-based analysis if API key is not available
 */

export type SentimentResult = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

const POSITIVE_KEYWORDS = [
  "great",
  "excellent",
  "amazing",
  "love",
  "best",
  "awesome",
  "fantastic",
  "wonderful",
  "perfect",
  "outstanding",
  "brilliant",
  "impressive",
  "satisfied",
  "happy",
  "pleased",
  "recommend",
  "helpful",
  "fast",
  "easy",
  "good",
];

const NEGATIVE_KEYWORDS = [
  "bad",
  "terrible",
  "awful",
  "horrible",
  "worst",
  "hate",
  "disappointed",
  "frustrated",
  "slow",
  "broken",
  "bug",
  "error",
  "issue",
  "problem",
  "complaint",
  "poor",
  "unreliable",
  "difficult",
  "confusing",
  "unsatisfied",
];

/**
 * Analyze sentiment using OpenAI API (if available) or keyword-based fallback
 */
export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      return await analyzeWithOpenAI(text, apiKey);
    } catch (error) {
      console.warn("OpenAI API failed, falling back to keyword analysis:", error);
      return analyzeWithKeywords(text);
    }
  }

  return analyzeWithKeywords(text);
}

/**
 * Analyze sentiment using OpenAI API
 */
async function analyzeWithOpenAI(
  text: string,
  apiKey: string
): Promise<SentimentResult> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a sentiment analyzer. Analyze the sentiment of the given text and respond with only one word: POSITIVE, NEUTRAL, or NEGATIVE.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 10,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const result = data.choices[0]?.message?.content?.trim().toUpperCase();

  if (result === "POSITIVE" || result === "NEGATIVE" || result === "NEUTRAL") {
    return result as SentimentResult;
  }

  return "NEUTRAL";
}

/**
 * Simple keyword-based sentiment analysis (fallback)
 */
function analyzeWithKeywords(text: string): SentimentResult {
  const lowerText = text.toLowerCase();
  let positiveScore = 0;
  let negativeScore = 0;

  POSITIVE_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      positiveScore++;
    }
  });

  NEGATIVE_KEYWORDS.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      negativeScore++;
    }
  });

  if (positiveScore > negativeScore) {
    return "POSITIVE";
  } else if (negativeScore > positiveScore) {
    return "NEGATIVE";
  }

  return "NEUTRAL";
}

/**
 * Extract topics from text using simple keyword matching
 * In production, this could use NLP models or OpenAI
 */
export function extractTopics(text: string): string[] {
  const lowerText = text.toLowerCase();
  const topics: string[] = [];

  // Topic keywords mapping
  const topicKeywords: Record<string, string[]> = {
    pricing: ["price", "cost", "pricing", "expensive", "cheap", "affordable", "bundle"],
    support: ["support", "help", "customer service", "response", "assistance"],
    ai: ["ai", "artificial intelligence", "machine learning", "ml", "automation"],
    alerts: ["alert", "notification", "warning", "signal"],
    campaigns: ["campaign", "promotion", "marketing", "launch", "release"],
    product: ["product", "feature", "update", "version", "release"],
    experience: ["experience", "ux", "ui", "interface", "usability"],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      topics.push(topic);
    }
  }

  return topics;
}

