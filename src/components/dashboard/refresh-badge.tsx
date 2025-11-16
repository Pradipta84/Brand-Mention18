"use client";

import { useEffect, useState } from "react";

export function RefreshBadge() {
  // Start with default value that matches server render
  const [interval, setIntervalValue] = useState(5);

  useEffect(() => {
    // Read from localStorage on mount
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem("brandWatchSettings");
        if (saved) {
          const settings = JSON.parse(saved);
          if (settings?.refresh?.dashboardInterval) {
            setIntervalValue(settings.refresh.dashboardInterval);
          }
        }
      } catch (error) {
        // Use default if error
      }
    };

    loadSettings();

    // Listen for storage changes (when settings are updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "brandWatchSettings") {
        loadSettings();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom event (same tab updates)
    const handleCustomStorage = () => {
      loadSettings();
    };
    window.addEventListener("settingsUpdated", handleCustomStorage);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("settingsUpdated", handleCustomStorage);
    };
  }, []);

  return (
    <span 
      className="rounded-full bg-slate-900/10 px-3 py-1 text-xs font-semibold text-slate-900"
      suppressHydrationWarning
    >
      Live · refreshed every {interval} min
    </span>
  );
}

