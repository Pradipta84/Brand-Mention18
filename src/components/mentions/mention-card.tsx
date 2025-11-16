import { ExternalLink } from "lucide-react";
import { Mention } from "@/lib/types";
import { formatShortNumber, sentimentBadgeColor } from "@/lib/utils";
import { LiveTimestamp } from "@/components/shared/live-timestamp";

interface MentionCardProps {
  mention: Mention;
}

export function MentionCard({ mention }: MentionCardProps) {
  return (
    <article className="card-border-glow rounded-2xl bg-white p-4 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:shadow-md hover:shadow-slate-300/50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">{mention.source}</p>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${sentimentBadgeColor(
            mention.sentiment
          )}`}
        >
          {mention.sentiment}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-600">{mention.body}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <LiveTimestamp iso={mention.publishedAt} />
        <span>{formatShortNumber(mention.reach)} reach</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {mention.topics.map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
          >
            {topic}
          </span>
        ))}
      </div>

      <a
        href={mention.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-900"
      >
        Open thread
        <ExternalLink size={14} />
      </a>
    </article>
  );
}

