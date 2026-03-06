"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCheck,
  X,
} from "lucide-react";
import type { Notification, NotificationType } from "@/lib/hooks/useNotifications";

/* ------------------------------------------------------------------ */
/*  Icon + color mapping                                               */
/* ------------------------------------------------------------------ */

const typeConfig: Record<
  NotificationType,
  { icon: typeof UserPlus; color: string; bg: string }
> = {
  new_lead: {
    icon: UserPlus,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  upcoming_session: {
    icon: Calendar,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  overdue_payment: {
    icon: DollarSign,
    color: "text-orange-400",
    bg: "bg-orange-500/15",
  },
  no_show: {
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/15",
  },
};

/* ------------------------------------------------------------------ */
/*  Time helper                                                        */
/* ------------------------------------------------------------------ */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  if (isToday) {
    return `Today at ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow =
    d.getDate() === tomorrow.getDate() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getFullYear() === tomorrow.getFullYear();

  if (isTomorrow) {
    return `Tomorrow at ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  }

  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface NotificationPanelProps {
  notifications: Notification[];
  readIds: Set<string>;
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClose: () => void;
  loading: boolean;
}

export default function NotificationPanel({
  notifications,
  readIds,
  onMarkAsRead,
  onMarkAllRead,
  onClose,
  loading,
}: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Delay binding so the bell-click itself doesn't trigger close
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const handleItemClick = (notif: Notification) => {
    onMarkAsRead(notif.id);
    onClose();
    router.push(notif.href);
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] bg-slate-900 border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-500/20 text-orange-400">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-slate-700 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
              <CheckCheck className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">You&apos;re all caught up!</p>
            <p className="text-xs text-slate-600 mt-1">
              No new notifications
            </p>
          </div>
        ) : (
          notifications.map((notif) => {
            const config = typeConfig[notif.type];
            const Icon = config.icon;
            const isRead = readIds.has(notif.id);
            const isUpcoming = notif.type === "upcoming_session";

            return (
              <button
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer hover:bg-white/[0.03] border-b border-white/[0.04] last:border-b-0 ${
                  !isRead ? "bg-white/[0.02]" : ""
                }`}
              >
                {/* Icon */}
                <div
                  className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-xs font-semibold ${
                        isRead ? "text-slate-400" : "text-white"
                      }`}
                    >
                      {notif.title}
                    </p>
                    {!isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                    )}
                  </div>
                  <p
                    className={`text-xs mt-0.5 leading-relaxed ${
                      isRead ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    {isUpcoming
                      ? formatTime(notif.timestamp)
                      : timeAgo(notif.timestamp)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
