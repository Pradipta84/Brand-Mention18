# Postman Guide: Document Library API

**Challenge 4: Knowledge Discovery & Internal Search**

This guide provides example JSON payloads for indexing documents in the Document Library using Postman.

---

## 📡 API Endpoint

**Base URL:** `http://192.168.195.1:3000` (or your server URL)

**Index Document:**
- **Method:** `POST`
- **URL:** `http://192.168.195.1:3000/api/documents/index`
- **Headers:**
  ```
  Content-Type: application/json
  ```

**Search Documents:**
- **Method:** `GET`
- **URL:** `http://192.168.195.1:3000/api/documents/search?q=marketing&team=Marketing`

---

## 📋 Required Fields

- `title` (string, required) - Document title
- `fileType` (string, required) - File type (see supported types below)

## 📋 Optional Fields

- `description` (string) - Document description
- `content` (string) - Document content/text
- `fileUrl` (string) - **URL to the actual file** (must be a valid, accessible URL)
- `fileSize` (number) - File size in bytes
- `mimeType` (string) - MIME type (e.g., "application/pdf")
- `author` (string) - Document author
- `team` (string) - Team name (auto-detected if not provided)
- `project` (string) - Project name (auto-detected if not provided)
- `tags` (string[]) - Array of tags

### ⚠️ Important Note About File URLs

The `fileUrl` field should point to an **actual, accessible file** on your server or cloud storage (e.g., AWS S3, Google Cloud Storage, Azure Blob Storage, or your own file server).

**Examples of valid file URLs:**
- `https://storage.yourcompany.com/documents/report-2025.pdf`
- `https://s3.amazonaws.com/your-bucket/documents/file.xlsx`
- `https://your-server.com/files/document.docx`
- `http://192.168.195.1:3000/uploads/document.pdf` (for local files)

**Note:** The example URLs in this guide (like `https://storage.brandwatch.com/...`) are **placeholders**. Replace them with your actual file storage URLs. If you don't have a file URL, you can omit the `fileUrl` field - the document will still be indexed and searchable, but the "Open File" button will show as unavailable.

**Smart Detection:** The Document Library automatically detects placeholder URLs (like `example.com`, `your-storage-server.com`) and will:
- Show a warning message explaining the URL is a placeholder
- Display the full document content prominently
- Provide instructions on how to use a real file URL
- Still allow you to view all document metadata and content

---

## 📁 How to Use Real File URLs

### Option 1: Local File Server (Simplest for Testing)

If you want to serve files from your local development server:

1. **Create an uploads directory:**
   ```bash
   mkdir -p brand-watch/public/uploads
   ```

2. **Place your files in the uploads folder:**
   ```
   brand-watch/public/uploads/
   ├── performance-nov-2025.xlsx
   ├── marketing-strategy-2025.pdf
   └── ...
   ```

3. **Use the local URL in Postman:**
   ```json
   {
     "fileUrl": "http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx"
   }
   ```

   **Note:** Files in the `public` folder are automatically served by Next.js at the root URL.

### Option 2: Cloud Storage Services

#### A. AWS S3

1. **Upload file to S3 bucket:**
   - Go to AWS S3 Console
   - Create or select a bucket
   - Upload your file
   - Make the file public (or use signed URLs)

2. **Get the file URL:**
   ```
   https://your-bucket-name.s3.amazonaws.com/documents/performance-nov-2025.xlsx
   ```
   or
   ```
   https://s3.amazonaws.com/your-bucket-name/documents/performance-nov-2025.xlsx
   ```

3. **Use in Postman:**
   ```json
   {
     "fileUrl": "https://your-bucket-name.s3.amazonaws.com/documents/performance-nov-2025.xlsx"
   }
   ```

#### B. Google Cloud Storage

1. **Upload file to GCS bucket:**
   - Go to Google Cloud Console
   - Create or select a bucket
   - Upload your file
   - Make it publicly accessible

2. **Get the file URL:**
   ```
   https://storage.googleapis.com/your-bucket-name/documents/performance-nov-2025.xlsx
   ```

3. **Use in Postman:**
   ```json
   {
     "fileUrl": "https://storage.googleapis.com/your-bucket-name/documents/performance-nov-2025.xlsx"
   }
   ```

#### C. Azure Blob Storage

1. **Upload file to Azure Blob:**
   - Go to Azure Portal
   - Create a storage account and container
   - Upload your file
   - Set public access level

2. **Get the file URL:**
   ```
   https://yourstorageaccount.blob.core.windows.net/container-name/documents/performance-nov-2025.xlsx
   ```

3. **Use in Postman:**
   ```json
   {
     "fileUrl": "https://yourstorageaccount.blob.core.windows.net/container-name/documents/performance-nov-2025.xlsx"
   }
   ```

### Option 3: GitHub (For Public Files)

1. **Upload file to GitHub repository:**
   - Create a repository
   - Upload your file
   - Make sure the repository is public

2. **Get the raw file URL:**
   ```
   https://raw.githubusercontent.com/username/repo-name/main/documents/performance-nov-2025.xlsx
   ```

3. **Use in Postman:**
   ```json
   {
     "fileUrl": "https://raw.githubusercontent.com/username/repo-name/main/documents/performance-nov-2025.xlsx"
   }
   ```

### Option 4: Any Public File Hosting Service

You can use any service that provides direct file links:
- **Dropbox:** Get shareable link → Change `www.dropbox.com` to `dl.dropboxusercontent.com`
- **Google Drive:** Share file → Get shareable link → Convert to direct download link
- **OneDrive:** Share file → Get direct download link
- **File hosting services:** Upload file → Get direct download URL

### Quick Test: Using a Public Test File

For quick testing, you can use publicly available files:

```json
{
  "title": "Test Document",
  "fileType": "pdf",
  "fileUrl": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "description": "Test document using a public PDF file",
  "content": "This is a test document using a publicly available PDF file for testing purposes."
}
```

### Step-by-Step: Complete Example (Local File Server)

**For Local Testing (Recommended):**

1. **Place your file:**
   ```bash
   # Copy your file to the uploads folder
   # Example: performance-nov-2025.xlsx
   # Location: brand-watch/public/uploads/performance-nov-2025.xlsx
   ```

2. **Test the URL in your browser:**
   ```
   http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx
   ```
   If it downloads/opens, you're good to go!

3. **Use in Postman:**

```json
{
  "title": "Monthly Performance Report - November 2025",
  "description": "Monthly metrics and KPIs including mentions, sentiment, engagement, and response times.",
  "content": "November 2025 Performance Report. Total Mentions: 1,234. Sentiment: Positive 65%, Neutral 20%, Negative 15%. Engagement Rate: 8.5%. Average Response Time: 2.3 hours.",
  "fileType": "xlsx",
  "fileUrl": "http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx",
  "fileSize": 345678,
  "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "author": "Analytics Team",
  "team": "Analytics",
  "project": "Monthly Reports",
  "tags": ["report", "performance", "metrics", "november"]
}
```

4. **Send POST request to:**
   ```
   http://192.168.195.1:3000/api/documents/index
   ```

5. **Verify it works:**
   - Go to `http://192.168.195.1:3000/library`
   - Find your document
   - Click on it to open the detail modal
   - Click "Open File" - your file should open/download!

**For Cloud Storage:**

1. Upload file to your cloud storage (AWS S3, Google Cloud, etc.)
2. Get the public URL
3. Replace `fileUrl` in the JSON above with your cloud storage URL
4. Follow steps 4-5 above

### Troubleshooting

- **File not opening?** Make sure the URL is publicly accessible (no authentication required)
- **404 error?** Verify the file path and URL are correct
- **CORS error?** The file server needs to allow cross-origin requests
- **File too large?** Consider using cloud storage for large files

---

## 📁 Supported File Types

The system supports these file types (case-insensitive):
- `pdf`, `docx`, `doc`, `txt`, `md`/`markdown`, `html`
- `jpg`, `jpeg`, `png`, `gif` (IMAGE)
- `xlsx`, `xls`, `csv` (SPREADSHEET)
- `pptx`, `ppt` (PRESENTATION)
- `mp4`, `mov` (VIDEO)
- `mp3`, `wav` (AUDIO)
- `other` (for any other type)

---

## 📝 Example JSON Payloads

### Example 1: Marketing Strategy Document (PDF)

```json
{
  "title": "Q4 Marketing Strategy 2025",
  "description": "Comprehensive marketing strategy document for Q4 2025 including campaign planning, budget allocation, and KPIs.",
  "content": "This document outlines our Q4 marketing strategy. Key focus areas include brand awareness campaigns, social media engagement, and content marketing. Budget allocation: 40% digital advertising, 30% content creation, 20% events, 10% tools and software. Target KPIs: 25% increase in brand awareness, 15% growth in lead generation, 10% improvement in customer engagement. Campaign Timeline: October - Brand awareness push, November - Product launch and Black Friday campaigns, December - Holiday engagement and year-end review. Channels: Social media (40% budget), Email marketing (25%), Content marketing (20%), Paid advertising (15%). Success Metrics: Brand mentions up 30%, Engagement rate target 12%, Conversion rate improvement 8%, Customer acquisition cost reduction 15%.",
  "fileType": "pdf",
  "fileUrl": "https://your-storage-server.com/documents/strategies/2025/q4-marketing-strategy-2025.pdf",
  "fileSize": 2456789,
  "mimeType": "application/pdf",
  "author": "Sarah Johnson",
  "team": "Marketing",
  "project": "Q4 Campaign",
  "tags": ["strategy", "q4", "campaign", "important", "marketing", "planning"]
}
```

**Note:** Replace `https://your-storage-server.com/...` with your actual file storage URL, or remove the `fileUrl` field if you don't have a file URL.

### Example 2: Brand Guidelines (PDF)

```json
{
  "title": "Brand Guidelines and Style Guide",
  "description": "Complete brand guidelines including logo usage, color palette, typography, and design principles.",
  "content": "Brand Guidelines Document. Our brand colors are: Primary Blue #0066CC, Secondary Green #00CC66. Typography: Headings use Inter Bold, Body text uses Inter Regular. Logo usage rules: Minimum size 24px, maintain aspect ratio, never distort. Voice and tone: Professional yet approachable, clear and concise.",
  "fileType": "pdf",
  "fileUrl": "https://example.com/documents/brand-guidelines.pdf",
  "fileSize": 1234567,
  "mimeType": "application/pdf",
  "author": "Design Team",
  "team": "Design",
  "project": "Branding",
  "tags": ["guidelines", "branding", "design", "template"]
}
```

### Example 3: Competitor Analysis (DOCX)

```json
{
  "title": "Competitor Analysis Report - TechCorp",
  "description": "Detailed analysis of competitor TechCorp's marketing strategies, pricing, and feature set.",
  "content": "Competitor Analysis: TechCorp. Pricing: $99/month for Pro plan. Key features: AI analytics, social media integration, automated reporting. Marketing channels: LinkedIn, Twitter, industry blogs. Strengths: Strong brand presence, comprehensive feature set. Weaknesses: Higher pricing, complex onboarding. Market position: #2 in category.",
  "fileType": "docx",
  "fileUrl": "https://example.com/documents/competitor-techcorp.docx",
  "fileSize": 987654,
  "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "author": "Mike Chen",
  "team": "Marketing",
  "project": "Competitor Analysis",
  "tags": ["analysis", "competitor", "research", "report"]
}
```

### Example 4: Social Media Content Calendar (Spreadsheet)

```json
{
  "title": "Social Media Content Calendar - November 2025",
  "description": "Monthly content calendar for all social media platforms including post schedules and content themes.",
  "content": "November 2025 Social Media Calendar. Week 1: Product launch announcements (Nov 1-7), Week 2: Customer success stories (Nov 8-14), Week 3: Industry insights and thought leadership (Nov 15-21), Week 4: Holiday campaigns and promotions (Nov 22-30). Platforms: Twitter (daily posts, 30 total), LinkedIn (3x/week, 12 total), Instagram (5x/week, 20 total), Facebook (3x/week, 12 total). Content Themes: Monday - Motivational quotes, Tuesday - Product features, Wednesday - Customer testimonials, Thursday - Industry news, Friday - Behind the scenes, Saturday - User-generated content, Sunday - Weekly recap. Hashtags: #BrandWatch, #SocialListening, #BrandMonitoring, #CustomerSuccess. Engagement Goals: Twitter - 5% engagement rate, LinkedIn - 8% engagement rate, Instagram - 12% engagement rate.",
  "fileType": "xlsx",
  "fileUrl": "https://your-storage-server.com/documents/calendars/2025/11/social-calendar-nov-2025.xlsx",
  "fileSize": 456789,
  "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "author": "Emily Rodriguez",
  "team": "Social Media",
  "project": "Content Planning",
  "tags": ["calendar", "social", "content", "november", "planning", "schedule"]
}
```

**Note:** Replace `https://your-storage-server.com/...` with your actual file storage URL, or remove the `fileUrl` field if you don't have a file URL.

### Example 5: Email Marketing Templates (HTML)

```json
{
  "title": "Email Marketing Templates",
  "description": "Collection of email templates for newsletters, promotions, and transactional emails.",
  "content": "Email Marketing Templates. Newsletter Template: Header with logo, hero section, 3-column content grid, footer with unsubscribe. Promotion Template: Bold headline, CTA button, discount code section. Transactional: Order confirmation, password reset, welcome email templates.",
  "fileType": "html",
  "fileUrl": "https://example.com/documents/email-templates.html",
  "fileSize": 234567,
  "mimeType": "text/html",
  "author": "Alex Thompson",
  "team": "Marketing",
  "project": "Email Campaigns",
  "tags": ["template", "email", "marketing"]
}
```

### Example 6: SEO Best Practices Guide (Markdown)

```json
{
  "title": "SEO Best Practices Guide",
  "description": "Internal guide for SEO optimization including keyword research, on-page optimization, and link building strategies.",
  "content": "SEO Best Practices Guide. Keyword Research: Use tools like Google Keyword Planner, focus on long-tail keywords, analyze competitor keywords. On-Page SEO: Optimize title tags (50-60 chars), meta descriptions (150-160 chars), use H1-H6 hierarchy, optimize images with alt text. Link Building: Guest posting, resource pages, broken link building.",
  "fileType": "markdown",
  "fileUrl": "https://example.com/documents/seo-guide.md",
  "fileSize": 123456,
  "mimeType": "text/markdown",
  "author": "David Kim",
  "team": "Marketing",
  "project": "SEO",
  "tags": ["seo", "guidelines", "best practices"]
}
```

### Example 7: Product Launch Press Release (DOCX)

```json
{
  "title": "Product Launch Press Release Template",
  "description": "Standard template for product launch press releases with sections for features, benefits, and quotes.",
  "content": "Press Release Template. Headline: [Product Name] Launches [Key Feature] to [Target Audience]. Subheadline: [Brief description]. Body: Introduction paragraph, key features section, benefits section, quote from executive, call-to-action, company boilerplate.",
  "fileType": "docx",
  "fileUrl": "https://example.com/documents/press-release-template.docx",
  "fileSize": 345678,
  "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "author": "Lisa Wang",
  "team": "Product",
  "project": "Product Launch",
  "tags": ["template", "press release", "launch"]
}
```

### Example 8: Analytics Dashboard Requirements (TXT)

```json
{
  "title": "Analytics Dashboard Requirements",
  "description": "Requirements document for the new analytics dashboard including metrics, visualizations, and user stories.",
  "content": "Analytics Dashboard Requirements. Key Metrics: Total mentions, sentiment breakdown, response rate, engagement rate. Visualizations: Sentiment trend chart, source breakdown pie chart, time series for mentions. User Stories: As a marketer, I want to see real-time sentiment trends so I can respond quickly to negative mentions.",
  "fileType": "txt",
  "fileUrl": "https://example.com/documents/analytics-requirements.txt",
  "fileSize": 56789,
  "mimeType": "text/plain",
  "author": "Engineering Team",
  "team": "Engineering",
  "project": "Analytics Dashboard",
  "tags": ["requirements", "analytics", "dashboard", "urgent"]
}
```

### Example 9: Content Marketing Strategy (PDF)

```json
{
  "title": "Content Marketing Strategy 2025",
  "description": "Annual content marketing strategy including content pillars, publishing schedule, and distribution channels.",
  "content": "Content Marketing Strategy 2025. Content Pillars: 1) Product Education, 2) Industry Insights, 3) Customer Success, 4) Thought Leadership. Publishing Schedule: Blog posts (2x/week), Case studies (1x/month), Whitepapers (1x/quarter), Videos (1x/week). Distribution: Owned channels (blog, email), Earned (social shares), Paid (promoted content).",
  "fileType": "pdf",
  "fileUrl": "https://example.com/documents/content-strategy-2025.pdf",
  "fileSize": 3456789,
  "mimeType": "application/pdf",
  "author": "Content Team",
  "team": "Content",
  "project": "Content Strategy",
  "tags": ["strategy", "content", "2025", "important"]
}
```

### Example 10: Customer Feedback Analysis (PDF)

```json
{
  "title": "Customer Feedback Analysis - Q3 2025",
  "description": "Analysis of customer feedback collected in Q3 2025 with insights and action items.",
  "content": "Q3 2025 Customer Feedback Analysis. Top Themes: Feature requests (35%), Bug reports (25%), Pricing concerns (20%), Support quality (15%), Other (5%). Key Insights: Users want dark mode feature, pricing is main concern for SMBs, support response time needs improvement. Action Items: Prioritize dark mode development, review pricing tiers, improve support SLAs.",
  "fileType": "pdf",
  "fileUrl": "https://example.com/documents/feedback-q3-2025.pdf",
  "fileSize": 2345678,
  "mimeType": "application/pdf",
  "author": "Support Team",
  "team": "Support",
  "project": "Customer Feedback",
  "tags": ["analysis", "feedback", "q3", "report"]
}
```

### Example 11: Sales Playbook (PDF)

```json
{
  "title": "Sales Playbook 2025",
  "description": "Complete sales playbook with scripts, objection handling, and closing techniques.",
  "content": "Sales Playbook 2025. Opening Scripts: 'Hi [Name], I noticed your company recently [event]. We help companies like yours [benefit].' Objection Handling: Pricing - 'I understand budget is a concern. Let me show you the ROI...' Closing Techniques: Assumptive close, Alternative close, Urgency close.",
  "fileType": "pdf",
  "fileUrl": "https://example.com/documents/sales-playbook-2025.pdf",
  "fileSize": 1876543,
  "mimeType": "application/pdf",
  "author": "Sales Team",
  "team": "Sales",
  "project": "Sales Training",
  "tags": ["playbook", "sales", "training", "scripts"]
}
```

### Example 12: Product Roadmap (PDF)

```json
{
  "title": "Product Roadmap Q1-Q4 2025",
  "description": "Product development roadmap for all four quarters of 2025 with feature priorities and timelines.",
  "content": "Product Roadmap 2025. Q1: Dark mode, Mobile app improvements, Performance optimization. Q2: AI-powered recommendations, Advanced analytics, Integration marketplace. Q3: Enterprise features, White-labeling, API v2. Q4: Machine learning enhancements, New dashboard, Mobile app v2.",
  "fileType": "pdf",
  "fileUrl": "https://example.com/documents/product-roadmap-2025.pdf",
  "fileSize": 2987654,
  "mimeType": "application/pdf",
  "author": "Product Team",
  "team": "Product",
  "project": "Product Roadmap",
  "tags": ["roadmap", "product", "2025", "planning"]
}
```

### Example 13: Minimal Document (Title Only)

```json
{
  "title": "Quick Notes",
  "fileType": "txt"
}
```

### Example 13A: Document Without File URL (Still Searchable)

```json
{
  "title": "Meeting Notes - Product Planning Session",
  "description": "Notes from the product planning session discussing Q1 2026 roadmap.",
  "content": "Product Planning Session Notes. Attendees: Sarah, Mike, Emily, David. Topics Discussed: Dark mode feature priority, Mobile app improvements, API v2 development timeline. Decisions: Dark mode to be released in Q1, Mobile app updates in Q2, API v2 in Q3. Action Items: Sarah to create design mockups, Mike to prepare technical specs, Emily to coordinate with engineering team.",
  "fileType": "txt",
  "author": "Sarah Johnson",
  "team": "Product",
  "project": "Product Planning",
  "tags": ["meeting", "notes", "planning", "q1-2026"]
}
```

**Note:** This example shows that you can index documents **without a `fileUrl`**. The document will still be fully searchable by title, description, and content. The "Open File" button will show as unavailable in the document detail modal.

### Example 14: Document with Auto-Detection

```json
{
  "title": "Marketing Campaign Q4 2025 - Budget Planning",
  "description": "Budget allocation for Q4 marketing campaigns across all channels",
  "content": "Q4 Marketing Budget: Digital advertising $50K, Content creation $30K, Events $20K, Tools $10K. Focus on brand awareness and lead generation. Target: 25% increase in brand awareness.",
  "fileType": "pdf",
  "author": "Marketing Team"
}
```

*Note: Team and project will be auto-detected from content if not provided.*

---

## Additional Document Examples

### Example 15: API Documentation (Markdown)

```json
{
  "title": "BrandWatch API Documentation v2.0",
  "description": "Complete API reference guide with endpoints, authentication, and code examples.",
  "content": "BrandWatch API v2.0 Documentation. Base URL: https://api.brandwatch.com/v2. Authentication: Bearer token in Authorization header. Endpoints: GET /mentions - Retrieve brand mentions, POST /mentions/ingest - Add new mention, GET /sentiment-trend - Get sentiment data, GET /alerts - Retrieve alerts. Rate Limits: 1000 requests per hour per API key.",
  "fileType": "markdown",
  "fileUrl": "https://example.com/documents/api-docs-v2.md",
  "fileSize": 456789,
  "mimeType": "text/markdown",
  "author": "Engineering Team",
  "team": "Engineering",
  "project": "API Development",
  "tags": ["api", "documentation", "technical", "reference"]
}
```

### Example 16: User Onboarding Guide (PDF)

```json
{
  "title": "User Onboarding Guide - Getting Started",
  "description": "Step-by-step guide for new users to get started with BrandWatch platform.",
  "content": "BrandWatch Onboarding Guide. Step 1: Create your account and verify email. Step 2: Set up your brand profile and add keywords to monitor. Step 3: Connect your social media accounts. Step 4: Configure alerts and notifications. Step 5: Explore the dashboard and customize your view. Step 6: Set up your first monitoring campaign.",
  "fileType": "pdf",
  "fileUrl": "https://example.com/documents/onboarding-guide.pdf",
  "fileSize": 1234567,
  "mimeType": "application/pdf",
  "author": "Product Team",
  "team": "Product",
  "project": "User Onboarding",
  "tags": ["guide", "onboarding", "tutorial", "getting started"]
}
```

### Example 17: Crisis Communication Plan (DOCX)

```json
{
  "title": "Crisis Communication Plan 2025",
  "description": "Protocol and templates for handling brand reputation crises and negative PR incidents.",
  "content": "Crisis Communication Plan. Level 1 (Minor): Social media response within 2 hours. Level 2 (Moderate): Public statement within 4 hours, media outreach. Level 3 (Major): Press conference within 6 hours, CEO statement, full media campaign. Response Templates: Apology template, Clarification template, Refutation template. Escalation Process: Monitor → Assess → Respond → Follow-up.",
  "fileType": "docx",
  "fileUrl": "https://example.com/documents/crisis-communication-plan.docx",
  "fileSize": 987654,
  "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "author": "PR Team",
  "team": "PR",
  "project": "Crisis Management",
  "tags": ["crisis", "communication", "pr", "urgent"]
}
```

### Example 18: Monthly Performance Report (Spreadsheet)

**Option A: Using Local File Server (Recommended for Testing)**

First, place your `performance-nov-2025.xlsx` file in `brand-watch/public/uploads/`, then use:

```json
{
  "title": "Monthly Performance Report - November 2025",
  "description": "Monthly metrics and KPIs including mentions, sentiment, engagement, and response times.",
  "content": "November 2025 Performance Report. Total Mentions: 1,234. Sentiment: Positive 65%, Neutral 20%, Negative 15%. Engagement Rate: 8.5%. Average Response Time: 2.3 hours. Top Channels: Twitter 45%, Reddit 25%, News 20%, Forums 10%. Key Highlights: 15% increase in positive sentiment, 20% faster response times, 3 viral mentions. Detailed Breakdown: Week 1: 312 mentions (68% positive), Week 2: 298 mentions (62% positive), Week 3: 315 mentions (70% positive), Week 4: 309 mentions (65% positive). Top Performing Content: Product launch announcement (89K reach), Customer success story (45K reach), Feature update (32K reach). Response Metrics: Average first response time 1.8 hours, Resolution time 4.2 hours, Customer satisfaction 4.6/5.0.",
  "fileType": "xlsx",
  "fileUrl": "http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx",
  "fileSize": 345678,
  "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "author": "Analytics Team",
  "team": "Analytics",
  "project": "Monthly Reports",
  "tags": ["report", "performance", "metrics", "november", "analytics", "kpi"]
}
```

**Option B: Using Cloud Storage**

```json
{
  "title": "Monthly Performance Report - November 2025",
  "description": "Monthly metrics and KPIs including mentions, sentiment, engagement, and response times.",
  "content": "November 2025 Performance Report. Total Mentions: 1,234. Sentiment: Positive 65%, Neutral 20%, Negative 15%. Engagement Rate: 8.5%. Average Response Time: 2.3 hours. Top Channels: Twitter 45%, Reddit 25%, News 20%, Forums 10%. Key Highlights: 15% increase in positive sentiment, 20% faster response times, 3 viral mentions. Detailed Breakdown: Week 1: 312 mentions (68% positive), Week 2: 298 mentions (62% positive), Week 3: 315 mentions (70% positive), Week 4: 309 mentions (65% positive). Top Performing Content: Product launch announcement (89K reach), Customer success story (45K reach), Feature update (32K reach). Response Metrics: Average first response time 1.8 hours, Resolution time 4.2 hours, Customer satisfaction 4.6/5.0.",
  "fileType": "xlsx",
  "fileUrl": "https://your-storage-server.com/documents/reports/2025/11/performance-nov-2025.xlsx",
  "fileSize": 345678,
  "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "author": "Analytics Team",
  "team": "Analytics",
  "project": "Monthly Reports",
  "tags": ["report", "performance", "metrics", "november", "analytics", "kpi"]
}
```

**Quick Setup Steps:**

1. **Place your file:**
   - Copy `performance-nov-2025.xlsx` to `brand-watch/public/uploads/`
   - Make sure the file name matches exactly (case-sensitive)

2. **Test the URL in your browser:**
   - Open: `http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx`
   - If it downloads/opens, the URL is working!

3. **Use in Postman:**
   - Copy the JSON from Option A above
   - Make sure `fileUrl` is: `http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx`
   - Send the POST request to `http://192.168.195.1:3000/api/documents/index`

4. **Verify it works:**
   - Go to `http://192.168.195.1:3000/library`
   - Click on the document
   - Click "Open File" - it should open your file!

**Important:** 
- File name in URL must match the actual file name exactly
- Server must be running (`npm run dev`)
- File must be in `brand-watch/public/uploads/` folder

### Example 19: Influencer Partnership Agreement (PDF)

```json
{
  "title": "Influencer Partnership Agreement Template",
  "description": "Standard template for influencer partnership agreements with terms, deliverables, and compensation.",
  "content": "Influencer Partnership Agreement. Terms: 3-month partnership, 4 posts per month, exclusivity clause. Deliverables: 2 Instagram posts, 1 YouTube video, 1 Twitter thread. Compensation: $5,000 base + performance bonus. Content Guidelines: Brand voice, hashtag requirements, disclosure requirements. Performance Metrics: Reach, engagement, conversions.",
  "fileType": "pdf",
  "fileUrl": "https://example.com/documents/influencer-agreement-template.pdf",
  "fileSize": 567890,
  "mimeType": "application/pdf",
  "author": "Partnerships Team",
  "team": "Partnerships",
  "project": "Influencer Program",
  "tags": ["template", "influencer", "partnership", "legal"]
}
```

### Example 20: Technical Architecture Document (Markdown)

```json
{
  "title": "System Architecture Overview",
  "description": "Technical architecture documentation for BrandWatch platform including infrastructure and data flow.",
  "content": "BrandWatch System Architecture. Frontend: Next.js 14, React, Tailwind CSS. Backend: Node.js, Express, Prisma ORM. Database: PostgreSQL. Infrastructure: AWS (EC2, RDS, S3). Data Pipeline: Real-time ingestion → Processing → Storage → Analytics. APIs: RESTful API, GraphQL endpoint. Monitoring: CloudWatch, Sentry. Scaling: Horizontal scaling with load balancers.",
  "fileType": "markdown",
  "fileUrl": "https://example.com/documents/architecture.md",
  "fileSize": 234567,
  "mimeType": "text/markdown",
  "author": "Engineering Team",
  "team": "Engineering",
  "project": "Architecture",
  "tags": ["architecture", "technical", "infrastructure", "documentation"]
}
```

### Example 21: Customer Success Case Study (PDF)

```json
{
  "title": "Customer Success Case Study - TechStart Inc",
  "description": "Case study showcasing how TechStart Inc improved brand reputation using BrandWatch.",
  "content": "TechStart Inc Case Study. Challenge: Managing brand reputation across multiple channels, responding to customer queries quickly. Solution: Implemented BrandWatch for real-time monitoring and automated alerts. Results: 40% reduction in response time, 30% increase in positive sentiment, 25% improvement in customer satisfaction. ROI: 3x return on investment within 6 months.",
  "fileType": "pdf",
  "fileUrl": "https://example.com/documents/case-study-techstart.pdf",
  "fileSize": 1876543,
  "mimeType": "application/pdf",
  "author": "Customer Success Team",
  "team": "Customer Success",
  "project": "Case Studies",
  "tags": ["case study", "success", "customer", "roi"]
}
```

### Example 22: Social Media Policy (DOCX)

```json
{
  "title": "Social Media Policy and Guidelines",
  "description": "Company-wide social media policy including do's and don'ts, approval processes, and brand voice guidelines.",
  "content": "Social Media Policy. Do's: Use professional tone, respond within 2 hours, use approved hashtags, tag relevant accounts. Don'ts: No personal opinions, no controversial topics, no unapproved discounts. Approval Process: Level 1 (standard) - auto-approved, Level 2 (sensitive) - manager approval, Level 3 (crisis) - executive approval. Brand Voice: Professional, helpful, authentic, engaging.",
  "fileType": "docx",
  "fileUrl": "https://example.com/documents/social-media-policy.docx",
  "fileSize": 678901,
  "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "author": "Marketing Team",
  "team": "Marketing",
  "project": "Policy",
  "tags": ["policy", "social media", "guidelines", "important"]
}
```

### Example 23: Budget Allocation Spreadsheet (Spreadsheet)

```json
{
  "title": "Annual Marketing Budget 2025",
  "description": "Detailed budget breakdown for all marketing activities and channels for fiscal year 2025.",
  "content": "2025 Marketing Budget. Digital Advertising: $200K (40%) - Google Ads $120K, Facebook Ads $50K, LinkedIn Ads $30K. Content Creation: $100K (20%) - Blog posts $40K, Videos $35K, Infographics $25K. Events: $75K (15%) - Conferences $45K, Webinars $20K, Workshops $10K. Tools & Software: $50K (10%) - BrandWatch $30K, Design tools $12K, Analytics $8K. Influencer Marketing: $50K (10%) - Micro-influencers $30K, Macro-influencers $20K. PR: $25K (5%) - Press releases $15K, Media relations $10K. Total: $500K. Quarterly Breakdown: Q1: $125K (25%), Q2: $125K (25%), Q3: $125K (25%), Q4: $125K (25%). ROI Targets: Digital Advertising 3:1, Content Creation 5:1, Events 2:1, Influencer Marketing 4:1.",
  "fileType": "xlsx",
  "fileUrl": "https://your-storage-server.com/documents/budgets/2025/annual-marketing-budget-2025.xlsx",
  "fileSize": 234567,
  "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "author": "Finance Team",
  "team": "Finance",
  "project": "Budget Planning",
  "tags": ["budget", "finance", "2025", "planning", "marketing", "allocation"]
}
```

**Note:** Replace `https://your-storage-server.com/...` with your actual file storage URL, or remove the `fileUrl` field if you don't have a file URL.

### Example 24: Product Feature Spec (Markdown)

```json
{
  "title": "Dark Mode Feature Specification",
  "description": "Detailed specification for dark mode feature including design, implementation, and testing requirements.",
  "content": "Dark Mode Feature Spec. Design: Dark background #0a0a0a, Light text #ededed, Accent colors adjusted for contrast. Implementation: CSS variables for theme switching, localStorage for preference, system preference detection. Testing: Accessibility (WCAG AA), All components, Cross-browser compatibility. Timeline: Design (1 week), Development (2 weeks), Testing (1 week), Release (Q1 2025).",
  "fileType": "markdown",
  "fileUrl": "https://example.com/documents/dark-mode-spec.md",
  "fileSize": 123456,
  "mimeType": "text/markdown",
  "author": "Product Team",
  "team": "Product",
  "project": "Dark Mode",
  "tags": ["spec", "feature", "product", "design"]
}
```

### Example 25: Training Materials (PDF)

```json
{
  "title": "BrandWatch Training Manual - Advanced Features",
  "description": "Training guide for advanced features including custom alerts, analytics, and API integration.",
  "content": "Advanced Features Training. Custom Alerts: Set up alerts for specific keywords, sentiment thresholds, spike detection. Analytics: Custom date ranges, export reports, create dashboards. API Integration: Authentication, rate limits, webhooks, error handling. Best Practices: Regular monitoring, proactive responses, data-driven decisions.",
  "fileType": "pdf",
  "fileUrl": "https://example.com/documents/training-advanced.pdf",
  "fileSize": 2345678,
  "mimeType": "application/pdf",
  "author": "Training Team",
  "team": "Training",
  "project": "Training Materials",
  "tags": ["training", "manual", "advanced", "guide"]
}
```

---

## 🔍 Search Examples

### Search by Query

```
GET http://192.168.195.1:3000/api/documents/search?q=marketing
```

### Search by Team

```
GET http://192.168.195.1:3000/api/documents/search?team=Marketing
```

### Search by Project

```
GET http://192.168.195.1:3000/api/documents/search?project=Q4 Campaign
```

### Search by File Type

```
GET http://192.168.195.1:3000/api/documents/search?fileType=pdf
```

### Combined Search

```
GET http://192.168.195.1:3000/api/documents/search?q=strategy&team=Marketing&fileType=pdf&limit=10
```

---

## ✅ Expected Response

**Success Response:**
```json
{
  "success": true,
  "documentId": "clx1234567890abcdef"
}
```

**Error Response:**
```json
{
  "error": "Missing required fields: title, fileType"
}
```

---

## 🚀 Quick Start

1. **Open Postman**
2. **Create a new POST request**
3. **Set URL:** `http://192.168.195.1:3000/api/documents/index`
4. **Set Headers:** `Content-Type: application/json`
5. **Copy one of the example JSON payloads above**
6. **Paste into Body (raw JSON)**
7. **Click Send**

After indexing documents, visit `http://192.168.195.1:3000/library` to see them in the Document Library!

---

## 💡 Tips

- **Auto-categorization:** The system automatically detects team, project, and categories from title, description, and content
- **Tags:** Tags help with search and filtering
- **File URL:** Optional, but useful if you want to link to the actual file
- **Content:** Include full text content for better search results
- **Team/Project:** Can be auto-detected, but providing them explicitly ensures accuracy

---

## 📊 Testing the Library

After indexing documents:

1. Visit `http://192.168.195.1:3000/library`
2. Check KPI cards - should show document counts
3. Use the search bar to find documents
4. Filter by team, project, file type
5. Click on documents to view details

---

## 🗑️ Deleting Documents

### How to Get Document ID

You need the document ID to delete it. Here are **3 ways** to get it:

#### Method 1: From Creation Response (Easiest)

When you create a document, the response includes the `documentId`:

**Request:**
```json
POST http://192.168.195.1:3000/api/documents/index
{
  "title": "Monthly Performance Report - November 2025",
  "fileType": "xlsx",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "clx1234567890abcdef"
}
```

**Save this `documentId`** - you'll need it to delete!

#### Method 2: Search for Documents (If You Forgot the ID)

If you forgot the document ID, search for your document:

**Option A: Search by Title**
```
GET http://192.168.195.1:3000/api/documents/search?q=Monthly Performance Report
```

**Option B: Search by Team**
```
GET http://192.168.195.1:3000/api/documents/search?team=Analytics
```

**Option C: Get All Recent Documents**
```
GET http://192.168.195.1:3000/api/documents/search?limit=10
```
This returns the 10 most recently indexed documents.

**Response:**
```json
{
  "results": [
    {
      "id": "clx1234567890abcdef",
      "title": "Monthly Performance Report - November 2025",
      "description": "Monthly metrics and KPIs",
      "fileType": "SPREADSHEET",
      "team": "Analytics",
      "project": "Monthly Reports",
      ...
    }
  ],
  "total": 1
}
```

**Copy the `id` field** from the matching result.

#### Method 3: Get Document by Title (Search)

You can also search by team, project, or other filters:

```
GET http://192.168.195.1:3000/api/documents/search?team=Analytics
GET http://192.168.195.1:3000/api/documents/search?project=Monthly Reports
GET http://192.168.195.1:3000/api/documents/search?fileType=xlsx
```

Each result will have an `id` field.

### Delete a Document via API

Once you have the document ID, use the DELETE endpoint:

**Endpoint:**
```
DELETE http://192.168.195.1:3000/api/documents/{documentId}
```

### Delete the Document

**Method:** `DELETE`

**URL:** `http://192.168.195.1:3000/api/documents/{documentId}`

Replace `{documentId}` with the actual document ID you got from Method 1, 2, or 3 above.

**Example:**
```
DELETE http://192.168.195.1:3000/api/documents/clx1234567890abcdef
```

**No Body Required** - Just send the DELETE request.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Error Response (404):**
```json
{
  "error": "Document not found"
}
```

**Error Response (500):**
```json
{
  "error": "Failed to delete document",
  "details": "Error message here"
}
```

### Complete Example: Create and Delete

**Step 1: Create a document**
```json
POST http://192.168.195.1:3000/api/documents/index
{
  "title": "Monthly Performance Report - November 2025",
  "fileType": "xlsx",
  "fileUrl": "http://192.168.195.1:3000/uploads/performance-nov-2025.xlsx",
  "description": "Monthly metrics and KPIs",
  "content": "November 2025 Performance Report...",
  "author": "Analytics Team",
  "team": "Analytics",
  "project": "Monthly Reports",
  "tags": ["report", "performance", "metrics"]
}
```

**Response:**
```json
{
  "success": true,
  "documentId": "clx1234567890abcdef"
}
```

**Step 2: Delete the document**
```
DELETE http://192.168.195.1:3000/api/documents/clx1234567890abcdef
```

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### Postman Setup for DELETE

1. **Open Postman**
2. **Create a new request**
3. **Set method to:** `DELETE`
4. **Enter URL:** `http://192.168.195.1:3000/api/documents/{documentId}`
   - Replace `{documentId}` with the actual document ID
5. **No headers needed** (unless you have authentication)
6. **No body needed**
7. **Click Send**

### Notes

- **Cascade Deletion:** Deleting a document will also delete all related category relations (cascade delete)
- **Permanent:** Deletion is permanent and cannot be undone
- **Document ID:** You need the document ID to delete it - get it from the creation response or search results
- **Verification:** After deletion, the document will no longer appear in search results

---

**Happy indexing! 📚**

