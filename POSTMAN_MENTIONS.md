# Postman Guide: Adding Brand Mentions

## Endpoint Details

**URL:** `http://192.168.195.1:3000/api/ingest`  
**Method:** `POST`  
**Headers:**
```
Content-Type: application/json
```

## Required Fields

- `sourceName` (string) - Name of the source (e.g., "Twitter", "Reddit", "TechCrunch")
- `channel` (string) - Channel type: `twitter`, `reddit`, `news`, `blog`, `youtube`, `forum`
- `author` (string) - Author name
- `body` (string) - The mention content/text
- `permalink` (string) - URL to the mention/post
- `publishedAt` (string) - ISO 8601 date string (e.g., "2024-11-15T10:00:00Z")

## Optional Fields

- `sourceUrl` (string) - URL of the source
- `handle` (string) - Social media handle (e.g., "@username")
- `reach` (number) - Number of people who saw this mention

---

## Sample JSON Payloads

### Example 1: Positive Twitter Mention
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "Sarah Martinez",
  "handle": "@sarahmtech",
  "body": "Just tried @BrandWatch for the first time and I'm blown away! The sentiment analysis is incredibly accurate. This is exactly what our team needed. Highly recommend! 🚀",
  "permalink": "https://twitter.com/sarahmtech/status/1234567890",
  "publishedAt": "2024-11-15T14:30:00Z",
  "reach": 8500
}
```

### Example 2: Negative Reddit Post
```json
{
  "sourceName": "Reddit",
  "channel": "reddit",
  "author": "u/concerned_user",
  "handle": "u/concerned_user",
  "body": "Has anyone else experienced issues with BrandWatch's API? I've been getting 500 errors for the past 2 days. Support hasn't responded to my tickets. This is really frustrating.",
  "permalink": "https://reddit.com/r/techsupport/comments/abc123/brandwatch_api_issues",
  "publishedAt": "2024-11-15T12:15:00Z",
  "reach": 3200
}
```

### Example 3: YouTube Video Mention with URL
```json
{
  "sourceName": "YouTube",
  "channel": "youtube",
  "sourceUrl": "https://www.youtube.com/channel/UCexample",
  "author": "TechReview Channel",
  "handle": "@techreview",
  "body": "In this video, I'm reviewing BrandWatch's new features. The dashboard is really intuitive and the sentiment analysis helps us track our brand reputation effectively. Check out the full review!",
  "permalink": "https://www.youtube.com/watch?v=abc123xyz789",
  "publishedAt": "2024-11-15T16:45:00Z",
  "reach": 12500
}
```

### Example 4: Neutral News Article
```json
{
  "sourceName": "TechCrunch",
  "channel": "news",
  "author": "John Smith",
  "body": "BrandWatch, a leading brand monitoring platform, announced today that it has raised $50M in Series B funding. The company plans to expand its AI-powered sentiment analysis capabilities and enter new markets.",
  "permalink": "https://techcrunch.com/2024/11/15/brandwatch-funding",
  "publishedAt": "2024-11-15T09:00:00Z",
  "sourceUrl": "https://techcrunch.com",
  "reach": 45000
}
```

### Example 4: Positive Blog Post
```json
{
  "sourceName": "Marketing Insights Blog",
  "channel": "blog",
  "author": "Emily Chen",
  "body": "After 3 months of using BrandWatch, I can confidently say it's transformed how we monitor our brand reputation. The real-time alerts and sentiment tracking have helped us respond to customer concerns 3x faster. The dashboard is intuitive and the API integration was seamless.",
  "permalink": "https://marketinginsights.com/brandwatch-review",
  "publishedAt": "2024-11-15T11:20:00Z",
  "sourceUrl": "https://marketinginsights.com",
  "reach": 12000
}
```

### Example 5: Positive Forum Post with Source URL
```json
{
  "sourceName": "HackerNews",
  "channel": "forum",
  "sourceUrl": "https://news.ycombinator.com",
  "author": "startup_founder",
  "body": "We've been using BrandWatch for 6 months and it's been a game-changer for our startup. The real-time alerts helped us catch a potential PR crisis early. The sentiment analysis is incredibly accurate. Highly recommend for any company serious about brand monitoring!",
  "permalink": "https://news.ycombinator.com/item?id=12345678",
  "publishedAt": "2024-11-15T19:30:00Z",
  "reach": 8500
}
```

### Example 6: Neutral YouTube Comment
```json
{
  "sourceName": "YouTube",
  "channel": "youtube",
  "author": "TechReviewer",
  "handle": "@techreviewer",
  "body": "I'm curious about the pricing plans. Can someone share their experience with the enterprise tier?",
  "permalink": "https://youtube.com/watch?v=xyz123&lc=abc456",
  "publishedAt": "2024-11-15T16:45:00Z",
  "reach": 1500
}
```

### Example 7: Negative Forum Post
```json
{
  "sourceName": "ProductHunt",
  "channel": "forum",
  "author": "StartupFounder",
  "body": "We tried BrandWatch for our startup but had to cancel. The pricing is too high for small teams, and the free tier is very limited. The features are great, but not accessible for bootstrapped companies.",
  "permalink": "https://producthunt.com/posts/brandwatch",
  "publishedAt": "2024-11-15T13:30:00Z",
  "reach": 8500
}
```

### Example 8: Positive Twitter Mention (High Reach)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "Tech Influencer",
  "handle": "@techinfluencer",
  "body": "BrandWatch's new AI features are game-changing! The automatic topic detection and sentiment analysis saved us hours of manual work. If you're in marketing, you need this tool. #MarketingTech #AI",
  "permalink": "https://twitter.com/techinfluencer/status/9876543210",
  "publishedAt": "2024-11-15T15:00:00Z",
  "reach": 125000
}
```

### Example 9: Neutral News Article (Recent)
```json
{
  "sourceName": "The Verge",
  "channel": "news",
  "author": "Alex Johnson",
  "body": "BrandWatch has updated its platform with new features including real-time competitor monitoring and automated alert systems. The company reports a 40% increase in user engagement since the update.",
  "permalink": "https://theverge.com/2024/11/15/brandwatch-update",
  "publishedAt": "2024-11-15T17:00:00Z",
  "sourceUrl": "https://theverge.com",
  "reach": 68000
}
```

### Example 10: Positive Reddit Comment
```json
{
  "sourceName": "Reddit",
  "channel": "reddit",
  "author": "u/happy_customer",
  "handle": "u/happy_customer",
  "body": "Been using BrandWatch for 6 months now. The customer support is excellent - they actually listen to feedback and implement features we request. The sentiment tracking is spot-on and helps us catch issues before they escalate.",
  "permalink": "https://reddit.com/r/marketing/comments/def456/brandwatch_review",
  "publishedAt": "2024-11-15T10:30:00Z",
  "reach": 2100
}
```

### Example 11: Negative Twitter Mention (Urgent)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "Frustrated User",
  "handle": "@frustrateduser",
  "body": "@BrandWatch Your service has been down for 4 hours now. This is affecting our entire marketing campaign. When will this be fixed? We're losing customers because of this!",
  "permalink": "https://twitter.com/frustrateduser/status/1112223334",
  "publishedAt": "2024-11-15T18:00:00Z",
  "reach": 12000
}
```

### Example 12: Positive Blog Review with Source URL
```json
{
  "sourceName": "Tech Blog Pro",
  "channel": "blog",
  "sourceUrl": "https://techblogpro.com",
  "author": "David Kim",
  "body": "BrandWatch exceeded all my expectations! The dashboard is beautifully designed and incredibly user-friendly. We've seen a 200% improvement in our response time to brand mentions. The sentiment analysis is spot-on, and the competitor tracking feature is a game-changer. This tool has become essential for our marketing team. Five stars!",
  "permalink": "https://techblogpro.com/reviews/brandwatch-2024-review",
  "publishedAt": "2024-11-15T20:15:00Z",
  "reach": 18500
}
```

---

image.png## ⚠️ Important: 24-Hour Filter

The dashboard shows **"MENTIONS (24H)"** which only counts mentions from the **last 24 hours**. 

**To see your mentions on the dashboard:**
- Use a `publishedAt` date that is **within the last 24 hours** from the current time
- Example: If it's currently `2024-11-16T10:00:00Z`, use dates like:
  - `2024-11-16T09:00:00Z` (1 hour ago) ✅
  - `2024-11-15T11:00:00Z` (23 hours ago) ✅
  - `2024-11-15T09:00:00Z` (25 hours ago) ❌ Won't show in 24h stats

**Quick Fix:** Use the current date/time or a time within the last 24 hours:

```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "Recent User",
  "handle": "@recentuser",
  "body": "Just discovered BrandWatch and it's amazing! The real-time monitoring is exactly what we needed.",
  "permalink": "https://twitter.com/recentuser/status/9999999999",
  "publishedAt": "2024-11-16T10:00:00Z",
  "reach": 5000
}
```

**Note:** Replace `2024-11-16T10:00:00Z` with the current date/time when you're testing.

---

## How to Use in Postman

1. **Create a new request**
2. **Set method to** `POST`
3. **Enter URL:** `http://192.168.195.1:3000/api/ingest`
4. **Go to Headers tab:**
   - Add: `Content-Type` = `application/json`
5. **Go to Body tab:**
   - Select `raw`
   - Choose `JSON` from dropdown
   - Paste one of the JSON examples above
6. **Click Send**
7. **Expected Response:**
   ```json
   {
     "success": true
   }
   ```

---

## Channel Types

Valid `channel` values:
- `twitter` - Twitter/X posts
- `reddit` - Reddit posts/comments
- `news` - News articles
- `blog` - Blog posts
- `youtube` - YouTube comments/videos
- `forum` - Forum posts (ProductHunt, HackerNews, etc.)

---

## Sentiment Analysis

The system automatically analyzes sentiment:
- **Positive**: Words like "amazing", "love", "great", "recommend", "excellent"
- **Negative**: Words like "terrible", "frustrated", "issues", "problems", "disappointed"
- **Neutral**: Informational content without strong emotion

If you have `OPENAI_API_KEY` set, it uses AI for more accurate sentiment analysis. Otherwise, it uses keyword-based analysis.

---

## Tips

1. **Use current timestamps**: Set `publishedAt` to recent dates to see them appear in the dashboard
2. **Vary reach values**: Higher reach mentions will appear more prominently
3. **Mix sentiments**: Add both positive and negative mentions to see the sentiment trend chart update
4. **Use different channels**: Add mentions from various channels to see the source breakdown update
5. **Check the dashboard**: After adding mentions, refresh the dashboard to see them appear

---

## Troubleshooting

**Error: "Missing required fields"**
- Make sure all required fields are present: `sourceName`, `channel`, `author`, `body`, `permalink`, `publishedAt`

**Error: "Invalid channel"**
- Use one of the valid channel types: `twitter`, `reddit`, `news`, `blog`, `youtube`, `forum`

**Mentions not appearing on dashboard**
- Check that `publishedAt` is within the last 24 hours for stats
- Refresh the dashboard page
- Check the browser console for errors

---

## Quick Test

Try this minimal example to test the endpoint:

```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "Test User",
  "body": "Testing BrandWatch mention ingestion!",
  "permalink": "https://twitter.com/test/status/123",
  "publishedAt": "2024-11-15T20:00:00Z"
}
```

---

## Adding Data for "Last 90 Days" Filter

To test the "Last 90 days" filter, you need to add mentions with dates spread across the past 90 days. Here are examples with dates going back in time:

### Example: 90 Days Ago (Positive)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "Early Adopter",
  "handle": "@earlyadopter",
  "body": "Just started using BrandWatch 3 months ago. The platform has been amazing for tracking our brand mentions. Love the sentiment analysis feature!",
  "permalink": "https://twitter.com/earlyadopter/status/1111111111",
  "publishedAt": "2024-08-17T10:00:00Z",
  "reach": 3200
}
```

### Example: 60 Days Ago (Neutral)
```json
{
  "sourceName": "Reddit",
  "channel": "reddit",
  "author": "u/marketing_pro",
  "handle": "u/marketing_pro",
  "body": "BrandWatch released a new update with improved dashboard features. The interface now includes better chart visualizations and export options.",
  "permalink": "https://reddit.com/r/marketing/comments/abc123/brandwatch_update",
  "publishedAt": "2024-09-16T14:30:00Z",
  "reach": 1800
}
```

### Example: 45 Days Ago (Negative)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "Frustrated User",
  "handle": "@frustrateduser",
  "body": "Having issues with BrandWatch API rate limits. Getting throttled too frequently. Support needs to address this soon.",
  "permalink": "https://twitter.com/frustrateduser/status/2222222222",
  "publishedAt": "2024-10-01T09:15:00Z",
  "reach": 4500
}
```

### Example: 30 Days Ago (Positive)
```json
{
  "sourceName": "Blog",
  "channel": "blog",
  "author": "Tech Reviewer",
  "body": "After using BrandWatch for a month, I can confidently say it's one of the best brand monitoring tools available. The real-time alerts and sentiment tracking are top-notch!",
  "permalink": "https://techreviewer.com/brandwatch-review-month-1",
  "publishedAt": "2024-10-16T11:00:00Z",
  "sourceUrl": "https://techreviewer.com",
  "reach": 15000
}
```

### Example: 20 Days Ago (Neutral)
```json
{
  "sourceName": "News",
  "channel": "news",
  "author": "Business Reporter",
  "body": "BrandWatch announced a partnership with major social media platforms to enhance data collection capabilities. The integration will provide more comprehensive brand monitoring.",
  "permalink": "https://businessnews.com/brandwatch-partnership",
  "publishedAt": "2024-10-26T08:00:00Z",
  "sourceUrl": "https://businessnews.com",
  "reach": 25000
}
```

### Example: 10 Days Ago (Positive)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "Happy Customer",
  "handle": "@happycustomer",
  "body": "BrandWatch's new AI features are incredible! The automatic topic detection is so accurate. This tool has become essential for our marketing team. Highly recommend! 🚀",
  "permalink": "https://twitter.com/happycustomer/status/3333333333",
  "publishedAt": "2024-11-05T16:45:00Z",
  "reach": 9200
}
```

### Example: 5 Days Ago (Negative)
```json
{
  "sourceName": "Reddit",
  "channel": "reddit",
  "author": "u/concerned_user",
  "handle": "u/concerned_user",
  "body": "BrandWatch's pricing increased significantly. The new plans are too expensive for small businesses. Disappointed with this change.",
  "permalink": "https://reddit.com/r/smallbusiness/comments/def456/brandwatch_pricing",
  "publishedAt": "2024-11-10T13:20:00Z",
  "reach": 2800
}
```

### Example: 2 Days Ago (Positive)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "Marketing Director",
  "handle": "@marketingdir",
  "body": "BrandWatch helped us catch a negative sentiment spike before it became a crisis. The alert system is fantastic! Worth every penny.",
  "permalink": "https://twitter.com/marketingdir/status/4444444444",
  "publishedAt": "2024-11-13T10:30:00Z",
  "reach": 15600
}
```

### Example: Today (Neutral)
```json
{
  "sourceName": "News",
  "channel": "news",
  "author": "Tech Journalist",
  "body": "BrandWatch released its Q4 product roadmap. The company plans to introduce advanced analytics features and expand API capabilities in the coming months.",
  "permalink": "https://techjournal.com/brandwatch-roadmap-q4",
  "publishedAt": "2024-11-15T09:00:00Z",
  "sourceUrl": "https://techjournal.com",
  "reach": 18000
}
```

## Quick Script to Generate 90 Days of Data

You can use this approach to generate mentions for each week over the past 90 days:

**Week 1 (90 days ago):**
- Change `publishedAt` to: `"2024-08-17T10:00:00Z"`

**Week 2 (83 days ago):**
- Change `publishedAt` to: `"2024-08-24T10:00:00Z"`

**Week 3 (76 days ago):**
- Change `publishedAt` to: `"2024-08-31T10:00:00Z"`

...and so on, incrementing by 7 days each time.

**Or use this formula:**
- Today: `2024-11-15`
- 90 days ago: `2024-08-17`
- For each week: Add 7 days to the previous date

## Tips for Testing 90 Days Filter

1. **Add mentions with dates spread across the period:**
   - Add some from 90 days ago
   - Add some from 60 days ago
   - Add some from 30 days ago
   - Add some from recent days

2. **Vary the sentiments:**
   - Mix positive, negative, and neutral mentions
   - This will make the chart more interesting

3. **Use different channels:**
   - Add mentions from Twitter, Reddit, News, Blog, etc.
   - This shows the source breakdown

4. **After adding data:**
   - Go to dashboard
   - Click "Last 7 days" dropdown
   - Select "Last 90 days"
   - The chart should update showing weekly data points

## Date Calculator

To calculate dates for the past 90 days:
- **Today:** November 15, 2024
- **90 days ago:** August 17, 2024
- **60 days ago:** September 16, 2024
- **30 days ago:** October 16, 2024
- **7 days ago:** November 8, 2024

Use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`

