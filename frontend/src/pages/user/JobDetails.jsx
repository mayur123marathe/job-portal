import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  MapPin, DollarSign, Clock, Briefcase, Users, Building2,
  Share2, Bookmark, ArrowLeft, CheckCircle2, Sparkles, FileText,
  Eye, AlertCircle, Loader2, TrendingUp, BookOpen, MinusCircle,
} from "lucide-react"
import AIMatchBadge from "@/components/user/jobs/AIMatchBadge"
import { fetchJobById } from "@/store/job/jobThunk"
import { saveJob, unsaveJob } from "@/store/savedJob/savedJobThunk"
import { analyzeSkillsGap } from "@/store/ai/aiThunk"
import { clearSkillsGap } from "@/store/ai/aiSlice"
import { fetchMyApplications } from "@/store/application/applicationThunk"
import { fetchMyResumes } from "@/store/resume/resumeThunk"
import { toast } from "sonner"

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtSalary(val, currency = "USD") {
  if (!val) return null
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(val)
}

function timeAgo(iso) {
  if (!iso) return ""
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (d === 0) return "Today"
  if (d === 1) return "Yesterday"
  if (d < 30) return `${d} days ago`
  return `${Math.floor(d / 30)} months ago`
}

function fmtDate(d) {
  if (!d) return ""
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// Split a multi-line or pipe-separated string into a bullet array
function toList(str) {
  if (!str) return []
  return str.split(/\n|•|\|\|/).map((s) => s.trim()).filter(Boolean)
}

function labelJobType(v) {
  if (!v) return ""
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

const STATUS_COLORS = {
  OPEN: "bg-green-100 text-green-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  CLOSED: "bg-slate-100 text-slate-600",
  EXPIRED: "bg-red-100 text-red-600",
  FILLED: "bg-blue-100 text-blue-700",
}

// ── Skills Gap Card ────────────────────────────────────────────────────────────

const READINESS_COLOR = {
  HIGH:   "text-green-700 bg-green-100",
  MEDIUM: "text-amber-700 bg-amber-100",
  LOW:    "text-red-700 bg-red-100",
}

function SkillsGapCard({ resumes, selectedResumeId, setSelectedResumeId, skillsGap, isAnalyzing, onAnalyze, onClear }) {
  const hasResults = !!skillsGap
  const readinessKey = skillsGap?.overallReadiness?.toUpperCase()
  const readinessClass = READINESS_COLOR[readinessKey] ?? "text-slate-700 bg-slate-100"

  const selectedResume = resumes.find(r => r.id.toString() === selectedResumeId)
  const resumeSkills = selectedResume?.skills?.map(s => s.skillName).filter(Boolean) ?? []

  return (
    <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-brand flex items-center justify-center shrink-0">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-1">AI Skills Gap Analysis</h3>
            <p className="text-sm text-slate-600">
              Select a resume to analyze how your skills match this role's requirements.
            </p>
          </div>
        </div>

        {/* Resume selector + Analyze button */}
        <div className="flex gap-2">
          <Select
            value={selectedResumeId}
            onValueChange={setSelectedResumeId}
            disabled={resumes.length === 0}
          >
            <SelectTrigger className="bg-white border-blue-200 text-sm flex-1">
              <SelectValue placeholder={resumes.length === 0 ? "No resumes found" : "Select a resume..."} />
            </SelectTrigger>
            <SelectContent>
              {resumes.map(r => (
                <SelectItem key={r.id} value={r.id.toString()}>
                  <div className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{r.title || r.fileName || `Resume #${r.id}`}</span>
                    {r.isDefault && <span className="text-xs text-brand shrink-0">(default)</span>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={onAnalyze}
            disabled={isAnalyzing || !selectedResumeId || resumeSkills.length === 0}
            className="shrink-0 bg-brand hover:bg-brand/90"
          >
            {isAnalyzing
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>
              : <><Sparkles className="h-4 w-4 mr-2" />Analyze</>}
          </Button>
        </div>

        {/* Skills preview from selected resume */}
        {selectedResumeId && resumeSkills.length > 0 && !hasResults && !isAnalyzing && (
          <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
            <p className="text-xs font-medium text-slate-500 mb-2">Skills from this resume:</p>
            <div className="flex flex-wrap gap-1.5">
              {resumeSkills.slice(0, 10).map(s => (
                <Badge key={s} variant="outline" className="text-xs text-slate-600 bg-white">{s}</Badge>
              ))}
              {resumeSkills.length > 10 && (
                <span className="text-xs text-slate-400">+{resumeSkills.length - 10} more</span>
              )}
            </div>
          </div>
        )}

        {selectedResumeId && resumeSkills.length === 0 && !isAnalyzing && (
          <p className="text-xs text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-200">
            This resume has no skills listed. Add skills to your resume first.
          </p>
        )}

        {/* Analyzing state */}
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-blue-700 py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing your skills against job requirements...
          </div>
        )}

        {/* Results */}
        {hasResults && !isAnalyzing && (
          <div className="space-y-4 pt-2">
            {/* Overall readiness */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Overall Readiness</span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${readinessClass}`}>
                {skillsGap.overallReadiness ?? "—"}
              </span>
            </div>

            {/* Summary */}
            {skillsGap.summary && (
              <p className="text-sm text-slate-700 bg-white/70 rounded-lg p-3 border border-blue-100">
                {skillsGap.summary}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Matched */}
              {skillsGap.matchedSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> You Have ({skillsGap.matchedSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsGap.matchedSkills.map(s => (
                      <Badge key={s} className="text-xs bg-green-100 text-green-700 border-green-200">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing */}
              {skillsGap.missingSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-2 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Missing ({skillsGap.missingSkills.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillsGap.missingSkills.map(s => (
                      <Badge key={s} className="text-xs bg-red-50 text-red-600 border-red-200">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Partial match */}
            {skillsGap.partialMatch?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-orange-600 mb-2 flex items-center gap-1">
                  <MinusCircle className="h-3.5 w-3.5" /> Partial Match ({skillsGap.partialMatch.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsGap.partialMatch.map(s => (
                    <Badge key={s} className="text-xs bg-orange-50 text-orange-700 border-orange-200">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Priority to learn */}
            {skillsGap.prioritySkillsToLearn?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> Priority Skills to Learn
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsGap.prioritySkillsToLearn.map(s => (
                    <Badge key={s} className="text-xs bg-amber-50 text-amber-700 border-amber-200">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Learning recommendations */}
            {skillsGap.learningRecommendations?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> How to Learn
                </p>
                <div className="space-y-2">
                  {skillsGap.learningRecommendations.slice(0, 4).map((rec, i) => (
                    <div key={i} className="text-xs bg-white/70 rounded-lg p-2.5 border border-blue-100 space-y-0.5">
                      <span className="font-semibold text-slate-800">{rec.skill}</span>
                      {rec.why && <p className="text-slate-600">{rec.why}</p>}
                      {rec.howToLearn && <p className="text-slate-500 italic">{rec.howToLearn}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={onClear} className="text-slate-500 hover:text-slate-700 px-0">
              Clear results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Skeleton className="h-8 w-32" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex gap-4"><Skeleton className="h-5 w-32" /><Skeleton className="h-5 w-28" /><Skeleton className="h-5 w-36" /></div>
          </CardContent></Card>
          <Card><CardContent className="p-6 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" />
          </CardContent></Card>
        </div>
        <div className="space-y-4">
          <Card><CardContent className="p-6 space-y-3">
            <Skeleton className="h-12 w-full" /><Skeleton className="h-9 w-full" />
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" />
          </CardContent></Card>
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentJob: job, isLoading, error } = useSelector((s) => s.job)
  const { savedJobMap, isActionLoading } = useSelector((s) => s.savedJob)
  const { skillsGap, isAnalyzingSkillsGap } = useSelector((s) => s.ai)
  const myApplications = useSelector((s) => s.application.myApplications)
  const resumes = useSelector((s) => s.resume.resumes)

  const [selectedResumeId, setSelectedResumeId] = useState("")
  const [skillsGapVisible, setSkillsGapVisible] = useState(false)

  useEffect(() => {
    dispatch(fetchJobById(id))
  }, [dispatch, id])

  useEffect(() => { dispatch(fetchMyApplications()) }, [dispatch])
  useEffect(() => { dispatch(fetchMyResumes()) }, [dispatch])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const hasApplied = job
    ? myApplications.some(a => a.jobId === job.id && a.status !== "WITHDRAWN")
    : false

  const isSaved = job ? !!savedJobMap[job.id] : false
  const savedJobId = job ? savedJobMap[job.id] : null

  const handleSaveToggle = async () => {
    if (isSaved) {
      const result = await dispatch(unsaveJob(savedJobId))
      if (!result.error) toast.success("Job removed from saved list")
      else toast.error(result.payload)
    } else {
      const result = await dispatch(saveJob({ jobId: job.id, companyId: job.company?.id ?? job.companyId }))
      if (!result.error) toast.success("Job saved!")
      else toast.error(result.payload)
    }
  }

  if (isLoading || !job) return <LoadingSkeleton />

  const location = [job.city, job.state, job.country].filter(Boolean).join(", ")
  const skills = job.skills ? [...(Array.isArray(job.skills) ? job.skills : Array.from(job.skills))] : []
  const tags   = job.tags   ? [...(Array.isArray(job.tags)   ? job.tags   : Array.from(job.tags))]   : []

  const salaryLabel = job.salaryDisclosed === false
    ? "Salary negotiable"
    : job.minSalary && job.maxSalary
      ? `${fmtSalary(job.minSalary, job.currency)} – ${fmtSalary(job.maxSalary, job.currency)}`
      : job.minSalary
        ? `From ${fmtSalary(job.minSalary, job.currency)}`
        : null

  const respList  = toList(job.responsibilities)
  const reqList   = toList(job.requirements)
  const benList   = toList(job.benefits)

  const handleApply = () => navigate(`/apply/${id}`)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Button variant="ghost" onClick={() => navigate("/jobs")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Job Header Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="h-16 w-16 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
                  {job.company?.logoUrl ? (
                    <img
                      src={job.company.logoUrl}
                      alt={job.company.name}
                      className="h-full w-full object-contain p-2"
                      onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex" }}
                    />
                  ) : null}
                  <Building2 className={`h-8 w-8 text-slate-400 ${job.company?.logoUrl ? "hidden" : ""}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 mb-1">{job.title}</h1>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-slate-700 font-medium text-sm">
                          {job.company?.name ?? `Company #${job.companyId}`}
                        </span>
                        {job.company?.verified && (
                          <CheckCircle2 className="h-4 w-4 text-white fill-blue-500 shrink-0" />
                        )}
                        {job.company?.industryType && (
                          <span className="text-slate-400 text-sm">· {job.company.industryType.replace(/_/g, " ")}</span>
                        )}
                        {job.company?.companySize && (
                          <span className="text-slate-400 text-sm">· {job.company.companySize} company</span>
                        )}
                      </div>
                      {job.company?.tagline && (
                        <p className="text-slate-400 text-xs mt-0.5 italic">{job.company.tagline}</p>
                      )}
                    </div>
                    <AIMatchBadge score={null} />
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600 mb-4">
                    {location && <div className="flex items-center gap-1"><MapPin className="h-4 w-4 shrink-0" />{location}</div>}
                    <div className="flex items-center gap-1"><Briefcase className="h-4 w-4 shrink-0" />{labelJobType(job.jobType)}</div>
                    {salaryLabel && <div className="flex items-center gap-1"><DollarSign className="h-4 w-4 shrink-0" />{salaryLabel}</div>}
                    {job.createdAt && <div className="flex items-center gap-1"><Clock className="h-4 w-4 shrink-0" />Posted {timeAgo(job.createdAt)}</div>}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {job.status && <Badge className={STATUS_COLORS[job.status] ?? ""}>{job.status}</Badge>}
                    {job.workMode && <Badge variant="outline">{labelJobType(job.workMode)}</Badge>}
                    {job.experienceLevel && <Badge variant="outline">{labelJobType(job.experienceLevel)}</Badge>}
                    {job.category?.name && <Badge variant="secondary">{job.category.name}</Badge>}
                    {skills.slice(0, 6).map((s) => (
                      <Badge key={s.id ?? s.skillName ?? s.name} variant="outline">
                        {s.skillName ?? s.name}
                      </Badge>
                    ))}
                    {skills.length > 6 && <Badge variant="outline">+{skills.length - 6} more</Badge>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Gap Analysis */}
          <SkillsGapCard
            resumes={resumes}
            selectedResumeId={selectedResumeId}
            setSelectedResumeId={setSelectedResumeId}
            skillsGap={skillsGapVisible ? skillsGap : null}
            isAnalyzing={isAnalyzingSkillsGap}
            onAnalyze={() => {
              const resume = resumes.find(r => r.id.toString() === selectedResumeId)
              const candidateSkills = resume?.skills?.map(s => s.skillName).filter(Boolean) ?? []
              const requiredSkills = skills.map(s => s.skillName ?? s.name).filter(Boolean)
              dispatch(clearSkillsGap())
              setSkillsGapVisible(true)
              dispatch(analyzeSkillsGap({
                jobTitle: job.title,
                candidateSkills,
                requiredSkills,
              })).unwrap().catch(err => toast.error(err || "Failed to analyze skills gap"))
            }}
            onClear={() => { dispatch(clearSkillsGap()); setSkillsGapVisible(false) }}
          />

          {/* Description */}
          {job.description && (
            <Card>
              <CardHeader><CardTitle>About the Role</CardTitle></CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Responsibilities */}
          {respList.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Responsibilities</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {respList.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-brand" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {reqList.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Requirements</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {reqList.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {benList.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Benefits &amp; Perks</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benList.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">

          {/* Apply Card */}
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              {hasApplied ? (
                <Button className="w-full bg-green-100 text-green-700 border border-green-200 hover:bg-green-100 cursor-default" size="lg" disabled>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Already Applied
                </Button>
              ) : job.status === "OPEN" ? (
                <Button className="w-full bg-brand hover:bg-brand/90" size="lg" onClick={handleApply}>
                  Apply Now
                </Button>
              ) : (
                <Button className="w-full" size="lg" disabled>
                  {job.status === "FILLED" ? "Position Filled" : "Applications Closed"}
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleSaveToggle} disabled={isActionLoading}>
                  <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-current text-brand" : ""}`} />
                  {isSaved ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!") }}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <Separator />

              <div className="text-sm text-slate-600 space-y-2">
                {job.jobType && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Job Type</span>
                    <span className="font-medium text-slate-900">{labelJobType(job.jobType)}</span>
                  </div>
                )}
                {job.workMode && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Work Mode</span>
                    <span className="font-medium text-slate-900">{labelJobType(job.workMode)}</span>
                  </div>
                )}
                {job.experienceLevel && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Experience</span>
                    <span className="font-medium text-slate-900">{labelJobType(job.experienceLevel)}</span>
                  </div>
                )}
                {salaryLabel && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Salary</span>
                    <span className="font-medium text-slate-900">{salaryLabel}</span>
                  </div>
                )}
                {job.openings && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Openings</span>
                    <span className="font-medium text-slate-900">{job.openings}</span>
                  </div>
                )}
                {job.applicationDeadline && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Deadline</span>
                    <span className="font-medium text-slate-900">{fmtDate(job.applicationDeadline)}</span>
                  </div>
                )}
                {job.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Posted</span>
                    <span className="font-medium text-slate-900">{timeAgo(job.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              {(job.applicationCount != null || job.viewCount != null) && (
                <>
                  <Separator />
                  <div className="flex gap-4 text-xs text-slate-500">
                    {job.applicationCount != null && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />{job.applicationCount} applicants
                      </span>
                    )}
                    {job.viewCount != null && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />{job.viewCount} views
                      </span>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {tags.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Tags</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <Badge key={t.id ?? t.name} variant="secondary" className="text-xs">
                      {t.name ?? t.tagName}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location details */}
          {(job.address || job.zipCode) && (
            <Card>
              <CardHeader><CardTitle className="text-base">Location Details</CardTitle></CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-1">
                {job.address && <p>{job.address}</p>}
                {location && <p>{location} {job.zipCode ? `- ${job.zipCode}` : ""}</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
