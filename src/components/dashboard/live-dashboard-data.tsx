"use client";

import { useEffect, useState } from "react";
import type {
  AlertItem,
  Mention,
  MentionStats,
  SentimentSeriesPoint,
  SourceSplit,
} from "@/lib/types";

interface LiveDashboardDataProps {
  initialMentions: Mention[];
  initialStats: MentionStats;
  initialSentimentSeries: SentimentSeriesPoint[];
  initialSourceSplit: SourceSplit[];
  initialAlerts: AlertItem[];
  children: (data: {
    mentions: Mention[];
    stats: MentionStats;
    sentimentSeries: SentimentSeriesPoint[];
    sourceSplit: SourceSplit[];
    alerts: AlertItem[];
    isRefreshing: boolean;
  }) => React.ReactNode;
}

export function LiveDashboardData({
  initialMentions,
  initialStats,
  initialSentimentSeries,
  initialSourceSplit,
  initialAlerts,
  children,
}: LiveDashboardDataProps) {
  const [mentions, setMentions] = useState<Mention[]>(initialMentions);
  const [stats, setStats] = useState<MentionStats>(initialStats);
  const [sentimentSeries, setSentimentSeries] = useState<SentimentSeriesPoint[]>(initialSentimentSeries);
  const [sourceSplit, setSourceSplit] = useState<SourceSplit[]>(initialSourceSplit);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const [mentionsRes, statsRes, sentimentRes, sourceRes, alertsRes] = await Promise.all([
        fetch("/api/mentions", { cache: "no-store" }),
        fetch("/api/stats", { cache: "no-store" }),
        fetch("/api/sentiment-trend", { cache: "no-store" }),
        fetch("/api/source-breakdown", { cache: "no-store" }),
        fetch("/api/alerts", { cache: "no-store" }),
      ]);

      if (mentionsRes.ok) {
        const mentionsData = await mentionsRes.json();
        setMentions(mentionsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (sentimentRes.ok) {
        const sentimentData = await sentimentRes.json();
        setSentimentSeries(sentimentData);
      }

      if (sourceRes.ok) {
        const sourceData = await sourceRes.json();
        setSourceSplit(sourceData);
      }

      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        setAlerts(alertsData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Set up automatic refresh
  useEffect(() => {
    // Convert minutes to milliseconds
    const intervalMs = refreshInterval * 60 * 1000;

    // Initial fetch after a short delay (to avoid immediate refresh on mount)
    const initialTimeout = setTimeout(() => {
      fetchDashboardData();
    }, 1000);

    // Set up interval for automatic refresh
    const interval = setInterval(() => {
      fetchDashboardData();
    }, intervalMs);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [refreshInterval]);

  return (
    <>
      {children({
        mentions,
        stats,
        sentimentSeries,
        sourceSplit,
        alerts,
        isRefreshing,
      })}
    </>
  );
}

