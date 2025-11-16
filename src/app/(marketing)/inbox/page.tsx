import { getQueries, getQueryStats } from "@/lib/data/query-server";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { QueryCard } from "@/components/queries/query-card";
import { QueryDetail } from "@/components/queries/query-detail";
import { Query } from "@/lib/data/query-server";
import { InboxClient } from "./inbox-client";

export default async function InboxPage() {
  const [queries, stats] = await Promise.all([
    getQueries(undefined, 100),
    getQueryStats(),
  ]);

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6 md:space-y-8">
      <header className="w-full max-w-full">
        <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-slate-500">
          Audience Query Management
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">
            Unified Inbox
          </h1>
          <span className="rounded-full bg-slate-900/10 px-2 sm:px-3 py-1 text-xs font-semibold text-slate-900 whitespace-nowrap">
            {stats.total} queries
          </span>
        </div>
      </header>

      <section className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 w-full max-w-full">
        <KpiCard
          label="New Queries"
          value={stats.new.toString()}
          sublabel="Awaiting response"
        />
        <KpiCard
          label="In Progress"
          value={stats.inProgress.toString()}
          sublabel="Being handled"
        />
        <KpiCard
          label="Urgent"
          value={stats.urgent.toString()}
          sublabel="Requires attention"
          trend={{ value: "!", direction: "up" }}
        />
        <KpiCard
          label="Resolved"
          value={stats.resolved.toString()}
          sublabel="Completed"
        />
      </section>

      <InboxClient initialQueries={queries} />
    </div>
  );
}

