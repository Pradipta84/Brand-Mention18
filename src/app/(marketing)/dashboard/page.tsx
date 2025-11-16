import { AlertDrawer } from "@/components/alerts/alert-drawer";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import { RefreshBadge } from "@/components/dashboard/refresh-badge";
import { DashboardAutoRefresh } from "@/components/dashboard/dashboard-auto-refresh";
import { AlertsScrollHandler } from "@/components/dashboard/alerts-scroll-handler";
import { ExportCSVButton } from "@/components/dashboard/export-csv-button";
import { SourceBreakdown } from "@/components/charts/source-breakdown";
import { SentimentTrendFilter } from "@/components/charts/sentiment-trend-filter";
import { MentionCard } from "@/components/mentions/mention-card";
import { MentionTable } from "@/components/mentions/mention-table";
import { TopInfluencers } from "@/components/dashboard/top-influencers";
import { TrendingTopics } from "@/components/dashboard/trending-topics";
import { Suspense } from "react";
import {
  getAlerts,
  getMentions,
  getSentimentTrend,
  getSourceBreakdown,
  getStats,
} from "@/lib/data/server";
import type {
  AlertItem,
  Mention,
  MentionStats,
  SentimentSeriesPoint,
  SourceSplit,
} from "@/lib/types";

// Disable caching to ensure live data
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; channel?: string; sentiment?: string }> | { q?: string; channel?: string; sentiment?: string };
}) {
  // Fetch all data in parallel from database with error handling
  let mentionFeed: Mention[] = [];
  let mentionStats: MentionStats = {
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
    deltaWeek: 0,
  };
  let sentimentSeries: SentimentSeriesPoint[] = [];
  let sourceSplit: SourceSplit[] = [];
  let alertQueue: AlertItem[] = [];

  try {
    // Resolve searchParams if it's a Promise (Next.js 15+)
    const resolvedParams = await Promise.resolve(searchParams);
    
    // Use search params if provided, otherwise get all mentions
    const hasSearch = resolvedParams.q || resolvedParams.channel || resolvedParams.sentiment;
    
    if (hasSearch) {
      // Build search URL with query params
      const searchParams = new URLSearchParams();
      if (resolvedParams.q) searchParams.set("q", resolvedParams.q);
      if (resolvedParams.channel) searchParams.set("channel", resolvedParams.channel);
      if (resolvedParams.sentiment) searchParams.set("sentiment", resolvedParams.sentiment);

      // Use absolute URL for server-side fetch
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const apiUrl = `${baseUrl}/api/mentions?${searchParams.toString()}`;

      const response = await fetch(apiUrl, { 
        cache: "no-store",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        mentionFeed = await response.json().catch(() => []);
      } else {
        console.error("Failed to fetch mentions:", response.statusText);
        mentionFeed = [];
      }
    } else {
      mentionFeed = await getMentions().catch(() => []);
    }

    [mentionStats, sentimentSeries, sourceSplit, alertQueue] = await Promise.all([
      getStats().catch(() => ({
        total: 0,
        positive: 0,
        neutral: 0,
        negative: 0,
        deltaWeek: 0,
      })),
      getSentimentTrend().catch(() => []),
      getSourceBreakdown().catch(() => []),
      getAlerts().catch(() => []),
    ]);
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    // Data already initialized with empty values above
  }
  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6 md:space-y-8 bg-transparent">
      <DashboardAutoRefresh />
      <Suspense fallback={null}>
        <AlertsScrollHandler />
      </Suspense>
      <header>
        <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-slate-500">
          Overview
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">
            Brand reputation radar
          </h1>
          <div className="flex items-center gap-2">
            <RefreshBadge />
            <RefreshButton />
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Mentions (24h)"
          value={mentionStats.total.toString()}
          sublabel={`+${mentionStats.deltaWeek}% vs last week`}
          trend={{ value: `${mentionStats.deltaWeek}%`, direction: "up" }}
        />
        <KpiCard
          label="Positive"
          value={`${mentionStats.positive}%`}
          sublabel="Campaign response rate"
          trend={{ value: "+6%", direction: "up" }}
        />
        <KpiCard
          label="Neutral"
          value={`${mentionStats.neutral}%`}
          sublabel="Informational chatter"
        />
        <KpiCard
          label="Negative"
          value={`${mentionStats.negative}%`}
          sublabel="Requires triage"
          trend={{ value: "-3%", direction: "down" }}
        />
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm lg:col-span-2">
          <SentimentTrendFilter initialData={sentimentSeries} />
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Sources breakdown
          </h2>
          <p className="text-sm text-slate-500">
            Share of voice vs previous day
          </p>
          <div className="mt-6">
            <SourceBreakdown data={sourceSplit} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Priority mentions
              </h2>
              <p className="text-sm text-slate-500">
                Sorted by reach & negative spikes
              </p>
            </div>
            <ExportCSVButton mentions={mentionFeed} />
          </div>
          <div className="mt-4">
            <MentionTable data={mentionFeed} />
          </div>
        </div>
        <div id="alerts-section" className="space-y-6 scroll-mt-8 transition-all duration-300">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Signals</h2>
            <p className="text-sm text-slate-500">
              Alerts generated by anomaly models
            </p>
          </div>
          <AlertDrawer data={alertQueue} />
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Automation ideas
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Route negative spikes to CX Slack channel and auto-open Jira
              tickets.
            </p>
            <button className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
              Configure playbook
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Suspense fallback={
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="h-32 flex items-center justify-center">
              <p className="text-sm text-slate-500">Loading...</p>
            </div>
          </div>
        }>
          <TopInfluencers mentions={mentionFeed} />
        </Suspense>
        <Suspense fallback={
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="h-32 flex items-center justify-center">
              <p className="text-sm text-slate-500">Loading...</p>
            </div>
          </div>
        }>
          <TrendingTopics mentions={mentionFeed} />
        </Suspense>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">
          Spotlight mentions
        </h2>
        <p className="text-sm text-slate-500">
          Curated mix of high reach, trend-setting authors
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {mentionFeed.slice(0, 2).map((mention) => (
            <MentionCard key={mention.id} mention={mention} />
          ))}
        </div>
      </section>
    </div>
  );
}

