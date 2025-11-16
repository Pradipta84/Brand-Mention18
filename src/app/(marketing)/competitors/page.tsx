import {
  getCompetitors,
  getCompetitorUpdates,
  getCompetitorStats,
  getCompetitorTrends,
} from "@/lib/data/competitor-server";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { CompetitorTable } from "@/components/competitors/competitor-table";
import { UpdateCard } from "@/components/competitors/update-card";
import { TrendChart } from "@/components/competitors/trend-chart";

export default async function CompetitorsPage() {
  const [competitors, updates, stats, trends] = await Promise.all([
    getCompetitors(),
    getCompetitorUpdates(20),
    getCompetitorStats(),
    getCompetitorTrends(30),
  ]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Competitive Intelligence
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-slate-900">
            Competitor Landscape
          </h1>
          <span className="rounded-full bg-slate-900/10 px-3 py-1 text-xs font-semibold text-slate-900">
            Live · updated every hour
          </span>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Competitors Tracked"
          value={stats.totalCompetitors.toString()}
          sublabel="Active monitoring"
        />
        <KpiCard
          label="Total Updates"
          value={stats.totalUpdates.toString()}
          sublabel="All time"
        />
        <KpiCard
          label="Recent (7d)"
          value={stats.recentUpdates.toString()}
          sublabel="New activity"
        />
        <KpiCard
          label="High Impact"
          value={stats.highImpactUpdates.toString()}
          sublabel="Requires attention"
          trend={{ value: "!", direction: "up" }}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Recent Updates
              </h2>
              <p className="text-sm text-slate-500">
                Latest competitor activities across all channels
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {updates.length > 0 ? (
              updates.map((update) => (
                <UpdateCard key={update.id} update={update} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">
                  No competitor updates yet. Start monitoring by ingesting updates.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Trends</h2>
            <p className="text-sm text-slate-500">
              Activity patterns (last 30 days)
            </p>
          </div>
          <TrendChart trends={trends} />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Tracked Competitors
            </h2>
            <p className="text-sm text-slate-500">
              All competitors under monitoring
            </p>
          </div>
        </div>
        <CompetitorTable competitors={competitors} />
      </section>
    </div>
  );
}

