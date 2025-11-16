"use client";

import { Query } from "@/lib/data/query-server";
import { LiveTimestamp } from "@/components/shared/live-timestamp";
import { 
  Mail, 
  MessageSquare, 
  AlertCircle, 
  Clock, 
  CheckCircle2,
  User,
  Tag,
  ArrowRight
} from "lucide-react";

interface QueryCardProps {
  query: Query;
  onSelect?: (query: Query) => void;
}

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-800 border-red-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  LOW: "bg-slate-100 text-slate-800 border-slate-200",
};

const statusColors: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  ASSIGNED: "bg-purple-100 text-purple-800",
  IN_PROGRESS: "bg-indigo-100 text-indigo-800",
  WAITING_CUSTOMER: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-green-100 text-green-800",
  CLOSED: "bg-slate-100 text-slate-800",
};

const channelIcons: Record<string, any> = {
  EMAIL: Mail,
  TWITTER: MessageSquare,
  REDDIT: MessageSquare,
  CHAT: MessageSquare,
  FORUM: MessageSquare,
  SUPPORT_TICKET: AlertCircle,
  OTHER: MessageSquare,
};

export function QueryCard({ query, onSelect }: QueryCardProps) {
  const ChannelIcon = channelIcons[query.channel] || MessageSquare;

  return (
    <div
      className={`card-border-glow w-full max-w-full rounded-xl bg-white p-3 sm:p-4 transition-all duration-300 hover:shadow-md hover:shadow-slate-300/50 cursor-pointer ${
        query.priority === "URGENT" ? "ring-2 ring-red-200" : ""
      }`}
      onClick={() => onSelect?.(query)}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4 min-w-0">
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
            <ChannelIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase whitespace-nowrap">
              {query.channel.replace("_", " ")}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">•</span>
            <LiveTimestamp iso={query.receivedAt} className="text-[10px] sm:text-xs text-slate-400" />
          </div>

          {query.subject && (
            <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-1 line-clamp-1">
              {query.subject}
            </h3>
          )}

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-2 sm:mb-3">
            {query.body}
          </p>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {query.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-0.5 sm:gap-1 rounded-full bg-slate-100 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-slate-700 whitespace-nowrap"
              >
                <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {tag.label}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span
              className={`inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold border whitespace-nowrap ${priorityColors[query.priority]}`}
            >
              {query.priority}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold whitespace-nowrap ${statusColors[query.status]}`}
            >
              {query.status.replace("_", " ")}
            </span>
            {query.assignee && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-slate-600 truncate max-w-[120px] sm:max-w-none">
                <User className="w-3 h-3 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">{query.assignee.name || query.assignee.email}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 sm:gap-2 flex-shrink-0">
          {query.firstResponseAt && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600 whitespace-nowrap">
              <CheckCircle2 className="w-3 h-3 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Responded</span>
            </div>
          )}
          {!query.firstResponseAt && (
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-600 whitespace-nowrap">
              <Clock className="w-3 h-3 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Pending</span>
            </div>
          )}
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
}

