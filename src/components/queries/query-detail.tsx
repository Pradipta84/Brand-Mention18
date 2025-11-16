"use client";

import { Query } from "@/lib/data/query-server";
import { format } from "date-fns";
import { LiveTimestamp } from "@/components/shared/live-timestamp";
import { 
  Mail, 
  MessageSquare, 
  User,
  Tag,
  Clock,
  CheckCircle2,
  X,
  Send,
  AlertCircle,
  Trash2
} from "lucide-react";
import { useState } from "react";

interface QueryDetailProps {
  query: Query;
  onClose: () => void;
  onStatusChange?: (queryId: string, status: string) => void;
  onPriorityChange?: (queryId: string, priority: string) => void;
  onAssign?: (queryId: string, assigneeId: string) => void;
  onDelete?: (queryId: string) => void;
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

export function QueryDetail({ 
  query, 
  onClose, 
  onStatusChange,
  onPriorityChange,
  onAssign,
  onDelete
}: QueryDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState(query.status);
  const [selectedPriority, setSelectedPriority] = useState(query.priority);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this query? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await fetch(`/api/queries/${query.id}`, {
        method: "DELETE",
      });
      onDelete?.(query.id);
      onClose();
    } catch (error) {
      console.error("Error deleting query:", error);
      alert("Failed to delete query. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    onStatusChange?.(query.id, newStatus);
  };

  const handlePriorityChange = (newPriority: string) => {
    setSelectedPriority(newPriority);
    onPriorityChange?.(query.id, newPriority);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {query.subject || "Query Details"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Received <LiveTimestamp iso={query.receivedAt} />
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Channel</label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {query.channel.replace("_", " ")}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">Author</label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {query.authorName}
                {query.authorEmail && (
                  <span className="text-slate-500"> ({query.authorEmail})</span>
                )}
              </p>
            </div>
          </div>

          {/* Priority & Status Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="LOW" className="text-slate-900">Low</option>
                <option value="MEDIUM" className="text-slate-900">Medium</option>
                <option value="HIGH" className="text-slate-900">High</option>
                <option value="URGENT" className="text-slate-900">Urgent</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="NEW" className="text-slate-900">New</option>
                <option value="ASSIGNED" className="text-slate-900">Assigned</option>
                <option value="IN_PROGRESS" className="text-slate-900">In Progress</option>
                <option value="WAITING_CUSTOMER" className="text-slate-900">Waiting Customer</option>
                <option value="RESOLVED" className="text-slate-900">Resolved</option>
                <option value="CLOSED" className="text-slate-900">Closed</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {query.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  <Tag size={12} />
                  {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">
              Message
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900 whitespace-pre-wrap">
                {query.body}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500 mb-3 block">
              History
            </label>
            <div className="space-y-3">
              {query.history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <div className="mt-0.5">
                    <Clock size={14} className="text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {entry.action.replace("_", " ")}
                    </p>
                    {entry.oldValue && entry.newValue && (
                      <p className="text-xs text-slate-600 mt-1">
                        {entry.oldValue} → {entry.newValue}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="text-xs text-slate-500 mt-1">{entry.notes}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {format(new Date(entry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end border-t border-slate-200 bg-white px-6 py-4 flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete Query"}
          </button>
        </div>
      </div>
    </div>
  );
}

