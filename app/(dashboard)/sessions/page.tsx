export default function SessionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Sessions</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Upcoming &amp; Past Sessions</h2>
        </div>
        <p className="text-slate-400">
          This page will display your sessions — scheduled, completed,
          cancelled, and no-show sessions with details and status tracking.
        </p>
      </div>
    </div>
  );
}
