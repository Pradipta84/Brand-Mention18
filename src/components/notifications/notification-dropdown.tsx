"use client";

import { useState, useEffect, useRef } from "react";
import { AlertItem } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { AlertTriangle, X, Check, Bell } from "lucide-react";
import Link from "next/link";

interface NotificationDropdownProps {
  onClose?: () => void;
}

const severityColors: Record<
  AlertItem["severity"],
  { bg: string; text: string; border: string }
> = {
  low: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  high: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  critical: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Notify parent when count changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("notificationCountUpdated", { detail: unreadCount })
      );
    }
  }, [unreadCount]);

  // Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/alerts");
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
          setUnreadCount(data.length);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update unread count when alerts change
  useEffect(() => {
    setUnreadCount(alerts.length);
  }, [alerts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  if (loading) {
    return (
      <div
        ref={dropdownRef}
        className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="p-6 text-center text-sm text-slate-500">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-slate-200 bg-white shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
              title="Mark all as read"
            >
              <Check size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <Bell size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-900">All caught up!</p>
            <p className="mt-1 text-xs text-slate-500">
              You have no new notifications
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => {
              const colors = severityColors[alert.severity];
              return (
                <div
                  key={alert.id}
                  className={`p-4 transition-colors hover:bg-slate-50 ${colors.bg}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colors.bg} ${colors.border} border`}
                    >
                      <AlertTriangle size={14} className={colors.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${colors.text} ${colors.bg}`}
                            >
                              {alert.severity}
                            </span>
                            <span className="text-xs text-slate-400">
                              {formatTimestamp(alert.createdAt)}
                            </span>
                          </div>
                          <h4 className="mt-1.5 text-sm font-semibold text-slate-900">
                            {alert.title}
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                            {alert.description}
                          </p>
                        </div>
                      </div>
                      {alert.actionLabel && (
                        <Link
                          href="/dashboard"
                          onClick={onClose}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700"
                        >
                          {alert.actionLabel}
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {alerts.length > 0 && (
        <div className="border-t border-slate-100 px-4 py-3">
          <Link
            href="/dashboard#alerts"
            onClick={() => {
              onClose?.();
            }}
            className="block text-center text-xs font-semibold text-slate-900 hover:text-slate-700 transition-colors"
          >
            View all alerts →
          </Link>
        </div>
      )}
    </div>
  );
}

