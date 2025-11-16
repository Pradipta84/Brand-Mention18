import { ExternalLink, TrendingUp, DollarSign, Megaphone, Package, AlertTriangle } from "lucide-react";
import { LiveTimestamp } from "@/components/shared/live-timestamp";

interface UpdateCardProps {
  update: {
    id: string;
    competitorName: string;
    type: string;
    title: string;
    description: string;
    sourceUrl?: string;
    sourceChannel: string;
    publishedAt: string;
    impact: string;
  };
}

const typeIcons: Record<string, any> = {
  PRICING: DollarSign,
  CAMPAIGN: Megaphone,
  RELEASE: Package,
  FEATURE: Package,
  PARTNERSHIP: TrendingUp,
  ANNOUNCEMENT: Megaphone,
  OTHER: AlertTriangle,
};

const typeColors: Record<string, string> = {
  PRICING: "bg-amber-100 text-amber-700",
  CAMPAIGN: "bg-blue-100 text-blue-700",
  RELEASE: "bg-green-100 text-green-700",
  FEATURE: "bg-purple-100 text-purple-700",
  PARTNERSHIP: "bg-indigo-100 text-indigo-700",
  ANNOUNCEMENT: "bg-slate-100 text-slate-700",
  OTHER: "bg-gray-100 text-gray-700",
};

const impactColors: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-amber-100 text-amber-700",
  HIGH: "bg-orange-100 text-orange-700",
  CRITICAL: "bg-rose-100 text-rose-700",
};

export function UpdateCard({ update }: UpdateCardProps) {
  const Icon = typeIcons[update.type] || AlertTriangle;
  const typeColor = typeColors[update.type] || typeColors.OTHER;
  const impactColor = impactColors[update.impact] || impactColors.MEDIUM;

  return (
    <article className="card-border-glow rounded-2xl bg-white p-5 shadow-sm shadow-slate-200/50 transition-all duration-300 hover:shadow-md hover:shadow-slate-300/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-slate-900">
              {update.competitorName}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${typeColor}`}
            >
              <Icon size={12} />
              {update.type.toLowerCase()}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${impactColor}`}
            >
              {update.impact.toLowerCase()}
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            {update.title}
          </h3>
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {update.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <LiveTimestamp iso={update.publishedAt} />
            <span className="capitalize">{update.sourceChannel.toLowerCase()}</span>
            {update.sourceUrl && (
              <a
                href={update.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"
              >
                View source
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

