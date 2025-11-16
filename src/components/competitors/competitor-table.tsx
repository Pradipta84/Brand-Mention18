import { ExternalLink } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";

interface Competitor {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  updateCount: number;
  lastUpdate?: string;
}

interface CompetitorTableProps {
  competitors: Competitor[];
}

export function CompetitorTable({ competitors }: CompetitorTableProps) {
  if (competitors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-sm text-slate-500">
          No competitors tracked yet. Add competitors by ingesting updates.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Competitor
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Industry
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Updates
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Last Update
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {competitors.map((competitor) => (
            <tr key={competitor.id} className="hover:bg-slate-50/60">
              <td className="px-4 py-4">
                <div className="text-sm font-semibold text-slate-900">
                  {competitor.name}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-slate-600">
                {competitor.industry || "—"}
              </td>
              <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                {competitor.updateCount}
              </td>
              <td className="px-4 py-4 text-sm text-slate-600">
                {competitor.lastUpdate
                  ? formatTimestamp(competitor.lastUpdate)
                  : "—"}
              </td>
              <td className="px-4 py-4 text-right">
                {competitor.website && (
                  <a
                    href={competitor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-900"
                  >
                    Visit
                    <ExternalLink size={14} />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

