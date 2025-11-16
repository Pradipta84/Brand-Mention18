"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";

interface LiveTimestampProps {
  iso: string;
  className?: string;
}

// Calculate static display time that will be the same on server and client
// Uses UTC methods to ensure consistency regardless of server/client timezone
function calculateStaticTime(iso: string): string {
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) {
      return iso;
    }
    
    // Use UTC methods to ensure server and client render the same value
    // This avoids timezone differences between server and client
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    return `${month} ${day}, ${year}, ${hours}:${minutes}`;
  } catch {
    return iso;
  }
}

export function LiveTimestamp({ iso, className }: LiveTimestampProps) {
  // Start with empty string to ensure server/client match
  // Will be set after mount to avoid hydration issues
  const [displayTime, setDisplayTime] = useState<string>(calculateStaticTime(iso));
  const [tooltip, setTooltip] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted to enable relative time calculations
    setMounted(true);

    const updateTime = () => {
      try {
        const date = parseISO(iso);
        const now = new Date();
        const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);
        const diffInHours = diffInMinutes / 60;
        const diffInDays = diffInHours / 24;

        // Set tooltip with UTC time and local timezone info
        // Format UTC time manually from UTC components
        const utcYear = date.getUTCFullYear();
        const utcMonth = date.getUTCMonth();
        const utcDay = date.getUTCDate();
        const utcHours = String(date.getUTCHours()).padStart(2, '0');
        const utcMinutes = String(date.getUTCMinutes()).padStart(2, '0');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const utcTime = `${monthNames[utcMonth]} ${utcDay}, ${utcYear} at ${utcHours}:${utcMinutes} UTC`;
        const localTime = format(date, "MMM d, yyyy 'at' HH:mm");
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTooltip(`UTC: ${utcTime}\nLocal: ${localTime} (${timezone})`);

        // Only show relative time after hydration to avoid mismatch
        if (mounted) {
          // Less than 1 minute
          if (diffInMinutes < 1) {
            setDisplayTime("Just now");
          }
          // Less than 1 hour - show minutes
          else if (diffInMinutes < 60) {
            const minutes = Math.floor(diffInMinutes);
            setDisplayTime(`${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`);
          }
          // Less than 24 hours - show hours
          else if (diffInHours < 24) {
            const hours = Math.floor(diffInHours);
            setDisplayTime(`${hours} ${hours === 1 ? "hour" : "hours"} ago`);
          }
          // Less than 7 days - show days
          else if (diffInDays < 7) {
            const days = Math.floor(diffInDays);
            setDisplayTime(`${days} ${days === 1 ? "day" : "days"} ago`);
          }
          // Less than 1 year - show date without year
          else if (diffInDays < 365) {
            setDisplayTime(format(date, "MMM d, HH:mm"));
          }
          // Otherwise show full date with year
          else {
            setDisplayTime(format(date, "MMM d, yyyy, HH:mm"));
          }
        }
      } catch {
        setDisplayTime(iso);
        setTooltip(iso);
      }
    };

    // Update immediately after mount
    updateTime();

    // Update every 30 seconds for live updates
    const interval = setInterval(updateTime, 30000);

    return () => clearInterval(interval);
  }, [iso, mounted]);

  return (
    <span 
      className={className} 
      title={tooltip}
      suppressHydrationWarning
    >
      {displayTime}
    </span>
  );
}

