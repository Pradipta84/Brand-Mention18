import { AlertItem } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { AlertTriangle, ArrowUpRight } from "lucide-react";

interface AlertDrawerProps {
  data: AlertItem[];
}

const severityColors: Record<
  AlertItem["severity"],
  { bg: string; text: string }
> = {
  low: { bg: "bg-slate-100", text: "text-slate-600" },
  medium: { bg: "bg-amber-100", text: "text-amber-700" },
  high: { bg: "bg-orange-100", text: "text-orange-700" },
  critical: { bg: "bg-rose-100", text: "text-rose-700" },
};

export function AlertDrawer({ data }: AlertDrawerProps) {
  return (
    <div className="space-y-4">
      {data.map((alert) => {
        const colors = severityColors[alert.severity];
        return (
          <article
            key={alert.id}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${colors.bg} ${colors.text}`}
              >
                <AlertTriangle size={12} />
                {alert.severity}
              </span>
              <span className="text-xs text-slate-400">
                {formatTimestamp(alert.createdAt)}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              {alert.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{alert.description}</p>
            {alert.actionLabel && (
              <button className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-slate-900">
                {alert.actionLabel}
                <ArrowUpRight size={14} />
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}

