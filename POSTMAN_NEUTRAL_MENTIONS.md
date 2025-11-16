# Postman Guide: Adding Neutral Mentions

## Endpoint Details

**URL:** `http://192.168.195.1:3000/api/ingest`  
**Method:** `POST`  
**Headers:**
```
Content-Type: application/json
```

## Sample JSON Payloads for Neutral Sentiment

### Example 1: News Article (Neutral)
```json
{
  "sourceName": "Tech News Daily",
  "channel": "news",
  "sourceUrl": "https://technewsdaily.com",
  "author": "John Smith",
  "body": "BrandWatch announced a new feature update today. The company released version 2.0 with additional monitoring capabilities. Users can now track mentions across more platforms.",
  "permalink": "https://technewsdaily.com/articles/brandwatch-update-2024",
  "publishedAt": "2024-11-15T10:00:00Z",
  "reach": 5000
}
```

### Example 2: Twitter Post (Neutral)
```json
{
  "sourceName": "X (Twitter)",
  "channel": "twitter",
  "sourceUrl": "https://twitter.com",
  "author": "TechObserver",
  "handle": "@techobserver",
  "body": "BrandWatch released their quarterly report. The platform now supports 15 different data sources. More details available on their website.",
  "permalink": "https://twitter.com/techobserver/status/12345678",
  "publishedAt": "2024-11-15T11:30:00Z",
  "reach": 3000
}
```

### Example 3: Reddit Post (Neutral)
```json
{
  "sourceName": "Reddit",
  "channel": "reddit",
  "sourceUrl": "https://reddit.com",
  "author": "u/marketinganalyst",
  "body": "I read about BrandWatch's new dashboard features. The interface includes charts and analytics. Has anyone tried the latest version?",
  "permalink": "https://reddit.com/r/marketing/comments/abc123/brandwatch-update",
  "publishedAt": "2024-11-15T12:00:00Z",
  "reach": 1500
}
```

### Example 4: Blog Post (Neutral)
```json
{
  "sourceName": "Marketing Insights Blog",
  "channel": "blog",
  "sourceUrl": "https://marketinginsights.com",
  "author": "Sarah Williams",
  "body": "BrandWatch provides tools for monitoring brand mentions. The platform offers various subscription plans. Companies can track their online presence through multiple channels.",
  "permalink": "https://marketinginsights.com/brandwatch-review-2024",
  "publishedAt": "2024-11-15T13:00:00Z",
  "reach": 8000
}
```

### Example 5: Forum Discussion (Neutral)
```json
{
  "sourceName": "Marketing Forums",
  "channel": "forum",
  "sourceUrl": "https://marketingforums.com",
  "author": "MarketingPro2024",
  "body": "I'm considering BrandWatch for our team. The platform seems to have the features we need. Does anyone have experience with their pricing structure?",
  "permalink": "https://marketingforums.com/discussion/brandwatch-pricing",
  "publishedAt": "2024-11-15T14:00:00Z",
  "reach": 2000
}
```

## Required Fields

- `sourceName` (string) - Name of the source
- `channel` (string) - One of: `twitter`, `reddit`, `news`, `blog`, `youtube`, `forum`
- `author` (string) - Author name
- `body` (string) - The mention text (avoid positive/negative keywords for neutral)
- `permalink` (string) - Unique URL to the mention
- `publishedAt` (string) - ISO 8601 date format

## Optional Fields

- `sourceUrl` (string) - URL of the source website
- `handle` (string) - Social media handle (e.g., @username)
- `reach` (number) - Estimated reach/views

## Tips for Neutral Sentiment

To ensure the mention is classified as **NEUTRAL**, avoid:
- Positive keywords: great, excellent, amazing, love, best, awesome, etc.
- Negative keywords: bad, terrible, awful, hate, disappointed, etc.

Use neutral, factual language:
- "announced", "released", "provides", "includes", "offers"
- "considering", "seems to have", "read about"
- Factual statements without emotional language

## Response

**Success Response (200):**
```json
{
  "success": true
}
```

**Error Response (400/500):**
```json
{
  "error": "Error message here"
}
```

## Quick Test in Postman

1. Open Postman
2. Create a new POST request
3. URL: `http://192.168.195.1:3000/api/ingest`
4. Headers: Add `Content-Type: application/json`
5. Body: Select "raw" and "JSON", paste one of the examples above
6. Click "Send"
7. Check the dashboard at `http://192.168.195.1:3000/dashboard` to see the new mention

