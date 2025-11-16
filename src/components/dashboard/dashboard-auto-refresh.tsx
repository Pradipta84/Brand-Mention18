"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function DashboardAutoRefresh() {
  const router = useRouter();
  const [refreshInterval, setRefreshInterval] = useState(5); // Default 5 minutes

  // Load refresh interval from settings
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem("brandWatchSettings");
        if (saved) {
          const settings = JSON.parse(saved);
          if (settings?.refresh?.dashboardInterval) {
            setRefreshInterval(settings.refresh.dashboardInterval);
          }
        }
      } catch (error) {
        // Use default if error
      }
    };

    loadSettings();

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      loadSettings();
    };
    window.addEventListener("settingsUpdated", handleSettingsUpdate);

    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, []);

  // Set up automatic refresh
  useEffect(() => {
    // Convert minutes to milliseconds
    const intervalMs = refreshInterval * 60 * 1000;

    // Don't refresh immediately on mount, wait for the interval
    const interval = setInterval(() => {
      // Use router.refresh() to refresh server components
      router.refresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [refreshInterval, router]);

  // This component doesn't render anything
  return null;
}

