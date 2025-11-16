import { KpiCard } from "@/components/dashboard/kpi-card";
import { prisma } from "@/lib/prisma";

async function getAnalytics() {
  try {
    const days = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const [totalQueries, byStatus, byPriority, byChannel, tagStats, queriesWithResponse, resolvedQueries] = await Promise.all([
      (prisma as any).query.count({
        where: { receivedAt: { gte: cutoffDate } },
      }),
      (prisma as any).query.groupBy({
        by: ["status"],
        where: { receivedAt: { gte: cutoffDate } },
        _count: true,
      }),
      (prisma as any).query.groupBy({
        by: ["priority"],
        where: { receivedAt: { gte: cutoffDate } },
        _count: true,
      }),
      (prisma as any).query.groupBy({
        by: ["channel"],
        where: { receivedAt: { gte: cutoffDate } },
        _count: true,
      }),
      (prisma as any).queryTagRelation.groupBy({
        by: ["tagId"],
        where: {
          query: { receivedAt: { gte: cutoffDate } },
        },
        _count: true,
      }),
      (prisma as any).query.findMany({
        where: {
          receivedAt: { gte: cutoffDate },
          firstResponseAt: { not: null },
        },
        select: { receivedAt: true, firstResponseAt: true },
      }),
      (prisma as any).query.findMany({
        where: {
          receivedAt: { gte: cutoffDate },
          resolvedAt: { not: null },
        },
        select: { receivedAt: true, resolvedAt: true },
      }),
    ]);

    const tagDetails = await Promise.all(
      tagStats.map(async (stat: any) => {
        const tag = await (prisma as any).queryTag.findUnique({
          where: { id: stat.tagId },
        });
        return {
          tagId: stat.tagId,
          label: tag?.label || "Unknown",
          type: tag?.type || "GENERAL",
          count: stat._count,
        };
      })
    );

    const responseTimes = queriesWithResponse.map((q: any) => {
      const diff = q.firstResponseAt.getTime() - q.receivedAt.getTime();
      return diff / (1000 * 60 * 60);
    });

    const avgResponseHours =
      responseTimes.length > 0
        ? responseTimes.reduce((a: number, b: number) => a + b, 0) / responseTimes.length
        : 0;

    const resolutionTimes = resolvedQueries.map((q: any) => {
      const diff = q.resolvedAt.getTime() - q.receivedAt.getTime();
      return diff / (1000 * 60 * 60);
    });

    const avgResolutionHours =
      resolutionTimes.length > 0
        ? resolutionTimes.reduce((a: number, b: number) => a + b, 0) / resolutionTimes.length
        : 0;

    return {
      totals: {
        queries: totalQueries,
        responded: queriesWithResponse.length,
        resolved: resolvedQueries.length,
      },
      responseTimes: { averageHours: avgResponseHours },
      resolutionTimes: { averageHours: avgResolutionHours },
      byTag: tagDetails.sort((a, b) => b.count - a.count),
      byChannel: byChannel.map((item: any) => ({
        channel: item.channel,
        count: item._count,
      })),
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      totals: { queries: 0, responded: 0, resolved: 0 },
      responseTimes: { averageHours: 0 },
      resolutionTimes: { averageHours: 0 },
      byTag: [],
      byChannel: [],
    };
  }
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  const avgResponseHours = Math.round(analytics.responseTimes.averageHours * 10) / 10;
  const avgResolutionHours = Math.round(analytics.resolutionTimes.averageHours * 10) / 10;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Query Analytics
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-slate-900">
          Performance Metrics
        </h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Queries"
          value={analytics.totals.queries.toString()}
          sublabel="Last 30 days"
        />
        <KpiCard
          label="Response Rate"
          value={`${analytics.totals.queries > 0 ? Math.round((analytics.totals.responded / analytics.totals.queries) * 100) : 0}%`}
          sublabel={`${analytics.totals.responded} responded`}
        />
        <KpiCard
          label="Avg Response Time"
          value={`${avgResponseHours}h`}
          sublabel="Time to first response"
        />
        <KpiCard
          label="Avg Resolution Time"
          value={`${avgResolutionHours}h`}
          sublabel="Time to resolution"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Queries by Tag
          </h2>
          <div className="space-y-3">
            {analytics.byTag.slice(0, 10).map((item: any) => (
              <div key={item.tagId} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {item.label}
                </span>
                <span className="text-sm text-slate-500">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Queries by Channel
          </h2>
          <div className="space-y-3">
            {analytics.byChannel.map((item: any) => (
              <div key={item.channel} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {item.channel.replace("_", " ")}
                </span>
                <span className="text-sm text-slate-500">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

