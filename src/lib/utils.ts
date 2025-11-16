import { Sentiment } from "@/lib/types";
import { format, parseISO } from "date-fns";

export const formatShortNumber = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

export const formatTimestamp = (iso: string): string => {
  try {
    const date = parseISO(iso);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    // If less than 24 hours, show relative time
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return minutes <= 1 ? "Just now" : `${minutes}m ago`;
      }
      return `${Math.floor(diffInHours)}h ago`;
    }
    
    // Otherwise show date
    return format(date, "MMM d, HH:mm");
  } catch {
    return iso;
  }
};

export const sentimentBadgeColor = (sentiment: Sentiment): string => {
  switch (sentiment) {
    case "positive":
      return "bg-emerald-100 text-emerald-700";
    case "negative":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export const cn = (
  ...classes: Array<string | undefined | null | false>
): string => classes.filter(Boolean).join(" ");

