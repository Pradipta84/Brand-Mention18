"use client";

import { Mention } from "@/lib/types";
import { formatShortNumber } from "@/lib/utils";
import { TrendingUp, Users } from "lucide-react";

interface TopInfluencersProps {
  mentions: Mention[];
}

export function TopInfluencers({ mentions }: TopInfluencersProps) {
  // Group mentions by author and calculate total reach
  const influencerMap = new Map<string, { author: string; reach: number; count: number; sentiment: { positive: number; neutral: number; negative: number } }>();

  mentions.forEach((mention) => {
    const existing = influencerMap.get(mention.author) || {
      author: mention.author,
      reach: 0,
      count: 0,
      sentiment: { positive: 0, neutral: 0, negative: 0 },
    };

    existing.reach += mention.reach;
    existing.count += 1;
    existing.sentiment[mention.sentiment] += 1;

    influencerMap.set(mention.author, existing);
  });

  // Sort by total reach and take top 5
  const topInfluencers = Array.from(influencerMap.values())
    .sort((a, b) => b.reach - a.reach)
    .slice(0, 5);

  if (topInfluencers.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Top Influencers</h2>
          </div>
          <span className="text-xs font-medium text-slate-500">By reach</span>
        </div>
        <div className="py-8 text-center">
          <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600 mb-1">No influencer data yet</p>
          <p className="text-xs text-slate-500">Influencers will appear here as mentions are added</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100/50 bg-white/80 backdrop-blur-md p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Top Influencers</h2>
        </div>
        <span className="text-xs font-medium text-slate-500">By reach</span>
      </div>
      <div className="space-y-3">
        {topInfluencers.map((influencer, index) => {
          const dominantSentiment = influencer.sentiment.positive > influencer.sentiment.negative 
            ? "positive" 
            : influencer.sentiment.negative > influencer.sentiment.positive 
            ? "negative" 
            : "neutral";
          
          return (
            <div
              key={influencer.author}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {influencer.author}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">
                      {influencer.count} {influencer.count === 1 ? "mention" : "mentions"}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span
                      className={`text-xs font-medium ${
                        dominantSentiment === "positive"
                          ? "text-emerald-600"
                          : dominantSentiment === "negative"
                          ? "text-rose-600"
                          : "text-slate-600"
                      }`}
                    >
                      {dominantSentiment}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {formatShortNumber(influencer.reach)}
                  </p>
                  <p className="text-xs text-slate-500">reach</p>
                </div>
                {index === 0 && (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

