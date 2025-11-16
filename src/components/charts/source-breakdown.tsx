import { SourceSplit } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SourceBreakdownProps {
  data: SourceSplit[];
}

export function SourceBreakdown({ data }: SourceBreakdownProps) {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between text-sm">
            <p className="font-medium text-slate-700">{item.label}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{item.value}%</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-semibold",
                  item.delta >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                )}
              >
                {item.delta >= 0 ? "+" : ""}
                {item.delta}%
              </span>
            </div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-900"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

