import { KpiCard } from "@/components/dashboard/kpi-card";
import { LibraryClient } from "./library-client";
import { prisma } from "@/lib/prisma";

async function getLibraryStats() {
  try {
    const [totalDocs, byType, byTeam, byProject] = await Promise.all([
      (prisma as any).document.count(),
      (prisma as any).document.groupBy({
        by: ["fileType"],
        _count: true,
      }),
      (prisma as any).document.groupBy({
        by: ["team"],
        _count: true,
        where: {
          team: { not: null },
        },
      }),
      (prisma as any).document.groupBy({
        by: ["project"],
        _count: true,
        where: {
          project: { not: null },
        },
      }),
    ]);

    const pdfCount = byType.find((item: any) => item.fileType === "PDF")?._count || 0;
    const recentCount = await (prisma as any).document.count({
      where: {
        indexedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    return {
      total: totalDocs,
      recent: recentCount,
      pdfCount,
      teams: byTeam.length,
      projects: byProject.length,
    };
  } catch (error) {
    console.error("Error fetching library stats:", error);
    return {
      total: 0,
      recent: 0,
      pdfCount: 0,
      teams: 0,
      projects: 0,
    };
  }
}

export default async function LibraryPage() {
  const stats = await getLibraryStats();

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6 md:space-y-8">
      <header className="w-full max-w-full">
        <p className="text-xs sm:text-sm font-medium uppercase tracking-wide text-slate-500">
          Knowledge Discovery
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">
            Document Library
          </h1>
          <span className="rounded-full bg-slate-900/10 px-2 sm:px-3 py-1 text-xs font-semibold text-slate-900 whitespace-nowrap">
            {stats.total} documents indexed
          </span>
        </div>
      </header>

      <section className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4 w-full max-w-full">
        <KpiCard
          label="Total Documents"
          value={stats.total.toString()}
          sublabel="All indexed files"
        />
        <KpiCard
          label="Recent (7d)"
          value={stats.recent.toString()}
          sublabel="Newly indexed"
        />
        <KpiCard
          label="Teams"
          value={stats.teams.toString()}
          sublabel="Active teams"
        />
        <KpiCard
          label="Projects"
          value={stats.projects.toString()}
          sublabel="Tracked projects"
        />
      </section>

      <LibraryClient />
    </div>
  );
}

