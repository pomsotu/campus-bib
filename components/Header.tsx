"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sessions": "Sessions",
  "/leads": "Leads",
  "/settings": "Settings",
};

export default function Header({
  userEmail,
  onMenuToggle,
}: {
  userEmail: string | undefined;
  onMenuToggle: () => void;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      {/* Right: user email */}
      {userEmail && (
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 text-xs font-bold uppercase">
            {userEmail.charAt(0)}
          </div>
          <span className="text-sm text-slate-400 max-w-[180px] truncate">
            {userEmail}
          </span>
        </div>
      )}
    </header>
  );
}
