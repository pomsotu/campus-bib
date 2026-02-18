"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Sessions",  href: "/sessions",  icon: CalendarDays },
  { label: "Leads",     href: "/leads",     icon: Users },
  { label: "Settings",  href: "/settings",  icon: Settings },
];

export default function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden backdrop-enter"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-slate-950 border-r border-white/[0.06]
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ── Brand ── */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/[0.06]">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight tracking-tight">
              Campus Service
            </p>
            <p className="text-[11px] text-slate-500 leading-tight">
              Business-in-a-Box
            </p>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-orange-500/10 text-orange-400"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-orange-500" />
                )}
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-orange-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Logout ── */}
        <div className="px-3 py-4 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" />
            {loggingOut ? "Signing out…" : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
