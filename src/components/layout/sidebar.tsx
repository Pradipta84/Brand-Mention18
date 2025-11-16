"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LifeBuoy, Network, Radar, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Radar", href: "/dashboard", icon: Radar },
  { label: "Competitors", href: "/competitors", icon: Network },
  { label: "Inbox", href: "/inbox", icon: LifeBuoy },
  { label: "Library", href: "/library", icon: Compass },
  { label: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-2 mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Brand Watch
          </p>
          <h1 className="text-xl font-semibold text-slate-900">
            Reputation AI
          </h1>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="xl:hidden p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 text-slate-600 transition-colors touch-manipulation flex-shrink-0"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors touch-manipulation",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 active:bg-slate-200"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl bg-slate-900 px-4 py-5 text-white">
        <p className="text-sm font-semibold">Need a deeper dive?</p>
        <p className="mt-1 text-xs text-slate-200">
          Summaries land in your inbox every morning at 8 AM.
        </p>
        <button className="mt-3 w-full rounded-xl bg-white/10 py-2 text-xs font-semibold">
          Schedule digest
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-64 flex-shrink-0 flex-col border-r-2 border-slate-500 bg-white/90 px-4 py-6 xl:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {onClose && (
        <>
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 xl:hidden"
              onClick={onClose}
            />
          )}
          <aside
            className={cn(
              "fixed top-0 left-0 h-full w-[280px] sm:w-64 flex-shrink-0 flex-col border-r-2 border-slate-500 bg-white z-50 px-3 sm:px-4 py-4 sm:py-6 transform transition-transform duration-300 ease-in-out xl:hidden overflow-y-auto",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

