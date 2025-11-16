## Brand Watch – RapidQuest Hackathon Build

Brand Watch is a comprehensive marketing intelligence platform that implements **all 4 challenges** from the RapidQuest Hiring Hackathon (Nov 14–16, 2025). The platform provides real-time brand monitoring, competitor tracking, query management, and knowledge discovery capabilities. [Challenge brief](https://rapidquest.in/hackathon-nov-25)

### 🎯 Challenges Implemented

#### Challenge 1: Brand Mention & Reputation Tracker ✅
✅ **Real-time Dashboard** – Live KPIs, sentiment trends, source breakdown, and mention feed  
✅ **Sentiment Analysis** – OpenAI API integration with keyword-based fallback  
✅ **Topic Classification** – Automatic topic extraction from mentions  
✅ **Spike Detection** – Automatic alert generation for unusual activity spikes  
✅ **Data Ingestion API** – REST endpoint to ingest mentions from any source  
✅ **CSV Export** – Export mentions data to CSV format

#### Challenge 2: Competitive Landscape Monitoring ✅
✅ **Competitor Update Ingestion** – Automatic competitor update tracking  
✅ **Auto-Classification** – Classifies updates (pricing, campaign, release, etc.)  
✅ **Trend Detection** – Identifies patterns and frequency trends  
✅ **Impact Assessment** – Automatically assesses impact levels  
✅ **Insights Dashboard** – Visual dashboard with KPIs and trend charts

#### Challenge 3: Audience Query Management ✅
✅ **Unified Inbox** – Single interface for all channels (Email, Twitter, Reddit, etc.)  
✅ **Auto-Tagging** – Automatic tag detection (question, request, complaint, etc.)  
✅ **Priority Detection** – Automatic priority assessment and escalation  
✅ **Status Tracking** – Complete assignment and status workflow  
✅ **Analytics Dashboard** – Response time metrics and query breakdowns

#### Challenge 4: Knowledge Discovery & Internal Search ✅
✅ **Document Indexing** – Index PDFs, DOCX, TXT, Markdown, and more  
✅ **Smart Search** – Full-text search across title, description, and content  
✅ **Auto-Categorization** – Automatic categorization by topic/project/team  
✅ **Document Preview** – Preview and direct file access  
✅ **Advanced Filters** – Filter by file type, team, project, category

### ✨ Core Features

✅ **PostgreSQL Integration** – Full database schema with Prisma ORM  
✅ **Responsive UI** – Modern dashboards built with Next.js 16 and Tailwind CSS  
✅ **Real-time Updates** – Auto-refresh functionality across all dashboards

### 🗺️ Architecture

- **Ingestion Layer** – `/api/ingest` endpoint accepts mentions and processes them
- **Processing Layer** – Sentiment analysis, topic extraction, spike detection, alert creation
- **Experience Layer** – Next.js App Router dashboard with server-side data fetching
- **Database** – PostgreSQL with Prisma for data persistence

### 🧱 Tech Stack

| Area        | Choice                          |
|------------|---------------------------------|
| Runtime     | Next.js 16 (App Router)        |
| UI          | Tailwind CSS + Lucide Icons     |
| State/Data  | Server Components + Prisma      |
| Database    | PostgreSQL via Prisma           |
| Intelligence| OpenAI API (with keyword fallback) |
| Charts      | Recharts                        |

### 📁 Project Structure

```
brand-watch/
  src/
    app/
      (marketing)/
        dashboard/            # Challenge 1: Brand Mentions
        competitors/          # Challenge 2: Competitor Monitoring
        inbox/                # Challenge 3: Query Management
        library/              # Challenge 4: Document Search
        settings/             # App Settings
      api/
        ingest/               # Challenge 1: Ingest mentions
        mentions/             # Challenge 1: Get mentions
        stats/                # Challenge 1: Statistics
        sentiment-trend/      # Challenge 1: Sentiment trends
        source-breakdown/     # Challenge 1: Source breakdown
        alerts/               # Challenge 1: Alerts
        competitors/          # Challenge 2: Competitor APIs
        queries/              # Challenge 3: Query APIs
        documents/            # Challenge 4: Document APIs
    components/
      layout/                 # AppShell, Sidebar, TopNav
      charts/                 # SentimentTrend, SourceBreakdown
      mentions/               # MentionTable, MentionCard
      competitors/            # Competitor components
      queries/                # Query components
      documents/              # Document components
      dashboard/              # Dashboard widgets
    lib/
      ingestion/              # Challenge 1: Processing logic
      competitor/             # Challenge 2: Competitor logic
      query/                  # Challenge 3: Query logic
      document/               # Challenge 4: Document logic
      data/                   # Server-side data fetching
      utils/                  # Utility functions (CSV export, etc.)
  prisma/
    schema.prisma             # Unified database schema
    seed.ts                   # Seed script
  scripts/
    ingest-sample.ts          # Challenge 1: Sample data
    ingest-competitor-sample.ts  # Challenge 2: Sample data
    ingest-query-sample.ts    # Challenge 3: Sample data
    ingest-document-sample.ts # Challenge 4: Sample data
```

### 🚀 Getting Started

#### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)

#### Setup Steps

1. **Clone and install dependencies:**
   ```bash
   cd brand-watch
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/brand_watch?schema=public"
   OPENAI_API_KEY="sk-..." # Optional, falls back to keyword analysis if not provided
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # Seed initial data
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` (auto-redirects to `/dashboard`)

### 🗺️ Dashboard Routes

All challenges are accessible via the sidebar navigation:

- **`/dashboard`** – Challenge 1: Brand Mention & Reputation Tracker
- **`/competitors`** – Challenge 2: Competitive Landscape Monitoring
- **`/inbox`** – Challenge 3: Audience Query Management
- **`/inbox/analytics`** – Challenge 3: Query Analytics Dashboard
- **`/library`** – Challenge 4: Knowledge Discovery & Document Search
- **`/settings`** – Application Settings

### 📡 API Endpoints

**Base URL:** 
- Local development: `http://localhost:3000`
- Network access: `http://192.168.195.1:3000` (or your server IP)
- Production: `https://your-domain.com`

> 📚 **For detailed Postman examples with full request/response samples, see:**
> - `POSTMAN_MENTIONS.md` - Challenge 1 API examples
> - `POSTMAN_INBOX_QUERIES.md` - Challenge 3 API examples  
> - `POSTMAN_DOCUMENTS.md` - Challenge 4 API examples

#### Challenge 1: Brand Mentions
```bash
# Ingest a mention
POST http://localhost:3000/api/ingest
Content-Type: application/json

{
  "sourceName": "X (Twitter)",
  "channel": "twitter",
  "author": "John Doe",
  "handle": "@johndoe",
  "body": "BrandWatch is amazing!",
  "permalink": "https://twitter.com/johndoe/status/123",
  "publishedAt": "2025-11-15T10:00:00Z",
  "reach": 5000
}

# Get mentions (with search/filters)
GET http://localhost:3000/api/mentions?q=search&channel=twitter&sentiment=positive&limit=50

# Get statistics
GET http://localhost:3000/api/stats

# Get sentiment trend
GET http://localhost:3000/api/sentiment-trend

# Get source breakdown
GET http://localhost:3000/api/source-breakdown

# Get alerts
GET http://localhost:3000/api/alerts
```

#### Challenge 2: Competitor Monitoring
```bash
# Ingest competitor update
POST http://localhost:3000/api/competitors/ingest
Content-Type: application/json

{
  "competitorName": "CompetitorX",
  "title": "New Pricing Model",
  "description": "CompetitorX announced new pricing",
  "channel": "news",
  "publishedAt": "2025-11-15T10:00:00Z"
}

# Get all competitors
GET http://localhost:3000/api/competitors

# Get competitor updates
GET http://localhost:3000/api/competitors/updates?limit=10

# Get trends
GET http://localhost:3000/api/competitors/trends
```

#### Challenge 3: Query Management
```bash
# Ingest a query
POST http://localhost:3000/api/queries/ingest
Content-Type: application/json

{
  "channel": "email",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "subject": "Urgent: Payment Issue",
  "body": "I need help with my payment"
}

# Get queries (with filters)
GET http://localhost:3000/api/queries?status=NEW&priority=URGENT&channel=email

# Assign query
POST http://localhost:3000/api/queries/[id]/assign
Content-Type: application/json
{ "userId": "user-id" }

# Update status
POST http://localhost:3000/api/queries/[id]/status
Content-Type: application/json
{ "status": "in_progress" }

# Get analytics
GET http://localhost:3000/api/queries/analytics?days=30
```

#### Challenge 4: Document Search
```bash
# Index a document
POST http://localhost:3000/api/documents/index
Content-Type: application/json

{
  "title": "Monthly Report",
  "description": "November metrics",
  "content": "Full document content...",
  "fileType": "PDF",
  "team": "Marketing"
}

# Search documents
GET http://localhost:3000/api/documents/search?q=report&fileType=PDF&team=Marketing

# Get document by ID
GET http://localhost:3000/api/documents/[id]

# Get categories
GET http://localhost:3000/api/documents/categories
```

### 🔄 Data Ingestion

#### Challenge 1: Brand Mentions
```bash
# Option 1: Using the API
POST /api/ingest with mention data

# Option 2: Using the sample script
npm run ingest:sample
```

#### Challenge 2: Competitor Updates
```bash
npm run ingest:competitor
```

#### Challenge 3: Audience Queries
```bash
npm run ingest:query
```

#### Challenge 4: Documents
```bash
npm run ingest:document
```

### 🗄️ Database Schema

**Challenge 1: Brand Mentions**
- `Source` – Social media/news sources (Twitter, Reddit, News, etc.)
- `Mention` – Individual brand mentions with sentiment, reach, topics
- `Topic` – Categorized topics (pricing, support, AI, etc.)
- `Alert` – Generated alerts for spikes and anomalies

**Challenge 2: Competitor Monitoring**
- `Competitor` – Tracked competitors
- `CompetitorUpdate` – Individual competitor updates with classification

**Challenge 3: Query Management**
- `Query` – Main query/message entity
- `QueryTag` – Tag definitions (Question, Request, Complaint, etc.)
- `QueryAssignment` – Assignment tracking
- `QueryHistory` – Complete audit trail

**Challenge 4: Document Management**
- `Document` – Document entity with content and metadata
- `DocumentCategory` – Category definitions (Topic, Project, Team, etc.)

**Shared**
- `User` – User accounts (for future auth)

### 🚀 Deployment

#### Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repo to Vercel
   - Add environment variables:
     - `DATABASE_URL` – Your PostgreSQL connection string
     - `OPENAI_API_KEY` – (Optional) Your OpenAI API key
   - Deploy!

3. **Set up PostgreSQL:**
   - Use Vercel Postgres, Supabase, or Neon for managed PostgreSQL
   - Run migrations: `npx prisma migrate deploy` (or use Vercel's build command)

#### Build Command for Vercel
Add to `package.json` or Vercel settings:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### ✅ Hackathon Requirements Checklist

**Challenge 1: Brand Mention & Reputation Tracker**
- [x] Aggregation of mentions from various sources
- [x] Sentiment analysis (positive/negative/neutral)
- [x] Topic clustering and categorization
- [x] Alerts for conversation spikes
- [x] Real-time monitoring dashboard

**Challenge 2: Competitive Landscape Monitoring**
- [x] Automatic competitor update ingestion
- [x] Update classification (pricing, campaign, release, etc.)
- [x] Trend detection and pattern analysis
- [x] High-impact action notifications
- [x] Insights dashboard for decision-making

**Challenge 3: Audience Query Management**
- [x] Unified inbox for all audience channels
- [x] Auto-tagging (question, request, complaint, etc.)
- [x] Priority detection and escalation
- [x] Assignment, status tracking, and history
- [x] Analytics on response times & query types

**Challenge 4: Knowledge Discovery & Internal Search**
- [x] Index internal documents and digital assets
- [x] Smart search across multiple formats
- [x] Automatic categorization by topic/project/team
- [x] Preview or link directly to files
- [x] Clean UI optimized for quick access

**Submission Requirements**
- [x] All 4 challenges fully implemented
- [x] Working Demo URL – Ready for deployment
- [x] GitHub Repository – Code ready for public repo
- [ ] Demo Video – To be created (5-10 minutes)

### 🎯 Key Decisions & Approach

1. **Server Components** – Used Next.js server components for direct database access (better performance)
2. **OpenAI with Fallback** – Sentiment analysis uses OpenAI when available, falls back to keyword matching
3. **Spike Detection** – Compares last hour to 23-hour average, triggers alerts at 3x threshold
4. **Topic Extraction** – Keyword-based topic matching (can be enhanced with NLP)
5. **Database-First** – All data flows through PostgreSQL for consistency

### 📝 Notes

- All dashboards use Next.js server components for direct database access (better performance)
- API routes are available for external integrations or future client-side features
- Sentiment analysis works without OpenAI API key (uses keyword matching)
- Spike detection runs asynchronously after each ingestion
- All challenges share a unified PostgreSQL database with Prisma ORM
- CSV export functionality available for mentions data
- Auto-classification works across all challenges (sentiment, topics, tags, categories)

### 🤝 Contributing

This is a hackathon submission. For questions or improvements, please open an issue or PR.

---

**Built for RapidQuest Hiring Hackathon (Nov 14-16, 2025)**
"# Brand-Mention1" 
"# Brand-Mention1" 
"# Brand-Mention1" 
"# Brand-Mention12" 
"# Brand-Mention12" 
"# Brand-Mention12" 
"# Brand-Mention18" 
"# Brand-Mention18" 
"# Brand-Mention18" 
"# Brand-Mention18" 
