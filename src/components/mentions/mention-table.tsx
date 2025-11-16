import { Mention } from "@/lib/types";
import {
  formatShortNumber,
  formatTimestamp,
  sentimentBadgeColor,
} from "@/lib/utils";
import { ExternalLink, TrendingUp } from "lucide-react";

interface MentionTableProps {
  data: Mention[];
}

export function MentionTable({ data }: MentionTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-y-auto max-h-[1400px] scrollable-table">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Source
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Message
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sentiment
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Reach
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((mention) => (
              <tr key={mention.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    {mention.source}
                    {mention.spike && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                        <TrendingUp size={10} />
                        Spike
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {formatTimestamp(mention.publishedAt)}
                  </p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-800">{mention.author}</p>
                  <p className="line-clamp-2 text-slate-600">{mention.body}</p>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${sentimentBadgeColor(
                      mention.sentiment
                    )}`}
                  >
                    {mention.sentiment}
                  </span>
                </td>
                <td className="px-4 py-4 text-right text-sm font-semibold text-slate-700">
                  {formatShortNumber(mention.reach)}
                </td>
                <td className="px-4 py-4 text-right">
                  <a
                    href={mention.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-slate-900"
                  >
                    View
                    <ExternalLink size={14} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

