import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin, Building2, DollarSign, Clock, Bookmark,
  Users, Briefcase, CheckCircle2,
} from "lucide-react"
import { saveJob, unsaveJob } from "@/store/savedJob/savedJobThunk"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ── Helpers (mirrored from JobDetails) ────────────────────────────────────────

function fmtSalary(val, currency = "USD") {
  if (!val) return null
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(val)
}

function salaryLabel(job) {
  if (job.salaryDisclosed === false) return "Salary negotiable"
  if (job.minSalary && job.maxSalary)
    return `${fmtSalary(job.minSalary, job.currency)} – ${fmtSalary(job.maxSalary, job.currency)}`
  if (job.minSalary) return `From ${fmtSalary(job.minSalary, job.currency)}`
  return null
}

function timeAgo(iso) {
  if (!iso) return null
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (d === 0) return "Today"
  if (d === 1) return "Yesterday"
  if (d < 30) return `${d} days ago`
  return `${Math.floor(d / 30)} months ago`
}

function labelJobType(v) {
  if (!v) return ""
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

const STATUS_COLORS = {
  OPEN:    "bg-green-100 text-green-700",
  DRAFT:   "bg-yellow-100 text-yellow-700",
  CLOSED:  "bg-slate-100 text-slate-600",
  EXPIRED: "bg-red-100 text-red-600",
  FILLED:  "bg-blue-100 text-blue-700",
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function JobCard({ job }) {
  const dispatch = useDispatch()
  const { savedJobMap, isActionLoading } = useSelector((s) => s.savedJob)
  const myApplications = useSelector((s) => s.application.myApplications)
  const isSaved = !!savedJobMap[job.id]
  const savedJobId = savedJobMap[job.id]
  const hasApplied = myApplications.some(
    (a) => a.jobId === job.id && a.status !== "WITHDRAWN"
  )

  const handleSaveToggle = async (e) => {
    e.preventDefault()
    if (isSaved) {
      const result = await dispatch(unsaveJob(savedJobId))
      if (!result.error) toast.success("Job removed from saved list")
      else toast.error(result.payload)
    } else {
      const result = await dispatch(
        saveJob({ jobId: job.id, companyId: job.company?.id ?? job.companyId })
      )
      if (!result.error) toast.success("Job saved!")
      else toast.error(result.payload)
    }
  }

  const skills = job.skills
    ? (Array.isArray(job.skills) ? job.skills : Array.from(job.skills))
    : job.skillNames
      ? [...job.skillNames].map((name) => ({ name }))
      : []

  const location = [job.city, job.state, job.country].filter(Boolean).join(", ")
  const salary   = salaryLabel(job)
  const posted   = timeAgo(job.createdAt)

  return (
    <Link to={`/jobs/${job.id}`} className="block group">
      <Card className="transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">

            {/* Company Logo — same size as JobDetails header */}
            <div className="h-16 w-16 rounded-xl border border-slate-200s bg-slate-50s flex items-center justify-center shrink-0 overflow-hidden">
              {job.company?.logoUrl ? (
                <img
                  src={job.company?.logoUrl || "https://cdn.pixabay.com/photo/2020/09/19/23/42/architecture-5585737_1280.jpg"}
                  alt={job.company.name}
                  className="h-full w-full object-fill "
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextSibling.style.removeProperty("display")
                  }}
                />
              ) : null}
              <Building2 className={cn("h-8 w-8 text-slate-400s", job.company?.logoUrl ? "hidden" : "")} />
            </div>

            <div className="flex-1 min-w-0">

              {/* Title row + Bookmark */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug line-clamp-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span className="text-slate-700 font-medium text-sm">
                      {job.company?.name ?? `Company #${job.companyId}`}
                    </span>
                    {job.company?.verified && (
                      <CheckCircle2 className="h-4 w-4 fill-primary text-white shrink-0" />
                    )}
                    {job.company?.industryType && (
                      <span className="text-slate-400 text-sm">
                        · {job.company.industryType.replace(/_/g, " ")}
                      </span>
                    )}
                    {job.company?.companySize && (
                      <span className="text-slate-400 text-sm">
                        · {job.company.companySize} company
                      </span>
                    )}
                  </div>
                  {job.company?.tagline && (
                    <p className="text-slate-400 text-xs mt-0.5 italic">{job.company.tagline}</p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isActionLoading}
                  onClick={handleSaveToggle}
                  className={cn("shrink-0", isSaved && "text-primary")}
                >
                  <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
                </Button>
              </div>

              {/* Meta row — same as JobDetails */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600 mb-4">
                {location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {location}
                  </div>
                )}
                {job.jobType && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    {labelJobType(job.jobType)}
                  </div>
                )}
                {salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 shrink-0" />
                    {salary}
                  </div>
                )}
                {posted && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 shrink-0" />
                    Posted {posted}
                  </div>
                )}
              </div>

              {/* Badges — same as JobDetails */}
              <div className="flex flex-wrap gap-2">
                {job.status && (
                  <Badge className={STATUS_COLORS[job.status] ?? ""}>{job.status}</Badge>
                )}
                {job.workMode && (
                  <Badge variant="outline">{labelJobType(job.workMode)}</Badge>
                )}
                {job.experienceLevel && (
                  <Badge variant="outline">{labelJobType(job.experienceLevel)}</Badge>
                )}
                {(job.category?.name || job.categoryName) && (
                  <Badge variant="secondary">{job.category?.name ?? job.categoryName}</Badge>
                )}
                {skills.slice(0, 5).map((s) => (
                  <Badge key={s.id ?? s.skillName ?? s.name} variant="outline">
                    {s.skillName ?? s.name}
                  </Badge>
                ))}
                {skills.length > 5 && (
                  <Badge variant="outline">+{skills.length - 5} more</Badge>
                )}
              </div>

              {/* Footer: stats + action */}
              {(job.applicationCount != null || true) && (
                <>
                  <Separator className="mt-4 mb-3" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {job.applicationCount != null && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {job.applicationCount} applicants
                        </span>
                      )}
                      {job.openings != null && (
                        <span>{job.openings} opening{job.openings !== 1 ? "s" : ""}</span>
                      )}
                    </div>

                    {hasApplied ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        onClick={(e) => e.preventDefault()}
                        className="text-xs h-7 text-green-600 border-green-200 bg-green-50 hover:bg-green-50"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Applied
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={(e) => e.preventDefault()}
                        className="text-xs h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Quick Apply
                      </Button>
                    )}
                  </div>
                </>
              )}

            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
