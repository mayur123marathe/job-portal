import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle, Lightbulb, Target, Loader2, TrendingUp,
} from "lucide-react"
import { getCareerFeedback } from "@/store/ai/aiThunk"
import { clearCareerFeedback } from "@/store/ai/aiSlice"

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert a resume object to a flat text block for the AI prompt */
function serializeResume(resume) {
  const lines = []

  const pi = resume.personalInfo
  if (pi) {
    lines.push(`Name: ${pi.fullName || ""}`)
    lines.push(`Email: ${pi.email || ""}`)
    lines.push(`Phone: ${pi.phone || ""}`)
    lines.push(`Location: ${pi.location || ""}`)
    if (pi.linkedIn) lines.push(`LinkedIn: ${pi.linkedIn}`)
    if (pi.github)   lines.push(`GitHub: ${pi.github}`)
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
    const skillNames = resume.skills.map((s) => (typeof s === "string" ? s : s.skillName || s.name || ""))
    lines.push(`\nSkills: ${skillNames.filter(Boolean).join(", ")}`)
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

const PRIORITY_COLOR = {
  HIGH:   "bg-red-100 text-red-700 border-red-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW:    "bg-green-100 text-green-700 border-green-200",
}

const MATCH_COLOR = {
  HIGH:   "bg-emerald-100 text-emerald-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  LOW:    "bg-slate-100 text-slate-600",
}

function strengthColor(score) {
  if (score >= 75) return "text-emerald-600"
  if (score >= 50) return "text-yellow-600"
  return "text-red-500"
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CareerFeedbackDialog({ open, onClose, resume }) {
  const dispatch = useDispatch()
  const { careerFeedback, isGettingCareerFeedback, error } = useSelector((s) => s.ai)

  // Trigger AI call when dialog opens
  useEffect(() => {
    if (!open || !resume) return
    dispatch(clearCareerFeedback())
    const resumeContent = serializeResume(resume)
    dispatch(getCareerFeedback({
      resumeContent,
      targetJobTitle: resume.targetJobTitle || null,
    }))
  }, [open, resume?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const fb = careerFeedback

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="md:max-w-5xl w-full p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand" />
            AI Career Feedback
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {resume?.title} — personalized insights powered by AI
          </DialogDescription>
        </DialogHeader>

        {/* Loading */}
        {isGettingCareerFeedback && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm">Analyzing your resume…</p>
          </div>
        )}

        {/* Error */}
        {!isGettingCareerFeedback && error && (
          <div className="mx-6 my-8 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {!isGettingCareerFeedback && fb && (
          <ScrollArea className="max-h-[75vh]">
            <div className="px-6 py-5 space-y-6">

              {/* Profile Strength */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Profile Strength</p>
                  <span className={`text-2xl font-bold ${strengthColor(fb.profileStrength)}`}>
                    {fb.profileStrength}/100
                  </span>
                </div>
                <Progress value={fb.profileStrength} className="h-2" />
                {fb.overallSummary && (
                  <p className="text-xs text-slate-500 pt-1">{fb.overallSummary}</p>
                )}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="shortlisting">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="shortlisting" className="text-xs gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Not Shortlisted
                  </TabsTrigger>
                  <TabsTrigger value="improvements" className="text-xs gap-1">
                    <Lightbulb className="h-3.5 w-3.5" />
                    What to Improve
                  </TabsTrigger>
                  <TabsTrigger value="targets" className="text-xs gap-1">
                    <Target className="h-3.5 w-3.5" />
                    Target Jobs
                  </TabsTrigger>
                </TabsList>

                {/* Why not shortlisted */}
                <TabsContent value="shortlisting" className="mt-4 space-y-2">
                  <p className="text-xs text-slate-500 mb-3">
                    These are the likely reasons recruiters are skipping your profile:
                  </p>
                  {fb.shortlistingIssues?.map((issue, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                      <span className="mt-0.5 flex-shrink-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm text-red-800">{issue}</p>
                    </div>
                  ))}
                </TabsContent>

                {/* Improvements */}
                <TabsContent value="improvements" className="mt-4 space-y-3">
                  <p className="text-xs text-slate-500 mb-3">
                    Prioritized actions to make your resume more competitive:
                  </p>
                  {fb.improvements?.map((imp, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 p-4 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {imp.area}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${PRIORITY_COLOR[imp.priority] || PRIORITY_COLOR.LOW}`}
                        >
                          {imp.priority}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-slate-800">{imp.issue}</p>
                      <p className="text-xs text-slate-500 flex gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        {imp.action}
                      </p>
                    </div>
                  ))}
                </TabsContent>

                {/* Target Jobs */}
                <TabsContent value="targets" className="mt-4 space-y-3">
                  <p className="text-xs text-slate-500 mb-3">
                    Based on your current skills and experience, focus on these roles:
                  </p>
                  {fb.targetJobs?.map((job, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 p-4 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{job.jobTitle}</p>
                        <Badge className={`text-xs ${MATCH_COLOR[job.skillMatch] || MATCH_COLOR.LOW}`}>
                          {job.skillMatch} match
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{job.reason}</p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
