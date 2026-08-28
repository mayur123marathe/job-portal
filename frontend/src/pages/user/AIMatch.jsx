import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Target, Star, Loader2, FileText, Brain, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import JobCard from "@/components/user/jobs/JobCard"
import { fetchMyResumes, fetchResumeById } from "@/store/resume/resumeThunk"
import { getCareerFeedback } from "@/store/ai/aiThunk"
import api from "@/store/api"

// ── Helpers ───────────────────────────────────────────────────────────────────

function serializeResume(resume) {
  const lines = []
  const pi = resume.personalInfo
  if (pi) {
    lines.push(`Name: ${pi.fullName || ""}`)
    lines.push(`Email: ${pi.email || ""}`)
    if (pi.location) lines.push(`Location: ${pi.location}`)
    if (pi.linkedIn)  lines.push(`LinkedIn: ${pi.linkedIn}`)
  }
  if (resume.summary) lines.push(`\nSummary:\n${resume.summary}`)
  if (resume.workExperiences?.length) {
    lines.push("\nWork Experience:")
    resume.workExperiences.forEach((w) => {
      lines.push(`  - ${w.jobTitle} at ${w.companyName} (${w.startDate || "?"} – ${w.endDate || "Present"})`)
      if (w.description) lines.push(`    ${w.description}`)
    })
  }
  if (resume.educations?.length) {
    lines.push("\nEducation:")
    resume.educations.forEach((e) => {
      lines.push(`  - ${e.degree || ""} in ${e.fieldOfStudy || ""} from ${e.institutionName || ""} (${e.startYear || ""} – ${e.endYear || ""})`)
    })
  }
  if (resume.skills?.length) {
    const names = resume.skills.map((s) => (typeof s === "string" ? s : s.skillName || s.name || ""))
    lines.push(`\nSkills: ${names.filter(Boolean).join(", ")}`)
  }
  if (resume.certifications?.length) {
    lines.push("\nCertifications:")
    resume.certifications.forEach((c) => lines.push(`  - ${c.name} (${c.issuer || ""})`))
  }
  if (resume.projects?.length) {
    lines.push("\nProjects:")
    resume.projects.forEach((p) => {
      lines.push(`  - ${p.title || p.name || ""}`)
      if (p.description) lines.push(`    ${p.description}`)
    })
  }
  return lines.join("\n")
}

const MATCH_COLOR = {
  HIGH:   "bg-emerald-100 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
  LOW:    "bg-slate-100 text-slate-600 border-slate-200",
}

function strengthColor(score) {
  if (score >= 75) return "text-emerald-600"
  if (score >= 50) return "text-yellow-600"
  return "text-red-500"
}

// ── Loading Skeleton ──────────────────────────────────────────────────────────

function MatchSkeleton() {
  return (
    <div className="space-y-6">
      {/* Strength card */}
      <Card><CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-14" />
        </div>
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </CardContent></Card>

      {/* Role groups */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2].map((j) => (
              <Card key={j}><CardContent className="p-5 space-y-3">
                <div className="flex gap-3">
                  <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              </CardContent></Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AIMatch() {
  const dispatch = useDispatch()
  const { resumes, isLoading: resumesLoading } = useSelector((s) => s.resume)

  const [selectedId, setSelectedId]     = useState(null)   // string id
  const [matchCache, setMatchCache]     = useState({})      // { [id]: { feedback, jobGroups } }
  const [isMatching, setIsMatching]     = useState(false)
  const [matchError, setMatchError]     = useState(null)

  // Fetch resume list on mount if not already loaded
  useEffect(() => {
    if (resumes.length === 0) dispatch(fetchMyResumes())
  }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-select default (or first) resume once list is available
  useEffect(() => {
    if (resumes.length > 0 && !selectedId) {
      const def = resumes.find((r) => r.isDefault) || resumes[0]
      setSelectedId(String(def.id))
    }
  }, [resumes]) // eslint-disable-line react-hooks/exhaustive-deps

  // Kick off matching when selected resume changes
  useEffect(() => {
    if (!selectedId) return
    if (matchCache[selectedId]) return   // already cached
    runMatch(selectedId)
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  const runMatch = async (id) => {
    setIsMatching(true)
    setMatchError(null)
    try {
      // 1. Fetch full resume with all sections
      const resumeAction = await dispatch(fetchResumeById(id))
      if (resumeAction.meta.requestStatus !== "fulfilled") {
        throw new Error("Could not load resume details")
      }
      const fullResume = resumeAction.payload?.data ?? resumeAction.payload

      // 2. Serialize → career feedback
      const resumeContent = serializeResume(fullResume)
      const fbAction = await dispatch(getCareerFeedback({ resumeContent }))
      if (fbAction.meta.requestStatus !== "fulfilled") {
        throw new Error("AI analysis failed — please try again")
      }
      const feedback = fbAction.payload

      // 3. Search real job listings for each AI-suggested role (parallel)
      const jobGroups = await Promise.all(
        (feedback.targetJobs || []).map(async (tj) => {
          try {
            const { data } = await api.get("/api/jobs", { params: { keyword: tj.jobTitle } })
            const jobs = Array.isArray(data) ? data : (data?.content ?? [])
            return { ...tj, jobs: jobs.slice(0, 4) }
          } catch {
            return { ...tj, jobs: [] }
          }
        })
      )

      setMatchCache((prev) => ({ ...prev, [id]: { feedback, jobGroups } }))
    } catch (err) {
      setMatchError(err.message || "Something went wrong")
    } finally {
      setIsMatching(false)
    }
  }

  const current        = matchCache[selectedId]
  const selectedResume = resumes.find((r) => String(r.id) === selectedId)
  const isLoading      = resumesLoading || isMatching

  // ── Empty: no resumes ────────────────────────────────────────────────────────
  if (!resumesLoading && resumes.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center py-20 max-w-sm">
          <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-brand" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No resumes yet</h3>
          <p className="text-slate-500 text-sm mb-6">
            Create a resume first so AI can find your best job matches.
          </p>
          <Button asChild className="bg-brand hover:bg-brand/90">
            <Link to="/resumes">Create a Resume</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="h-6 w-6 text-brand" />
              AI Job Match
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              AI analyzes your resume and surfaces the roles and listings that fit you best
            </p>
          </div>

          {/* Resume switcher */}
          {resumes.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-slate-500 hidden sm:block">Resume:</span>
              <Select
                value={selectedId ?? ""}
                onValueChange={(val) => setSelectedId(val)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      <span className="flex items-center gap-2">
                        {r.isDefault && (
                          <Star className="h-3.5 w-3.5 text-yellow-500 fill-current shrink-0" />
                        )}
                        <span className="truncate">{r.title}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Matching for label */}
        {selectedResume && (
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
            <Brain className="h-3.5 w-3.5" />
            Matching jobs for:
            <span className="font-medium text-slate-600">{selectedResume.title}</span>
            {selectedResume.isDefault && (
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-yellow-300 text-yellow-600 bg-yellow-50">
                Default
              </Badge>
            )}
          </div>
        )}

        {/* Error */}
        {matchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <p className="text-sm text-red-700">{matchError}</p>
            <Button size="sm" variant="outline" onClick={() => { setMatchError(null); runMatch(selectedId) }}>
              Retry
            </Button>
          </div>
        )}

        {/* Loading */}
        {isLoading && !current && <MatchSkeleton />}

        {/* Results */}
        {!isLoading && current && (
          <div className="space-y-8">

            {/* Profile Strength */}
            <Card className="border-slate-200">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Profile Strength</p>
                  <span className={`text-2xl font-bold ${strengthColor(current.feedback.profileStrength)}`}>
                    {current.feedback.profileStrength}
                    <span className="text-sm font-normal text-slate-400">/100</span>
                  </span>
                </div>
                <Progress value={current.feedback.profileStrength} className="h-2" />
                {current.feedback.overallSummary && (
                  <p className="text-xs text-slate-500">{current.feedback.overallSummary}</p>
                )}
              </CardContent>
            </Card>

            {/* Target Roles + Real Jobs */}
            {current.jobGroups.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Target className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No role suggestions returned — try a more detailed resume.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {current.jobGroups.map((group, i) => (
                  <section key={i}>

                    {/* Role header */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-base font-bold text-slate-900">{group.jobTitle}</h2>
                      <Badge
                        variant="outline"
                        className={`text-xs ${MATCH_COLOR[group.skillMatch] || MATCH_COLOR.LOW}`}
                      >
                        {group.skillMatch} match
                      </Badge>
                      {group.reason && (
                        <span className="text-xs text-slate-400 hidden md:block">{group.reason}</span>
                      )}
                    </div>

                    {/* Reason on mobile */}
                    {group.reason && (
                      <p className="text-xs text-slate-400 mb-4 md:hidden">{group.reason}</p>
                    )}

                    {/* Real job listings */}
                    {group.jobs.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {group.jobs.map((job) => (
                            <JobCard key={job.id} job={job} />
                          ))}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-brand gap-1"
                            asChild
                          >
                            <Link to={`/jobs?q=${encodeURIComponent(group.jobTitle)}`}>
                              See all {group.jobTitle} jobs
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-slate-400">
                        <p className="text-sm">No live listings found for this role right now.</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-xs text-brand gap-1" asChild>
                          <Link to={`/jobs?q=${encodeURIComponent(group.jobTitle)}`}>
                            Browse manually
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
