# Generate 90 Days of Test Data

To see the "Last 90 days" chart properly, you need mentions spread across **multiple weeks**. Here's a quick guide to generate test data:

## Quick Method: Use These Dates

Copy and paste these JSON payloads into Postman, one at a time:

### Week 1 (90 days ago - August 19, 2024)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "User 1",
  "body": "Week 1: Testing BrandWatch sentiment tracking. Great tool!",
  "permalink": "https://twitter.com/user1/status/w1-1",
  "publishedAt": "2024-08-19T10:00:00Z",
  "reach": 1000
}
```

### Week 2 (83 days ago - August 26, 2024)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "User 2",
  "body": "Week 2: BrandWatch is helping us track mentions effectively.",
  "permalink": "https://twitter.com/user2/status/w2-1",
  "publishedAt": "2024-08-26T10:00:00Z",
  "reach": 1200
}
```

### Week 3 (76 days ago - September 2, 2024)
```json
{
  "sourceName": "Reddit",
  "channel": "reddit",
  "author": "u/user3",
  "body": "Week 3: Having some issues with BrandWatch API rate limits.",
  "permalink": "https://reddit.com/r/test/comments/w3-1",
  "publishedAt": "2024-09-02T10:00:00Z",
  "reach": 800
}
```

### Week 4 (69 days ago - September 9, 2024)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "User 4",
  "body": "Week 4: BrandWatch's new features are amazing! Love the dashboard.",
  "permalink": "https://twitter.com/user4/status/w4-1",
  "publishedAt": "2024-09-09T10:00:00Z",
  "reach": 1500
}
```

### Week 5 (62 days ago - September 16, 2024)
```json
{
  "sourceName": "Blog",
  "channel": "blog",
  "author": "Blogger",
  "body": "Week 5: Review of BrandWatch - comprehensive brand monitoring solution.",
  "permalink": "https://blog.com/brandwatch-review-w5",
  "publishedAt": "2024-09-16T10:00:00Z",
  "reach": 5000
}
```

### Week 6 (55 days ago - September 23, 2024)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "User 5",
  "body": "Week 6: BrandWatch helped us catch a negative sentiment spike early!",
  "permalink": "https://twitter.com/user5/status/w6-1",
  "publishedAt": "2024-09-23T10:00:00Z",
  "reach": 2000
}
```

### Week 7 (48 days ago - September 30, 2024)
```json
{
  "sourceName": "News",
  "channel": "news",
  "author": "Reporter",
  "body": "Week 7: BrandWatch announces partnership with major platforms.",
  "permalink": "https://news.com/brandwatch-partnership",
  "publishedAt": "2024-09-30T10:00:00Z",
  "reach": 10000
}
```

### Week 8 (41 days ago - October 7, 2024)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "User 6",
  "body": "Week 8: Disappointed with BrandWatch pricing changes. Too expensive now.",
  "permalink": "https://twitter.com/user6/status/w8-1",
  "publishedAt": "2024-10-07T10:00:00Z",
  "reach": 1800
}
```

### Week 9 (34 days ago - October 14, 2024)
```json
{
  "sourceName": "Reddit",
  "channel": "reddit",
  "author": "u/user7",
  "body": "Week 9: BrandWatch's sentiment analysis is very accurate. Impressed!",
  "permalink": "https://reddit.com/r/test/comments/w9-1",
  "publishedAt": "2024-10-14T10:00:00Z",
  "reach": 900
}
```

### Week 10 (27 days ago - October 21, 2024)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "User 8",
  "body": "Week 10: Using BrandWatch for 2 months now. Best investment we made!",
  "permalink": "https://twitter.com/user8/status/w10-1",
  "publishedAt": "2024-10-21T10:00:00Z",
  "reach": 2500
}
```

### Week 11 (20 days ago - October 28, 2024)
```json
{
  "sourceName": "Blog",
  "channel": "blog",
  "author": "Reviewer",
  "body": "Week 11: BrandWatch comparison with competitors - comes out on top.",
  "permalink": "https://blog.com/brandwatch-comparison",
  "publishedAt": "2024-10-28T10:00:00Z",
  "reach": 6000
}
```

### Week 12 (13 days ago - November 4, 2024)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "User 9",
  "body": "Week 12: BrandWatch's real-time alerts saved us from a PR crisis!",
  "permalink": "https://twitter.com/user9/status/w12-1",
  "publishedAt": "2024-11-04T10:00:00Z",
  "reach": 3000
}
```

### Week 13 (6 days ago - November 11, 2024)
```json
{
  "sourceName": "News",
  "channel": "news",
  "author": "Journalist",
  "body": "Week 13: BrandWatch releases Q4 roadmap with exciting new features.",
  "permalink": "https://news.com/brandwatch-roadmap",
  "publishedAt": "2024-11-11T10:00:00Z",
  "reach": 8000
}
```

### This Week (Today - November 15, 2024)
```json
{
  "sourceName": "Twitter",
  "channel": "twitter",
  "author": "User 10",
  "body": "This week: BrandWatch continues to impress with regular updates!",
  "permalink": "https://twitter.com/user10/status/w14-1",
  "publishedAt": "2024-11-15T10:00:00Z",
  "reach": 2200
}
```

## How to Use

1. **Open Postman**
2. **Set up request:**
   - Method: `POST`
   - URL: `http://192.168.195.1:3000/api/ingest`
   - Headers: `Content-Type: application/json`
3. **Copy each JSON above** (one at a time)
4. **Paste into Body** (raw, JSON)
5. **Click Send**
6. **Repeat** for all 14 weeks

## After Adding Data

1. Go to dashboard: `http://192.168.195.1:3000/dashboard`
2. Click "Last 7 days" dropdown
3. Select "Last 90 days"
4. You should now see **13-14 data points** (one per week) instead of just 3 dots!

## Why You See Only 3 Dots

The three dots you're seeing are:
- **Green dot** = Positive sentiment percentage
- **Red dot** = Negative sentiment percentage  
- **Gray dot** = Neutral sentiment percentage

But they're all for **one week** because all your mentions have dates from the same week. Once you add mentions across multiple weeks, you'll see a proper trend line with multiple data points!

## Quick Test (Minimal)

If you want to test quickly, just add these 3 mentions from different weeks:

**Week 1:**
```json
{"sourceName":"Twitter","channel":"twitter","author":"Test","body":"Week 1 test","permalink":"https://twitter.com/test/w1","publishedAt":"2024-08-19T10:00:00Z"}
```

**Week 5:**
```json
{"sourceName":"Twitter","channel":"twitter","author":"Test","body":"Week 5 test","permalink":"https://twitter.com/test/w5","publishedAt":"2024-09-16T10:00:00Z"}
```

**Week 10:**
```json
{"sourceName":"Twitter","channel":"twitter","author":"Test","body":"Week 10 test","permalink":"https://twitter.com/test/w10","publishedAt":"2024-10-21T10:00:00Z"}
```

This will give you 3 data points on the chart!

