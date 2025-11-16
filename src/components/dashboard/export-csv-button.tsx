"use client";

import { Mention } from "@/lib/types";
import { mentionsToCSV, downloadCSV } from "@/lib/utils/csv-export";
import { useState } from "react";

interface ExportCSVButtonProps {
  mentions: Mention[];
  className?: string;
}

export function ExportCSVButton({ mentions, className = "" }: ExportCSVButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    if (mentions.length === 0) {
      alert("No data to export");
      return;
    }

    setIsExporting(true);

    try {
      // Convert mentions to CSV
      const csvContent = mentionsToCSV(mentions);
      
      // Generate filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `mentions-export-${date}.csv`;
      
      // Download the CSV file
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || mentions.length === 0}
      className={`rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={mentions.length === 0 ? "No data to export" : "Export mentions to CSV"}
    >
      {isExporting ? "Exporting..." : "Export CSV"}
    </button>
  );
}

