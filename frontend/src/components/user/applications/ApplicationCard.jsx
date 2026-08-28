import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Clock, ExternalLink, X, CheckCircle2, AlertCircle,
  MapPin, Briefcase, Building2,
} from "lucide-react"

// ── Status config ─────────────────────────────────────────────────────────────

export const STATUS_CONFIG = {
  PENDING:             { label: "Pending",             color: "bg-blue-100 text-blue-700",    icon: Clock },
  REVIEWING:           { label: "Under Review",        color: "bg-yellow-100 text-yellow-700", icon: AlertCircle },
  SHORTLISTED:         { label: "Shortlisted",         color: "bg-purple-100 text-purple-700", icon: CheckCircle2 },
  INTERVIEW_SCHEDULED: { label: "Interview Scheduled", color: "bg-indigo-100 text-indigo-700", icon: CheckCircle2 },
  REJECTED:            { label: "Not Selected",        color: "bg-red-100 text-red-600",       icon: X },
  HIRED:               { label: "Hired",               color: "bg-green-100 text-green-700",   icon: CheckCircle2 },
  WITHDRAWN:           { label: "Withdrawn",           color: "bg-slate-100 text-slate-500",   icon: X },
}

export const PIPELINE = ["PENDING", "REVIEWING", "SHORTLISTED", "INTERVIEW_SCHEDULED", "HIRED"]

const JOB_TYPE_LABEL = {
  FULL_TIME: "Full-time", PART_TIME: "Part-time", CONTRACT: "Contract",
  INTERNSHIP: "Internship", FREELANCE: "Freelance", REMOTE: "Remote",
}
const WORK_MODE_LABEL = { REMOTE: "Remote", HYBRID: "Hybrid", ON_SITE: "On-site" }

function timeAgo(iso) {
  if (!iso) return ""
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (d === 0) return "Today"
  if (d === 1) return "Yesterday"
  if (d < 30) return `${d}d ago`
  return `${Math.floor(d / 30)}mo ago`
}

function fmtSalary(job) {
  if (!job) return null
  if (job.salaryDisclosed === false) return "Competitive"
  const fmt = (n) => {
    const num = Number(n)
    if (!num) return null
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
    return num.toLocaleString()
  }
  const sym = job.currency === "INR" ? "₹" : "$"
  const min = fmt(job.minSalary)
  const max = fmt(job.maxSalary)
  if (min && max) return `${sym}${min} – ${sym}${max}`
  if (min) return `${sym}${min}+`
  return null
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ApplicationCard({ app, onWithdraw }) {
  const cfg = STATUS_CONFIG[app.status] ?? { label: app.status, color: "bg-slate-100 text-slate-600", icon: Clock }
  const StatusIcon = cfg.icon
  const myPipelineIdx = PIPELINE.indexOf(app.status)
  const canWithdraw = !["REJECTED", "WITHDRAWN", "HIRED"].includes(app.status)

  const job = app.job
  const company = app?.company
  const jobTitle = job?.title ?? app.jobTitle ?? `Job #${app.jobId}`
  const location = job ? [job.city, job.country].filter(Boolean).join(", ") : null
  const salary = fmtSalary(job)

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">

          {/* Company logo */}
          <div className="h-12 w-12 rounded-xl border bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-full w-full object-fill"
                onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.removeProperty("display") }}
              />
            ) : null}
            <Building2 className={`h-5 w-5 text-slate-400 ${company?.logoUrl ? "hidden" : ""}`} />
          </div>

          <div className="flex-1 min-w-0">

            {/* Row 1: Title + status badge */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <Link
                  to={`/jobs/${app.jobId}`}
                  className="font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-1"
                >
                  {jobTitle}
                </Link>
                {company && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-slate-500 font-medium">{company.name}</span>
                    {company.verified && (
                      <CheckCircle2 className="h-3 w-3 fill-primary text-white shrink-0" />
                    )}
                    {company.industryType && (
                      <span className="text-xs text-slate-400">· {company.industryType.replace(/_/g, " ")}</span>
                    )}
                  </div>
                )}
                {job?.categoryName && (
                  <p className="text-xs text-slate-400 mt-0.5">{job.categoryName}</p>
                )}
              </div>
              <Badge className={`${cfg.color} text-xs shrink-0 flex items-center gap-1`}>
                <StatusIcon className="h-3 w-3" />
                {cfg.label}
              </Badge>
            </div>

            {/* Row 2: job meta */}
            {job && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {location}
                  </span>
                )}
                {JOB_TYPE_LABEL[job.jobType] && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 shrink-0" />
                    {JOB_TYPE_LABEL[job.jobType]}
                  </span>
                )}
                {WORK_MODE_LABEL[job.workMode] && (
                  <Badge variant="outline" className="text-[0.65rem] h-4 px-1.5">
                    {WORK_MODE_LABEL[job.workMode]}
                  </Badge>
                )}
                {salary && (
                  <span className="font-medium text-slate-700">{salary}</span>
                )}
              </div>
            )}

            {/* Progress pipeline */}
            {!["REJECTED", "WITHDRAWN"].includes(app.status) && (
              <div className="flex items-center gap-1 mb-3">
                {PIPELINE.map((s, i) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full flex-1 transition-colors ${
                      myPipelineIdx >= i ? "bg-primary" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            )}

            <Separator className="mb-3" />

            {/* Footer */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Applied {timeAgo(app.appliedAt)}
                </span>
                {app.updatedAt && app.updatedAt !== app.appliedAt && (
                  <span>Updated {timeAgo(app.updatedAt)}</span>
                )}
                {job?.openings != null && (
                  <span>{job.openings} opening{job.openings !== 1 ? "s" : ""}</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2" asChild>
                  <Link to={`/jobs/${app.jobId}`}>
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    View Job
                  </Link>
                </Button>
                {canWithdraw && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onWithdraw(app)}
                  >
                    Withdraw
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}
