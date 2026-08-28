import { Sparkles, CheckCircle2, XCircle, TrendingUp, AlertCircle, Clock } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

function scoreColor(score) {
  if (score >= 75) return "text-green-700"
  if (score >= 50) return "text-amber-700"
  return "text-red-600"
}
function scoreBg(score) {
  if (score >= 75) return "bg-green-100"
  if (score >= 50) return "bg-amber-100"
  return "bg-red-100"
}

const SHORTLIST_BADGE = {
  AUTO_SHORTLISTED:    { label: "Auto Shortlisted",     className: "bg-green-100 text-green-700 border-green-200" },
  REVIEW_RECOMMENDED:  { label: "Review Recommended",   className: "bg-blue-100 text-blue-700 border-blue-200" },
  PENDING_REVIEW:      { label: "Pending Review",        className: "bg-amber-100 text-amber-700 border-amber-200" },
  LOW_MATCH:           { label: "Low Match",             className: "bg-red-50 text-red-600 border-red-200" },
  NOT_SCREENED:        { label: "Not Screened Yet",      className: "bg-slate-100 text-slate-500 border-slate-200" },
}

export default function ScreeningScoreDialog({ open, onClose, application, job }) {
  const screening = application?.screening

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="md:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Sparkles className="h-4 w-4 text-brand" />
            AI Screening Score
          </DialogTitle>
        </DialogHeader>

        {application && job && (
          <div className="text-xs text-slate-500 -mt-1">
            Candidate #{application.candidate?.id ?? application.candidateId} · {job.title}
          </div>
        )}

        <div className="space-y-5 mt-1">
          {/* Not yet screened */}
          {!screening && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <Clock className="h-8 w-8 text-slate-400" />
              <p className="text-sm text-slate-600 font-medium">Screening in progress</p>
              <p className="text-xs text-slate-400">
                AI scoring runs automatically after application — check back shortly.
              </p>
            </div>
          )}

          {/* Stale warning */}
          {screening?.isStale && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Job requirements were updated after screening. Score may be outdated.
            </div>
          )}

          {/* Results */}
          {screening && (
            <>
              {/* Score + shortlist status */}
              <div className={`flex items-center justify-between gap-4 p-5 rounded-xl ${scoreBg(screening.overallScore)}`}>
                <div className="text-center">
                  <p className={`text-5xl font-extrabold ${scoreColor(screening.overallScore)}`}>
                    {screening.overallScore}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">/ 100 overall</p>
                </div>
                {screening.shortlistStatus && (() => {
                  const badge = SHORTLIST_BADGE[screening.shortlistStatus] ?? SHORTLIST_BADGE.NOT_SCREENED
                  return (
                    <Badge className={`text-xs border ${badge.className}`}>{badge.label}</Badge>
                  )
                })()}
              </div>

              {/* Score breakdown */}
              {(screening.skillsMatchScore != null || screening.experienceMatchScore != null || screening.educationMatchScore != null) && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Skills",     value: screening.skillsMatchScore },
                    { label: "Experience", value: screening.experienceMatchScore },
                    { label: "Education",  value: screening.educationMatchScore },
                  ].map(({ label, value }) => value != null && (
                    <div key={label} className={`rounded-lg p-3 text-center ${scoreBg(value)}`}>
                      <p className={`text-2xl font-bold ${scoreColor(value)}`}>{value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              {screening.summary && (
                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 border border-slate-200">
                  {screening.summary}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched skills */}
                {screening.matchedSkills?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Matched Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {screening.matchedSkills.map(s => (
                        <Badge key={s} className="text-xs bg-green-100 text-green-700 border-green-200">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing skills */}
                {screening.missingSkills?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" /> Missing Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {screening.missingSkills.map(s => (
                        <Badge key={s} className="text-xs bg-red-50 text-red-600 border-red-200">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Strengths */}
              {screening.strengths?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" /> Strengths
                  </p>
                  <ul className="space-y-1">
                    {screening.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Concerns */}
              {screening.concerns?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Concerns
                  </p>
                  <ul className="space-y-1">
                    {screening.concerns.map((c, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />{c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          <Button variant="outline" className="w-full border-slate-200" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
