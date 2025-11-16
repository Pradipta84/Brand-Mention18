"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Trend {
  competitorId: string;
  competitorName: string;
  type: string;
  frequency: number;
  trend: "increasing" | "decreasing" | "stable";
  lastUpdate: Date;
}

interface TrendChartProps {
  trends: Trend[];
}

const COLORS = {
  increasing: "#10b981", // green
  decreasing: "#ef4444", // red
  stable: "#6b7280", // gray
};

export function TrendChart({ trends }: TrendChartProps) {
  if (trends.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-sm text-slate-500">No trend data available yet</p>
      </div>
    );
  }

  // Group by competitor and sum frequencies
  const competitorData = trends.reduce((acc, trend) => {
    if (!acc[trend.competitorName]) {
      acc[trend.competitorName] = {
        name: trend.competitorName,
        frequency: 0,
        trend: trend.trend,
      };
    }
    acc[trend.competitorName].frequency += trend.frequency;
    return acc;
  }, {} as Record<string, { name: string; frequency: number; trend: string }>);

  const data = Object.values(competitorData)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="frequency" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.trend as keyof typeof COLORS] || COLORS.stable}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-green-500" />
          <span className="text-slate-600">Increasing</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-gray-500" />
          <span className="text-slate-600">Stable</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-red-500" />
          <span className="text-slate-600">Decreasing</span>
        </div>
      </div>
    </div>
  );
}

