"use client";

import { useState, useEffect, Suspense, useRef, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Bell, Filter, Search, X, Menu } from "lucide-react";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";

interface TopNavContentProps {
  onMenuClick?: () => void;
}

function TopNavContent({ onMenuClick }: TopNavContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    channel: searchParams.get("channel") || "",
    sentiment: searchParams.get("sentiment") || "",
  });
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    role: "analyst",
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  // Load user profile from settings
  useEffect(() => {
    const loadProfile = () => {
      try {
        const saved = localStorage.getItem("brandWatchSettings");
        if (saved) {
          const settings = JSON.parse(saved);
          if (settings?.profile) {
            setUserProfile({
              name: settings.profile.name || "John Doe",
              role: settings.profile.role || "analyst",
            });
          }
        }
      } catch (error) {
        // Use default if error
      }
    };

    loadProfile();

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      loadProfile();
    };
    window.addEventListener("settingsUpdated", handleSettingsUpdate);
    window.addEventListener("storage", (e) => {
      if (e.key === "brandWatchSettings") {
        loadProfile();
      }
    });

    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, []);

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await fetch("/api/alerts");
        if (response.ok) {
          const data = await response.json();
          setNotificationCount(data.length);
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000);
    
    // Listen for notification count updates
    const handleNotificationUpdate = (event: CustomEvent) => {
      setNotificationCount(event.detail);
    };
    window.addEventListener("notificationCountUpdated", handleNotificationUpdate as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationCountUpdated", handleNotificationUpdate as EventListener);
    };
  }, []);

  // Get initials from name
  const getInitials = (name: string): string => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format role for display
  const formatRole = (role: string): string => {
    const roleMap: Record<string, string> = {
      analyst: "Brand Ops",
      manager: "Manager",
      admin: "Admin",
    };
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Close filters panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showFilters &&
        filterPanelRef.current &&
        filterButtonRef.current &&
        !filterPanelRef.current.contains(event.target as Node) &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  // Sync state with URL params on mount and when URL changes (only when URL actually changes)
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    const urlChannel = searchParams.get("channel") || "";
    const urlSentiment = searchParams.get("sentiment") || "";
    
    // Only update if different to avoid unnecessary re-renders
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
    if (urlChannel !== filters.channel || urlSentiment !== filters.sentiment) {
      setFilters({
        channel: urlChannel,
        sentiment: urlSentiment,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL when search or filters change (with debounce for search)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (filters.channel) params.set("channel", filters.channel);
      if (filters.sentiment) params.set("sentiment", filters.sentiment);

      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      
      const currentUrl = window.location.pathname + window.location.search;
      if (newUrl !== currentUrl) {
        startTransition(() => {
          router.push(newUrl, { scroll: false });
        });
      }
    }, query ? 300 : 0); // Debounce search, but apply filters immediately

    return () => clearTimeout(timeoutId);
  }, [query, filters, router]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ channel: "", sentiment: "" });
    setQuery("");
  };

  const hasActiveFilters = query || filters.channel || filters.sentiment;

  return (
    <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 border-b-2 border-slate-300 bg-white/80 px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 backdrop-blur">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="xl:hidden p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 text-slate-600 transition-colors flex-shrink-0 touch-manipulation"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="flex flex-1 items-center gap-1.5 sm:gap-2 md:gap-3 rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm shadow-slate-200/50 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 min-w-0 transition-all duration-200 hover:shadow-md hover:shadow-slate-300/50 hover:border-slate-300 focus-within:shadow-lg focus-within:shadow-slate-400/30 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200/50">
        <Search size={16} className="text-slate-400 flex-shrink-0 transition-colors duration-200 group-focus-within:text-slate-600" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
          className="w-full min-w-0 border-none bg-transparent text-xs sm:text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:placeholder:text-slate-300 transition-all duration-200"
          placeholder="Search mentions, authors..."
        />
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Clear filters"
          >
            <X size={14} />
          </button>
        )}
        <button
          ref={filterButtonRef}
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-1 rounded-full px-2 sm:px-3 py-1 text-xs font-medium transition-all duration-200 flex-shrink-0 touch-manipulation ${
            hasActiveFilters
              ? "bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/30 hover:shadow-lg hover:shadow-slate-900/40 hover:scale-105 active:scale-95"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300 hover:shadow-sm hover:scale-105 active:scale-95"
          }`}
        >
          <Filter size={12} />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[10px] font-semibold backdrop-blur-sm">
              {(filters.channel ? 1 : 0) + (filters.sentiment ? 1 : 0)}
            </span>
          )}
        </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div
          ref={filterPanelRef}
          className="absolute left-2 right-2 sm:left-4 sm:right-4 md:left-6 md:right-6 top-full mt-2 z-50 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-lg max-w-[calc(100vw-1rem)]"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Channel
              </label>
              <select
                value={filters.channel}
                onChange={(e) => handleFilterChange("channel", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">All Channels</option>
                <option value="twitter">Twitter</option>
                <option value="reddit">Reddit</option>
                <option value="news">News</option>
                <option value="blog">Blog</option>
                <option value="youtube">YouTube</option>
                <option value="forums">Forums</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Sentiment
              </label>
              <select
                value={filters.sentiment}
                onChange={(e) => handleFilterChange("sentiment", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <option value="">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-shrink-0">
        <button
          ref={notificationButtonRef}
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative rounded-full border border-slate-200 p-1.5 sm:p-2 hover:bg-slate-50 active:bg-slate-100 transition-colors touch-manipulation"
        >
          <Bell size={16} className="sm:w-[18px] sm:h-[18px] text-slate-600" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>
        {showNotifications && (
          <NotificationDropdown onClose={() => setShowNotifications(false)} />
        )}
        <Link
          href="/settings"
          className="flex items-center gap-1.5 sm:gap-2 rounded-lg px-1.5 sm:px-2 py-1 sm:py-1.5 hover:bg-slate-50 active:bg-slate-100 transition-colors touch-manipulation"
        >
          <div className="text-right text-xs hidden sm:block">
            <p className="font-semibold text-slate-700 truncate max-w-[100px]">{userProfile.name}</p>
            <p className="text-slate-400 text-[10px]">{formatRole(userProfile.role)}</p>
          </div>
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] sm:text-xs font-semibold text-white flex-shrink-0">
            {getInitials(userProfile.name)}
          </div>
        </Link>
      </div>
    </header>
  );
}

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <Suspense fallback={
      <header className="flex items-center justify-between border-b-2 border-slate-300 bg-white/80 px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 backdrop-blur">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="xl:hidden p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 text-slate-600 transition-colors flex-shrink-0 touch-manipulation"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          )}
          <div className="flex flex-1 items-center gap-1.5 sm:gap-2 md:gap-3 rounded-xl sm:rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-sm shadow-slate-200/50 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 min-w-0">
            <Search size={16} className="text-slate-400" />
            <input
              className="w-full border-none bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Search mentions, authors, topics..."
              disabled
            />
            <button className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-all duration-200 hover:bg-slate-200 hover:shadow-sm">
              <Filter size={12} />
              Filters
            </button>
          </div>
        </div>
      </header>
    }>
      <TopNavContent onMenuClick={onMenuClick} />
    </Suspense>
  );
}
