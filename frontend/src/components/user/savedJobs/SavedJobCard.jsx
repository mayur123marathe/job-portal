import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Bookmark, MapPin, Clock, Building2,
  Trash2, ExternalLink, CheckCircle2,
} from "lucide-react"
import api from "@/store/api"
import { cn } from "@/lib/utils"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSalary(min, max, currency = "USD", disclosed = true) {
  if (!disclosed) return "Competitive salary"
  const fmt = (n) => {
    const num = Number(n)
    if (!num) return null
    if (num >= 100000) return `${(num / 1000).toFixed(0)}k`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return num.toLocaleString()
  }
  const minFmt = fmt(min)
  const maxFmt = fmt(max)
  if (!minFmt && !maxFmt) return null
  const sym = currency === "USD" ? "$" : currency === "INR" ? "₹" : currency
  if (minFmt && maxFmt) return `${sym}${minFmt} – ${sym}${maxFmt}`
  if (minFmt) return `${sym}${minFmt}+`
  return `Up to ${sym}${maxFmt}`
}

function timeAgo(dateStr) {
  if (!dateStr) return null
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

function labelJobType(v) {
  if (!v) return ""
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

const JOB_TYPE_STYLE = {
  FULL_TIME:  "bg-blue-50 text-blue-700 border-blue-200",
  PART_TIME:  "bg-violet-50 text-violet-700 border-violet-200",
  CONTRACT:   "bg-orange-50 text-orange-700 border-orange-200",
  INTERNSHIP: "bg-pink-50 text-pink-700 border-pink-200",
  FREELANCE:  "bg-teal-50 text-teal-700 border-teal-200",
  REMOTE:     "bg-green-50 text-green-700 border-green-200",
}

const WORK_MODE_STYLE = {
  REMOTE:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  HYBRID:  "bg-amber-50 text-amber-700 border-amber-200",
  ON_SITE: "bg-slate-100 text-slate-600 border-slate-200",
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SavedJobCard({ savedJob, onUnsave, unsaving }) {
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/jobs/${savedJob.jobId}`)
      .then((res) => setJob(res.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false))
  }, [savedJob.jobId])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!job) {
    return (
      <Card className="opacity-60">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 rounded-xl border bg-slate-50 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-slate-300" />
              </div>
              <div>
                <p className="font-medium text-slate-500">Job no longer available</p>
                <p className="text-xs text-slate-400">Saved {timeAgo(savedJob.savedAt)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-red-500"
              onClick={() => onUnsave(savedJob.id)}
              disabled={unsaving}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const company = job.company
  const salary   = formatSalary(job.minSalary, job.maxSalary, job.currency, job.salaryDisclosed)
  const location = [job.city, job.country].filter(Boolean).join(", ") || "Location not specified"
  const skills   = job.skillNames ? [...job.skillNames].slice(0, 3) : []

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">

          {/* Company logo */}
          <div className="shrink-0 h-16 w-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-full w-full"
                onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.removeProperty("display") }}
              />
            ) : null}
            <Building2 className={cn("h-7 w-7 text-slate-400", company?.logoUrl ? "hidden" : "")} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Title + saved time */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="min-w-0">
                <h3 className="font-bold text-base text-slate-900 truncate">{job.title}</h3>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  <span className="text-sm font-medium text-slate-600">
                    {company?.name ?? `Company #${job.companyId}`}
                  </span>
                  {company?.verified && (
                    <CheckCircle2 className="h-3.5 w-3.5 fill-primary text-white shrink-0" />
                  )}
                  {company?.industryType && (
                    <span className="text-slate-400 text-xs">· {company.industryType.replace(/_/g, " ")}</span>
                  )}
                  {company?.companySize && (
                    <span className="text-slate-400 text-xs">· {company.companySize}</span>
                  )}
                </div>
                {company?.tagline && (
                  <p className="text-xs text-slate-400 italic mt-0.5">{company.tagline}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0 text-xs text-slate-400">
                <Bookmark className="h-3.5 w-3.5 fill-primary text-primary" />
                {timeAgo(savedJob.savedAt)}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 my-3">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                {location}
              </span>
              {salary && (
                <span className="font-medium text-slate-700">{salary}</span>
              )}
              {job.createdAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  Posted {timeAgo(job.createdAt)}
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mb-4">
              {job.jobType && (
                <Badge variant="outline" className={`text-xs font-medium ${JOB_TYPE_STYLE[job.jobType] ?? ""}`}>
                  {labelJobType(job.jobType)}
                </Badge>
              )}
              {job.workMode && (
                <Badge variant="outline" className={`text-xs font-medium ${WORK_MODE_STYLE[job.workMode] ?? ""}`}>
                  {labelJobType(job.workMode)}
                </Badge>
              )}
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            <Separator className="mb-4" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button size="sm" className="h-8 text-xs gap-1.5" asChild>
                <Link to={`/jobs/${job.id}`}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Job
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 gap-1.5"
                onClick={() => onUnsave(savedJob.id)}
                disabled={unsaving}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}
