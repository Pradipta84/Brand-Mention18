interface KpiCardProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
}

export function KpiCard({ label, value, sublabel, trend }: KpiCardProps) {
  return (
    <div className="card-border-glow w-full max-w-full rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:shadow-md hover:shadow-slate-300/50">
      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-500 truncate">
        {label}
      </p>
      <div className="mt-2 sm:mt-3 flex items-end justify-between gap-2 min-w-0">
        <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900 truncate min-w-0">{value}</p>
        {trend && (
          <span
            className={`text-[10px] sm:text-xs font-semibold flex-shrink-0 ${
              trend.direction === "up" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend.direction === "up" ? "↗" : "↘"} {trend.value}
          </span>
        )}
      </div>
      {sublabel && (
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500 truncate">{sublabel}</p>
      )}
    </div>
  );
}

