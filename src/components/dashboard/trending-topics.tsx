"use client";

import { Mention } from "@/lib/types";
import { Hash, TrendingUp } from "lucide-react";

interface TrendingTopicsProps {
  mentions: Mention[];
}

export function TrendingTopics({ mentions }: TrendingTopicsProps) {
  // Extract and count all topics
  const topicMap = new Map<string, { count: number; reach: number; sentiment: { positive: number; neutral: number; negative: number } }>();

  mentions.forEach((mention) => {
    mention.topics?.forEach((topic) => {
      const existing = topicMap.get(topic) || {
        count: 0,
        reach: 0,
        sentiment: { positive: 0, neutral: 0, negative: 0 },
      };

      existing.count += 1;
      existing.reach += mention.reach;
      existing.sentiment[mention.sentiment] += 1;

      topicMap.set(topic, existing);
    });
  });

  // Sort by count and take top 8
  const trendingTopics = Array.from(topicMap.entries())
    .map(([topic, data]) => ({ topic, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  if (trendingTopics.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Trending Topics</h2>
          </div>
          <span className="text-xs font-medium text-slate-500">Most mentioned</span>
        </div>
        <div className="py-8 text-center">
          <Hash className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600 mb-1">No topics yet</p>
          <p className="text-xs text-slate-500">Topics will appear here as mentions are analyzed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100/50 bg-white/80 backdrop-blur-md p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Hash className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Trending Topics</h2>
        </div>
        <span className="text-xs font-medium text-slate-500">Most mentioned</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {trendingTopics.map((item, index) => {
          const dominantSentiment = item.sentiment.positive > item.sentiment.negative 
            ? "positive" 
            : item.sentiment.negative > item.sentiment.positive 
            ? "negative" 
            : "neutral";
          
          const sentimentColor =
            dominantSentiment === "positive"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : dominantSentiment === "negative"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-slate-50 text-slate-700 border-slate-200";

          return (
            <div
              key={item.topic}
              className={`group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:scale-105 ${sentimentColor}`}
            >
              <Hash className="h-3.5 w-3.5" />
              <span className="text-sm font-semibold">{item.topic}</span>
              <span className="text-xs font-medium opacity-75">
                {item.count}
              </span>
              {index < 3 && (
                <TrendingUp className="h-3 w-3 opacity-75" />
              )}
            </div>
          );
        })}
      </div>
      {trendingTopics.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Showing top {trendingTopics.length} topics from {mentions.length} mentions
          </p>
        </div>
      )}
    </div>
  );
}

