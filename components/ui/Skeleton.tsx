export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`skeleton h-32 rounded-2xl ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3" aria-hidden="true">
      <div className="skeleton w-8 h-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-3/5 rounded" />
        <div className="skeleton h-3 w-2/5 rounded" />
      </div>
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="skeleton h-14 rounded-xl" />
      ))}
    </div>
  );
}
