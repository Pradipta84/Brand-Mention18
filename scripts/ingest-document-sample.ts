/**
 * Sample script to index test documents
 * Run with: npx tsx scripts/ingest-document-sample.ts
 */

import { indexDocument } from "../src/lib/document/processor";

const sampleDocuments = [
  {
    title: "Q4 Marketing Strategy 2025",
    description: "Comprehensive marketing strategy document for Q4 2025 including campaign planning, budget allocation, and KPIs.",
    content: "This document outlines our Q4 marketing strategy. Key focus areas include brand awareness campaigns, social media engagement, and content marketing. Budget allocation: 40% digital advertising, 30% content creation, 20% events, 10% tools and software.",
    fileType: "pdf",
    author: "Sarah Johnson",
    team: "Marketing",
    project: "Q4 Campaign",
    tags: ["strategy", "q4", "campaign", "important"],
  },
  {
    title: "Brand Guidelines and Style Guide",
    description: "Complete brand guidelines including logo usage, color palette, typography, and design principles.",
    content: "Brand Guidelines Document. Our brand colors are: Primary Blue #0066CC, Secondary Green #00CC66. Typography: Headings use Inter Bold, Body text uses Inter Regular. Logo usage rules: Minimum size 24px, maintain aspect ratio, never distort.",
    fileType: "pdf",
    author: "Design Team",
    team: "Design",
    project: "Branding",
    tags: ["guidelines", "branding", "design", "template"],
  },
  {
    title: "Competitor Analysis Report - TechCorp",
    description: "Detailed analysis of competitor TechCorp's marketing strategies, pricing, and feature set.",
    content: "Competitor Analysis: TechCorp. Pricing: $99/month for Pro plan. Key features: AI analytics, social media integration, automated reporting. Marketing channels: LinkedIn, Twitter, industry blogs. Strengths: Strong brand presence, comprehensive feature set. Weaknesses: Higher pricing, complex onboarding.",
    fileType: "docx",
    author: "Mike Chen",
    team: "Marketing",
    project: "Competitor Analysis",
    tags: ["analysis", "competitor", "research", "report"],
  },
  {
    title: "Social Media Content Calendar - November 2025",
    description: "Monthly content calendar for all social media platforms including post schedules and content themes.",
    content: "November 2025 Social Media Calendar. Week 1: Product launch announcements. Week 2: Customer success stories. Week 3: Industry insights and thought leadership. Week 4: Holiday campaigns and promotions. Platforms: Twitter (daily), LinkedIn (3x/week), Instagram (5x/week).",
    fileType: "spreadsheet",
    author: "Emily Rodriguez",
    team: "Social Media",
    project: "Content Planning",
    tags: ["calendar", "social", "content", "november"],
  },
  {
    title: "Email Marketing Templates",
    description: "Collection of email templates for newsletters, promotions, and transactional emails.",
    content: "Email Marketing Templates. Newsletter Template: Header with logo, hero section, 3-column content grid, footer with unsubscribe. Promotion Template: Bold headline, CTA button, discount code section. Transactional: Order confirmation, password reset, welcome email templates.",
    fileType: "html",
    author: "Alex Thompson",
    team: "Marketing",
    project: "Email Campaigns",
    tags: ["template", "email", "marketing"],
  },
  {
    title: "SEO Best Practices Guide",
    description: "Internal guide for SEO optimization including keyword research, on-page optimization, and link building strategies.",
    content: "SEO Best Practices Guide. Keyword Research: Use tools like Google Keyword Planner, focus on long-tail keywords, analyze competitor keywords. On-Page SEO: Optimize title tags (50-60 chars), meta descriptions (150-160 chars), use H1-H6 hierarchy, optimize images with alt text. Link Building: Guest posting, resource pages, broken link building.",
    fileType: "markdown",
    author: "David Kim",
    team: "Marketing",
    project: "SEO",
    tags: ["seo", "guidelines", "best practices"],
  },
  {
    title: "Product Launch Press Release Template",
    description: "Standard template for product launch press releases with sections for features, benefits, and quotes.",
    content: "Press Release Template. Headline: [Product Name] Launches [Key Feature] to [Target Audience]. Subheadline: [Brief description]. Body: Introduction paragraph, key features section, benefits section, quote from executive, call-to-action, company boilerplate.",
    fileType: "docx",
    author: "Lisa Wang",
    team: "Product",
    project: "Product Launch",
    tags: ["template", "press release", "launch"],
  },
  {
    title: "Analytics Dashboard Requirements",
    description: "Requirements document for the new analytics dashboard including metrics, visualizations, and user stories.",
    content: "Analytics Dashboard Requirements. Key Metrics: Total mentions, sentiment breakdown, response rate, engagement rate. Visualizations: Sentiment trend chart, source breakdown pie chart, time series for mentions. User Stories: As a marketer, I want to see real-time sentiment trends so I can respond quickly to negative mentions.",
    fileType: "txt",
    author: "Engineering Team",
    team: "Engineering",
    project: "Analytics Dashboard",
    tags: ["requirements", "analytics", "dashboard", "urgent"],
  },
  {
    title: "Content Marketing Strategy 2025",
    description: "Annual content marketing strategy including content pillars, publishing schedule, and distribution channels.",
    content: "Content Marketing Strategy 2025. Content Pillars: 1) Product Education, 2) Industry Insights, 3) Customer Success, 4) Thought Leadership. Publishing Schedule: Blog posts (2x/week), Case studies (1x/month), Whitepapers (1x/quarter), Videos (1x/week). Distribution: Owned channels (blog, email), Earned (social shares), Paid (promoted content).",
    fileType: "pdf",
    author: "Content Team",
    team: "Content",
    project: "Content Strategy",
    tags: ["strategy", "content", "2025", "important"],
  },
  {
    title: "Customer Feedback Analysis - Q3 2025",
    description: "Analysis of customer feedback collected in Q3 2025 with insights and action items.",
    content: "Q3 2025 Customer Feedback Analysis. Top Themes: Feature requests (35%), Bug reports (25%), Pricing concerns (20%), Support quality (15%), Other (5%). Key Insights: Users want dark mode feature, pricing is main concern for SMBs, support response time needs improvement. Action Items: Prioritize dark mode development, review pricing tiers, improve support SLAs.",
    fileType: "pdf",
    author: "Support Team",
    team: "Support",
    project: "Customer Feedback",
    tags: ["analysis", "feedback", "q3", "report"],
  },
];

async function ingestSamples() {
  console.log("Starting sample document indexing...");

  for (const raw of sampleDocuments) {
    try {
      await indexDocument({
        title: raw.title,
        description: raw.description,
        content: raw.content,
        fileType: raw.fileType,
        author: raw.author,
        team: raw.team,
        project: raw.project,
        tags: raw.tags,
      });

      console.log(`✓ Indexed: ${raw.title}`);
    } catch (error) {
      console.error(`✗ Failed to index ${raw.title}:`, error);
    }
  }

  console.log("Sample document indexing complete!");
}

ingestSamples()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });

