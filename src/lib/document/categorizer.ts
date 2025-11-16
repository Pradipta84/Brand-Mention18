// DocumentCategoryType enum values
enum DocumentCategoryType {
  TOPIC = "TOPIC",
  PROJECT = "PROJECT",
  TEAM = "TEAM",
  DEPARTMENT = "DEPARTMENT",
  GENERAL = "GENERAL",
}

/**
 * Auto-categorize documents by topic, project, or team
 */
export function categorizeDocument(
  title: string,
  description: string | null,
  content: string | null,
  team?: string | null,
  project?: string | null
): { categories: Array<{ name: string; type: DocumentCategoryType }>; detectedTeam?: string; detectedProject?: string } {
  const text = `${title} ${description || ""} ${content || ""}`.toLowerCase();
  const categories: Array<{ name: string; type: DocumentCategoryType }> = [];

  // Detect team from content or use provided
  const teamKeywords: Record<string, string> = {
    marketing: "Marketing",
    sales: "Sales",
    product: "Product",
    engineering: "Engineering",
    design: "Design",
    support: "Support",
    content: "Content",
    social: "Social Media",
  };

  let detectedTeam = team;
  if (!detectedTeam) {
    for (const [keyword, teamName] of Object.entries(teamKeywords)) {
      if (text.includes(keyword)) {
        detectedTeam = teamName;
        categories.push({ name: teamName, type: DocumentCategoryType.TEAM });
        break;
      }
    }
  } else {
    categories.push({ name: detectedTeam, type: DocumentCategoryType.TEAM });
  }

  // Detect project from content or use provided
  const projectKeywords = [
    "brand watch",
    "competitor analysis",
    "campaign",
    "launch",
    "product release",
    "q4",
    "q1",
    "q2",
    "q3",
  ];

  let detectedProject = project;
  if (!detectedProject) {
    for (const keyword of projectKeywords) {
      if (text.includes(keyword)) {
        detectedProject = keyword.charAt(0).toUpperCase() + keyword.slice(1);
        categories.push({ name: detectedProject, type: DocumentCategoryType.PROJECT });
        break;
      }
    }
  } else {
    categories.push({ name: detectedProject, type: DocumentCategoryType.PROJECT });
  }

  // Detect topics
  const topicKeywords: Record<string, string> = {
    pricing: "Pricing",
    strategy: "Strategy",
    branding: "Branding",
    content: "Content Strategy",
    social: "Social Media",
    analytics: "Analytics",
    campaign: "Campaign Planning",
    research: "Market Research",
    competitor: "Competitor Analysis",
    seo: "SEO",
    email: "Email Marketing",
    advertising: "Advertising",
    design: "Design Guidelines",
    guidelines: "Guidelines",
    template: "Templates",
    report: "Reports",
    analysis: "Analysis",
  };

  for (const [keyword, topicName] of Object.entries(topicKeywords)) {
    if (text.includes(keyword) && !categories.some((c) => c.name === topicName)) {
      categories.push({ name: topicName, type: DocumentCategoryType.TOPIC });
    }
  }

  // If no categories found, add general
  if (categories.length === 0) {
    categories.push({ name: "General", type: DocumentCategoryType.GENERAL });
  }

  return { 
    categories, 
    detectedTeam: detectedTeam || undefined, 
    detectedProject: detectedProject || undefined 
  };
}

/**
 * Extract tags from document content
 */
export function extractTags(
  title: string,
  description: string | null,
  content: string | null
): string[] {
  const text = `${title} ${description || ""} ${content || ""}`.toLowerCase();
  const tags: string[] = [];

  const tagKeywords = [
    "urgent",
    "important",
    "draft",
    "final",
    "template",
    "guideline",
    "policy",
    "strategy",
    "plan",
    "report",
    "analysis",
    "research",
    "campaign",
    "launch",
    "q1",
    "q2",
    "q3",
    "q4",
    "2024",
    "2025",
  ];

  for (const keyword of tagKeywords) {
    if (text.includes(keyword) && !tags.includes(keyword)) {
      tags.push(keyword);
    }
  }

  return tags;
}

