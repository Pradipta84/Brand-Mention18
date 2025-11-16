"use client";

import { useState, useEffect } from "react";
import { SentimentTrend } from "./sentiment-trend";
import { SentimentSeriesPoint } from "@/lib/types";
import { ChevronDown } from "lucide-react";

type TimeRange = "7d" | "28d" | "90d" | "1y" | "all";

interface SentimentTrendFilterProps {
  initialData: SentimentSeriesPoint[];
}

const timeRangeLabels: Record<TimeRange, string> = {
  "7d": "Last 7 days",
  "28d": "Last 28 days",
  "90d": "Last 90 days",
  "1y": "Last year",
  "all": "All time",
};

export function SentimentTrendFilter({ initialData }: SentimentTrendFilterProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("7d");
  const [data, setData] = useState<SentimentSeriesPoint[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/sentiment-trend?range=${selectedRange}`, {
          cache: "no-store",
        });
        if (response.ok) {
          const newData = await response.json();
          console.log(`Fetched ${newData?.length || 0} data points for range ${selectedRange}:`, newData);
          setData(newData || []);
        } else {
          console.error("Failed to fetch sentiment trend:", response.statusText);
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching sentiment trend:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRange]);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Sentiment trend</h2>
          <p className="text-sm text-slate-500">Aggregated across top 5 channels</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            {timeRangeLabels[selectedRange]}
            <ChevronDown size={14} className={showDropdown ? "rotate-180" : ""} />
          </button>
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-20 w-40 rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
                {Object.entries(timeRangeLabels).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setSelectedRange(value as TimeRange);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                      selectedRange === value
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-sm text-slate-500">Loading...</div>
        </div>
      ) : (
        <SentimentTrend data={data} />
      )}
    </div>
  );
}

