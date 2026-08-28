import { cn } from "@/lib/utils"

const statusConfig = {
  PENDING_VERIFICATION: {
    label: "Pending",
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  ACTIVE: {
    label: "Active",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  SUSPENDED: {
    label: "Suspended",
    dot: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  REJECTED: {
    label: "Rejected",
    dot: "bg-slate-500",
    text: "text-slate-600",
    bg: "bg-slate-100",
    border: "border-slate-200",
  },
}

export default function CompanyStatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.PENDING_VERIFICATION

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
        cfg.bg,
        cfg.border
      )}
    >
      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", cfg.dot)} />
      <span className={cfg.text}>{cfg.label}</span>
    </div>
  )
}
