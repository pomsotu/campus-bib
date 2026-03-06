"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useNotifications } from "@/lib/hooks/useNotifications";
import NotificationPanel from "./NotificationPanel";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sessions": "Sessions",
  "/leads": "Leads",
  "/settings": "Settings",
};

const pageDescriptions: Record<string, string> = {
  "/dashboard": "Overview of your campus service business",
  "/sessions": "Manage your upcoming and past sessions",
  "/leads": "Track and convert your leads pipeline",
  "/settings": "Configure your business preferences",
};

export default function Header({
  userEmail,
  clientId,
  onMenuToggle,
}: {
  userEmail: string | undefined;
  clientId: string | undefined;
  onMenuToggle: () => void;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";
  const description = pageDescriptions[pathname] ?? "";

  const [panelOpen, setPanelOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    readIds,
    markAsRead,
    markAllRead,
    loading: notifLoading,
  } = useNotifications(clientId);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-base font-semibold text-white tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block leading-tight">
            {description}
          </p>
        </div>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setPanelOpen((v) => !v)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer relative"
            aria-label="Notifications"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold rounded-full bg-orange-500 text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {panelOpen && (
            <NotificationPanel
              notifications={notifications}
              readIds={readIds}
              onMarkAsRead={markAsRead}
              onMarkAllRead={markAllRead}
              onClose={() => setPanelOpen(false)}
              loading={notifLoading}
            />
          )}
        </div>

        {/* User avatar */}
        {userEmail && (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-teal-500 text-white text-xs font-bold uppercase ring-2 ring-slate-950">
              {userEmail.charAt(0)}
            </div>
            <span className="text-sm text-slate-400 max-w-[160px] truncate hidden sm:block">
              {userEmail}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
