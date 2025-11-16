"use client";

import { useState } from "react";
import { Query } from "@/lib/data/query-server";
import { QueryCard } from "@/components/queries/query-card";
import { QueryDetail } from "@/components/queries/query-detail";
import { Filter, Search } from "lucide-react";

interface InboxClientProps {
  initialQueries: Query[];
}

export function InboxClient({ initialQueries }: InboxClientProps) {
  const [queries] = useState<Query[]>(initialQueries);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [filter, setFilter] = useState<{
    status?: string;
    priority?: string;
    channel?: string;
  }>({});

  const filteredQueries = queries.filter((q) => {
    if (filter.status && q.status !== filter.status) return false;
    if (filter.priority && q.priority !== filter.priority) return false;
    if (filter.channel && q.channel !== filter.channel) return false;
    return true;
  });

  const handleStatusChange = async (queryId: string, status: string) => {
    try {
      await fetch(`/api/queries/${queryId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      // Refresh or update local state
      window.location.reload();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityChange = async (queryId: string, priority: string) => {
    try {
      await fetch(`/api/queries/${queryId}/priority`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleDelete = (queryId: string) => {
    // Remove from local state and reload
    window.location.reload();
  };

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-6">
      {/* Filters */}
      <div className="w-full max-w-full rounded-xl border border-slate-200 bg-white p-3 sm:p-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 flex-shrink-0" />
            <select
              value={filter.status || ""}
              onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
              className="flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="" className="text-slate-900">All Status</option>
              <option value="NEW" className="text-slate-900">New</option>
              <option value="ASSIGNED" className="text-slate-900">Assigned</option>
              <option value="IN_PROGRESS" className="text-slate-900">In Progress</option>
              <option value="WAITING_CUSTOMER" className="text-slate-900">Waiting Customer</option>
              <option value="RESOLVED" className="text-slate-900">Resolved</option>
              <option value="CLOSED" className="text-slate-900">Closed</option>
            </select>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <select
              value={filter.priority || ""}
              onChange={(e) => setFilter({ ...filter, priority: e.target.value || undefined })}
              className="flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="" className="text-slate-900">All Priorities</option>
              <option value="URGENT" className="text-slate-900">Urgent</option>
              <option value="HIGH" className="text-slate-900">High</option>
              <option value="MEDIUM" className="text-slate-900">Medium</option>
              <option value="LOW" className="text-slate-900">Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <select
              value={filter.channel || ""}
              onChange={(e) => setFilter({ ...filter, channel: e.target.value || undefined })}
              className="flex-1 min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="" className="text-slate-900">All Channels</option>
              <option value="EMAIL" className="text-slate-900">Email</option>
              <option value="TWITTER" className="text-slate-900">Twitter</option>
              <option value="REDDIT" className="text-slate-900">Reddit</option>
              <option value="CHAT" className="text-slate-900">Chat</option>
              <option value="FORUM" className="text-slate-900">Forum</option>
              <option value="SUPPORT_TICKET" className="text-slate-900">Support Ticket</option>
            </select>
          </div>
          <div className="flex items-center justify-center sm:justify-end text-xs sm:text-sm text-slate-500 whitespace-nowrap flex-shrink-0 px-2">
            <span className="hidden sm:inline">{filteredQueries.length} of {queries.length} queries</span>
            <span className="sm:hidden">{filteredQueries.length}/{queries.length}</span>
          </div>
        </div>
      </div>

      {/* Query List */}
      <div className="grid gap-3 sm:gap-4 w-full max-w-full">
        {filteredQueries.length > 0 ? (
          filteredQueries.map((query) => (
            <QueryCard
              key={query.id}
              query={query}
              onSelect={setSelectedQuery}
            />
          ))
        ) : (
          <div className="w-full max-w-full rounded-xl sm:rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 sm:p-8 md:p-12 text-center">
            <p className="text-xs sm:text-sm text-slate-500 px-2">
              No queries found matching your filters.
            </p>
          </div>
        )}
      </div>

      {/* Query Detail Modal */}
      {selectedQuery && (
        <QueryDetail
          query={selectedQuery}
          onClose={() => setSelectedQuery(null)}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

