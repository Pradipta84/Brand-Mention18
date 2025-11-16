"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SentimentSeriesPoint } from "@/lib/types";

interface SentimentTrendProps {
  data: SentimentSeriesPoint[];
}

export function SentimentTrend({ data }: SentimentTrendProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-slate-500">No data available for this time period</p>
          <p className="text-xs text-slate-400 mt-1">Add mentions to see sentiment trends</p>
        </div>
      </div>
    );
  }

  // Log data for debugging
  console.log("SentimentTrend rendering with data:", data.length, "points", data);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 5, right: 10, left: 5, bottom: 20 }}
        >
          <defs>
            <linearGradient id="positive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="negative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="neutral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickFormatter={(value) => {
              // Format date for display
              try {
                if (value.includes("-") && value.split("-").length === 3) {
                  const parts = value.split("-");
                  // Check if it's a month format (YYYY-MM-01)
                  if (parts[2] === "01") {
                    return `${parts[1]}/${parts[0].slice(2)}`; // MM/YY for months
                  }
                  // For week grouping (week start dates), show MM/DD
                  // For day grouping, also show MM/DD
                  return `${parts[1]}/${parts[2]}`; // MM/DD
                }
                return value;
              } catch {
                return value;
              }
            }}
            interval="preserveStartEnd"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              borderColor: "#cbd5f5",
              fontSize: 12,
            }}
            labelFormatter={(value) => {
              try {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", { 
                  month: "short", 
                  day: "numeric",
                  year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
                });
              } catch {
                return value;
              }
            }}
            formatter={(value: number) => `${value}%`}
          />
          <Area
            type="monotone"
            dataKey="positive"
            stackId="1"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#positive)"
          />
          <Area
            type="monotone"
            dataKey="neutral"
            stackId="1"
            stroke="#94a3b8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#neutral)"
          />
          <Area
            type="monotone"
            dataKey="negative"
            stackId="1"
            stroke="#f43f5e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#negative)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

