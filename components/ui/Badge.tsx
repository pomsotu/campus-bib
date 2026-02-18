import type { LeadStatus, SessionStatus, PaymentStatus } from "@/types/database.types";

/* ------------------------------------------------------------------ */
/*  Status → color mapping                                             */
/* ------------------------------------------------------------------ */

const leadColors: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  new:       { bg: "bg-blue-500/15",    text: "text-blue-400",    dot: "bg-blue-400"    },
  qualified: { bg: "bg-amber-500/15",   text: "text-amber-400",   dot: "bg-amber-400"   },
  booked:    { bg: "bg-indigo-500/15",  text: "text-indigo-400",  dot: "bg-indigo-400"  },
  completed: { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  cold:      { bg: "bg-slate-500/15",   text: "text-slate-400",   dot: "bg-slate-400"   },
};

const sessionColors: Record<SessionStatus, { bg: string; text: string; dot: string }> = {
  scheduled:   { bg: "bg-blue-500/15",    text: "text-blue-400",    dot: "bg-blue-400"    },
  completed:   { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  cancelled:   { bg: "bg-red-500/15",     text: "text-red-400",     dot: "bg-red-400"     },
  "no-show":   { bg: "bg-amber-500/15",   text: "text-amber-400",   dot: "bg-amber-400"   },
  rescheduled: { bg: "bg-violet-500/15",  text: "text-violet-400",  dot: "bg-violet-400"  },
};

const paymentColors: Record<PaymentStatus, { bg: string; text: string; dot: string }> = {
  paid:    { bg: "bg-emerald-500/15", text: "text-emerald-400", dot: "bg-emerald-400" },
  pending: { bg: "bg-orange-500/15",  text: "text-orange-400",  dot: "bg-orange-400"  },
  overdue: { bg: "bg-red-500/15",     text: "text-red-400",     dot: "bg-red-400"     },
};

type BadgeVariant = "lead" | "session" | "payment";

function getColors(variant: BadgeVariant, status: string) {
  if (variant === "lead")    return leadColors[status as LeadStatus]    ?? leadColors.cold;
  if (variant === "session") return sessionColors[status as SessionStatus] ?? sessionColors.scheduled;
  return paymentColors[status as PaymentStatus] ?? paymentColors.pending;
}

export default function Badge({
  status,
  variant = "lead",
}: {
  status: string;
  variant?: BadgeVariant;
}) {
  const colors = getColors(variant, status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colors.bg} ${colors.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {status.replace("-", " ")}
    </span>
  );
}
