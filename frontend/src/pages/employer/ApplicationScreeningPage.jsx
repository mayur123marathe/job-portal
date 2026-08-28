import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  ArrowLeft, Sparkles, CheckCircle2, XCircle, TrendingUp,
  AlertCircle, Clock, User, Mail, Phone, Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchApplicationById } from "@/store/application/applicationThunk"

// ── Circular progress ──────────────────────────────────────────────────────────

function CircleProgress({ score, size = 120, strokeWidth = 8, label }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = score != null ? Math.min(100, Math.max(0, score)) : 0
  const offset = circumference * (1 - pct / 100)

  const color = pct >= 75 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626"
  const bg    = pct >= 75 ? "#dcfce7" : pct >= 50 ? "#fef3c7" : "#fee2e2"

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Track */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={score != null ? offset : circumference}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {score != null ? (
            <span className="text-2xl font-extrabold" style={{ color }}>{score}%</span>
          ) : (
            <Clock className="h-6 w-6 text-slate-400" />
          )}
        </div>
      </div>
      {label && <p className="text-xs font-semibold text-slate-500 text-center">{label}</p>}
    </div>
  )
}

// ── Shortlist badge config ─────────────────────────────────────────────────────

const SHORTLIST_BADGE = {
  AUTO_SHORTLISTED:   { label: "Auto Shortlisted",   className: "bg-green-100 text-green-700 border-green-200" },
  REVIEW_RECOMMENDED: { label: "Review Recommended", className: "bg-blue-100 text-blue-700 border-blue-200" },
  PENDING_REVIEW:     { label: "Pending Review",     className: "bg-amber-100 text-amber-700 border-amber-200" },
  LOW_MATCH:          { label: "Low Match",          className: "bg-red-50 text-red-600 border-red-200" },
  NOT_SCREENED:       { label: "Not Screened",       className: "bg-slate-100 text-slate-500 border-slate-200" },
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function ApplicationScreeningPage() {
  const { id } = useParams()
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { currentApplication: app, isLoading } = useSelector(s => s.application)

  useEffect(() => {
    dispatch(fetchApplicationById(id))
  }, [id])

  const screening  = app?.screening
  const candidate  = app?.candidate
  const job        = app?.job

  if (isLoading || !app) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 py-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    )
  }

  const badge = SHORTLIST_BADGE[screening?.shortlistStatus ?? "NOT_SCREENED"]

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/employer/applications/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand" />
            AI Screening Result
          </h1>
          {job && <p className="text-xs text-slate-400 mt-0.5">{job.title}</p>}
        </div>
        {screening && (
          <Badge className={`ml-auto text-xs border ${badge.className}`}>{badge.label}</Badge>
        )}
      </div>

      {/* Candidate info */}
      {candidate && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Candidate</p>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-white text-xl font-bold">
              {candidate.fullName?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-6">
              <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                {candidate.fullName}
              </div>
              {candidate.email && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  {candidate.email}
                </div>
              )}
              {candidate.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  {candidate.phone}
                </div>
              )}
              {job?.title && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase className="h-4 w-4 text-slate-400 shrink-0" />
                  Applied for: {job.title}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Not screened yet */}
      {!screening && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col items-center gap-3 py-14 text-center">
          <Clock className="h-10 w-10 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">Screening in progress</p>
          <p className="text-xs text-slate-400 max-w-xs">
            AI scoring runs automatically after the candidate applies. Check back shortly.
          </p>
        </div>
      )}

      {/* Screening results */}
      {screening && (
        <>
          {/* Stale warning */}
          {screening.isStale && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Job requirements were updated after scoring — this score may be outdated.
            </div>
          )}

          {/* Scores */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-6">Match Scores</p>
            <div className="flex flex-wrap items-center justify-around gap-8">
              <div className="flex flex-col items-center gap-2">
                <CircleProgress score={screening.overallScore} size={130} strokeWidth={9} />
                <p className="text-xs font-bold text-slate-700">Overall Match</p>
              </div>
              <div className="w-px h-24 bg-slate-100 hidden sm:block" />
              <CircleProgress score={screening.skillsMatchScore}      size={100} strokeWidth={7} label="Skills" />
              <CircleProgress score={screening.experienceMatchScore}  size={100} strokeWidth={7} label="Experience" />
              <CircleProgress score={screening.educationMatchScore}   size={100} strokeWidth={7} label="Education" />
            </div>
          </div>

          {/* Summary */}
          {screening.summary && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 leading-relaxed">
              {screening.summary}
            </div>
          )}

          {/* Skills grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {screening.matchedSkills?.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <p className="text-xs font-semibold text-green-700 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> Matched Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {screening.matchedSkills.map(s => (
                    <Badge key={s} className="text-xs bg-green-100 text-green-700 border-green-200">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {screening.missingSkills?.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <p className="text-xs font-semibold text-red-600 mb-3 flex items-center gap-1.5">
                  <XCircle className="h-4 w-4" /> Missing Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {screening.missingSkills.map(s => (
                    <Badge key={s} className="text-xs bg-red-50 text-red-600 border-red-200">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Strengths & Concerns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {screening.strengths?.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-green-600" /> Strengths
                </p>
                <ul className="space-y-2">
                  {screening.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {screening.concerns?.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-500" /> Concerns
                </p>
                <ul className="space-y-2">
                  {screening.concerns.map((c, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />{c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer meta */}
          <p className="text-xs text-slate-400 text-right">
            Screened {new Date(screening.screenedAt).toLocaleString()} · version {screening.screeningVersion}
          </p>
        </>
      )}
    </div>
  )
}
