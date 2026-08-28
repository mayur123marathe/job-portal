import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, FileText, PenTool, Target, TrendingUp, Upload, Copy, BrainCircuit, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { fetchMyResumes, fetchResumeById } from "@/store/resume/resumeThunk"
import CareerFeedbackDialog from "@/components/user/resumes/CareerFeedbackDialog"

const aiTools = [
  {
    id: "resume-analyzer",
    name: "Resume Analyzer",
    description: "Get AI-powered feedback on your resume to improve your chances",
    icon: FileText,
    color: "blue",
  },
  {
    id: "cover-letter",
    name: "Cover Letter Builder",
    description: "Generate professional cover letters tailored to specific jobs",
    icon: PenTool,
    color: "purple",
  },
  {
    id: "skill-gap",
    name: "Skill Gap Analyzer",
    description: "Identify skills you need to develop for your dream job",
    icon: Target,
    color: "green",
  },
  {
    id: "job-match",
    name: "Job Match Recommendations",
    description: "Get personalized job recommendations based on your profile",
    icon: TrendingUp,
    color: "orange",
  },
  {
    id: "career-feedback",
    name: "AI Career Feedback Engine",
    description: "Find out why you're not getting shortlisted, what to improve, and which jobs to target",
    icon: BrainCircuit,
    color: "violet",
  },
]

export default function AITools() {
  const [selectedTool, setSelectedTool] = useState(null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-10 w-10 rounded-lg bg-brand flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">AI-Powered Tools</h1>
        </div>
        <p className="text-slate-600">
          Leverage AI to enhance your job search and improve your application success rate
        </p>
      </div>

      {!selectedTool ? (
        /* Tool Selection Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} onSelect={() => setSelectedTool(tool.id)} />
          ))}
        </div>
      ) : (
        /* Selected Tool Interface */
        <div>
          <Button variant="ghost" onClick={() => setSelectedTool(null)} className="mb-6">
            ← Back to Tools
          </Button>
          {selectedTool === "resume-analyzer" && <ResumeAnalyzer />}
          {selectedTool === "cover-letter" && <CoverLetterBuilder />}
          {selectedTool === "skill-gap" && <SkillGapAnalyzer />}
          {selectedTool === "job-match" && <JobMatchRecommendations />}
          {selectedTool === "career-feedback" && <CareerFeedbackTool />}
        </div>
      )}
    </div>
  )
}

function ToolCard({ tool, onSelect }) {
  const Icon = tool.icon
  const colorClasses = {
    blue:   "bg-blue-100 text-brand",
    purple: "bg-purple-100 text-purple-600",
    green:  "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    violet: "bg-violet-100 text-violet-600",
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onSelect}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[tool.color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-slate-900 mb-1">{tool.name}</h3>
            <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
            <Button size="sm">
              Try Now
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ResumeAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setAnalysis({
        score: 85,
        strengths: [
          "Strong technical skills section with relevant technologies",
          "Clear and measurable achievements",
          "Good formatting and structure",
        ],
        improvements: [
          "Add more quantifiable results to work experience",
          "Include a professional summary at the top",
          "Add links to portfolio or GitHub projects",
        ],
        keywords: ["React", "TypeScript", "Leadership", "Agile"],
      })
      setIsAnalyzing(false)
      toast.success("Resume analysis complete!")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-brand flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Resume Analyzer</h2>
              <p className="text-slate-700 mb-4">
                Upload your resume and get instant AI-powered feedback to improve your job prospects
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">Upload Your Resume</h3>
            <p className="text-sm text-slate-600 mb-4">PDF, DOC, or DOCX (Max 5MB)</p>
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-brand mb-2">{analysis.score}/100</div>
              <p className="text-slate-700">Resume Score</p>
            </div>

            <div>
              <h4 className="font-semibold text-green-900 mb-3">Strengths</h4>
              <ul className="space-y-2">
                {analysis.strengths.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-green-600">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-orange-900 mb-3">Suggested Improvements</h4>
              <ul className="space-y-2">
                {analysis.improvements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-orange-600">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Key Skills Detected</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function CoverLetterBuilder() {
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!jobTitle || !company) {
      toast.error("Please fill in all fields")
      return
    }

    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my extensive experience and passion for technology, I am confident I would be a valuable addition to your team.

Throughout my career, I have demonstrated expertise in modern web development and a commitment to delivering high-quality solutions. I am particularly excited about this opportunity at ${company} because of your innovative approach and commitment to excellence.

I would welcome the opportunity to discuss how my skills and experience align with your needs.

Thank you for considering my application.

Best regards,
[Your Name]`)
      setIsGenerating(false)
      toast.success("Cover letter generated!")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <PenTool className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Cover Letter Builder</h2>
              <p className="text-slate-700 mb-4">
                Generate a professional cover letter tailored to the specific job you're applying for
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. Senior React Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. TechCorp Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Cover Letter"}
          </Button>
        </CardContent>
      </Card>

      {generatedLetter && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Cover Letter</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(generatedLetter)
                  toast.success("Copied to clipboard!")
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedLetter}
              onChange={(e) => setGeneratedLetter(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SkillGapAnalyzer() {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Target className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Skill Gap Analyzer</h3>
        <p className="text-slate-600">Coming soon...</p>
      </CardContent>
    </Card>
  )
}

function JobMatchRecommendations() {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <TrendingUp className="h-16 w-16 text-orange-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 mb-2">Job Match Recommendations</h3>
        <p className="text-slate-600">Coming soon...</p>
      </CardContent>
    </Card>
  )
}

function CareerFeedbackTool() {
  const dispatch = useDispatch()
  const { resumes, isLoading } = useSelector((s) => s.resume)
  const [feedbackResume, setFeedbackResume] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    dispatch(fetchMyResumes())
  }, [dispatch])

  const handleSelect = (resumeSummary) => {
    dispatch(fetchResumeById(resumeSummary.id)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        setFeedbackResume(action.payload.data ?? action.payload)
        setShowFeedback(true)
      }
    })
  }

  return (
    <>
      {/* Header card */}
      <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 mb-6">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">AI Career Feedback Engine</h2>
              <p className="text-slate-600 text-sm">
                Select one of your resumes below. The AI will tell you why you may not be getting
                shortlisted, what to improve, and which jobs match your current profile.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resume list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Choose a Resume to Analyze</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg border border-slate-200">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </>
          )}

          {!isLoading && resumes.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <FileText className="h-10 w-10 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium">No resumes found</p>
              <p className="text-xs mt-1">Create a resume first from the Resumes page.</p>
            </div>
          )}

          {!isLoading && resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{resume.title}</p>
                <p className="text-xs text-slate-500">{resume.completionScore ?? 0}% complete · {resume.template}</p>
              </div>
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 shrink-0"
                onClick={() => handleSelect(resume)}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Analyze
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <CareerFeedbackDialog
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        resume={feedbackResume}
      />
    </>
  )
}
