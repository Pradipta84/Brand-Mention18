import { Mention } from "@/lib/types";

/**
 * Escapes a CSV field value
 */
function escapeCsvField(value: string): string {
  if (value === null || value === undefined) {
    return "";
  }
  
  const stringValue = String(value);
  
  // If the value contains comma, newline, or double quote, wrap it in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Converts mentions array to CSV format
 */
export function mentionsToCSV(mentions: Mention[]): string {
  // CSV headers
  const headers = [
    "ID",
    "Channel",
    "Source",
    "Author",
    "Handle",
    "Body",
    "URL",
    "Published At",
    "Sentiment",
    "Reach",
    "Topics",
    "Spike",
  ];

  // Create CSV rows
  const rows = mentions.map((mention) => {
    return [
      mention.id,
      mention.channel,
      mention.source,
      mention.author,
      mention.handle || "",
      mention.body,
      mention.url,
      mention.publishedAt,
      mention.sentiment,
      mention.reach.toString(),
      mention.topics.join("; "),
      mention.spike ? "Yes" : "No",
    ].map(escapeCsvField);
  });

  // Combine headers and rows
  const csvContent = [
    headers.map(escapeCsvField).join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Downloads a CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a temporary link element
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

