import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, RotateCcw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { generateCoverLetter } from "@/store/ai/aiThunk"
import { fetchResumeById } from "@/store/resume/resumeThunk"

export default function CoverLetterEditor({ coverLetter, setCoverLetter, selectedResumeId }) {
  const dispatch = useDispatch()
  const { isGeneratingCoverLetter } = useSelector(s => s.ai)
  const job           = useSelector(s => s.job.currentJob)
  const user          = useSelector(s => s.auth.user)
  const resumes       = useSelector(s => s.resume.resumes)
  const currentResume = useSelector(s => s.resume.currentResume)

  // Fetch full resume if it's not already in the list
  useEffect(() => {
    if (!selectedResumeId || selectedResumeId === "new") return
    const id = Number(selectedResumeId)
    if (!resumes.find(r => r.id === id)) {
      dispatch(fetchResumeById(id))
    }
  }, [selectedResumeId, resumes, dispatch])

  const getSelectedResume = () => {
    if (!selectedResumeId || selectedResumeId === "new") return null
    const id = Number(selectedResumeId)
    return resumes.find(r => r.id === id) ?? (currentResume?.id === id ? currentResume : null)
  }

  const handleGenerateWithAI = async () => {
    const resume = getSelectedResume()

    const candidateSkills = resume?.skills
      ?.map(s => s.skillName).filter(Boolean) ?? []

    const candidateExperience = resume?.workExperiences
      ?.map(e => `${e.jobTitle} at ${e.companyName}${e.isCurrent ? " (current)" : ""}`)
      .filter(Boolean) ?? []

    const payload = {
      jobTitle:           job?.title       || "Software Developer",
      jobDescription:     job?.description || "",
      candidateName:      user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Candidate" : "Candidate",
      targetCompanyName:  job?.companyId ? `Company #${job.companyId}` : "",
      candidateSummary:   resume?.summary || "",
      candidateSkills,
      candidateExperience,
    }

    try {
      const result = await dispatch(generateCoverLetter(payload)).unwrap()
      setCoverLetter(result.content)
      toast.success("Cover letter generated!")
    } catch (err) {
      toast.error(err || "Failed to generate cover letter")
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    toast.success("Copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Cover Letter</h2>
        <p className="text-slate-600">Write a compelling cover letter or let AI help you</p>
      </div>

      {/* AI Generate Card */}
      <Card className="border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-brand flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">AI-Powered Cover Letter</h3>
              <p className="text-sm text-slate-700 mb-4">
                Let our AI analyze the job description and your resume — skills, experience, and
                summary — to create a personalized cover letter tailored to this position.
              </p>
              <Button onClick={handleGenerateWithAI} disabled={isGeneratingCoverLetter} className="gap-2">
                {isGeneratingCoverLetter
                  ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</>
                  : <><Sparkles className="h-4 w-4" />Generate with AI</>}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Writing tips */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">AI Writing Tips</h3>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Personalized
            </Badge>
          </div>
          <ul className="space-y-3">
            {[
              "Highlight your most relevant skills and how they align with the role",
              "Mention specific achievements with measurable results",
              "Show enthusiasm for the company and why you want to join",
              "Keep it concise — 3 to 4 focused paragraphs",
            ].map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-brand">{i + 1}</span>
                </div>
                <span className="text-sm text-slate-700">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Your Cover Letter</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!coverLetter}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCoverLetter("")}
                  disabled={!coverLetter}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              placeholder="Write your cover letter here or click Generate with AI..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-100 font-mono text-sm"
            />
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>{coverLetter.length} characters</span>
              <span>{coverLetter.split(/\s+/).filter((w) => w.length > 0).length} words</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
