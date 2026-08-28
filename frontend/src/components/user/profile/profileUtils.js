export function fmtDate(iso) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export function fmtDateTime(iso) {
  if (!iso) return "Never"
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

export function getInitials(name) {
  if (!name) return "?"
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export function completion(user) {
  if (!user) return 0
  const checks = [!!user.fullName, !!user.email, !!user.phone, !!user.profileImage]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function completionColor(pct) {
  if (pct >= 80) return "text-green-600"
  if (pct >= 50) return "text-brand"
  return "text-orange-500"
}

export function completionBarColor(pct) {
  if (pct >= 80) return "bg-green-500"
  if (pct >= 50) return "bg-brand"
  return "bg-orange-500"
}

export const ROLE_LABELS = {
  ROLE_JOB_SEEKER: "Job Seeker",
  ROLE_EMPLOYER:   "Employer",
  ROLE_ADMIN:      "Admin",
}

export const STATUS_CONFIG = {
  ACTIVE:    { cls: "bg-green-100 text-green-700",  label: "Active" },
  INACTIVE:  { cls: "bg-slate-100 text-slate-600",  label: "Inactive" },
  SUSPENDED: { cls: "bg-red-100 text-red-700",      label: "Suspended" },
  DELETED:   { cls: "bg-red-100 text-red-700",      label: "Deleted" },
}
