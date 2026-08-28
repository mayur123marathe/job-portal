import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Star, StarOff, Trash2, Eye, Pencil, CheckCircle2, Clock, AlertCircle, Sparkles, User,
} from "lucide-react"
import { TEMPLATES, TEMPLATE_BADGE_COLORS, TemplateProfessional } from "./ResumeTemplates"

function computeCompletionScore(resume) {
  let score = 0
  const pi = resume.personalInfo ?? {}
  if (pi.firstName || pi.lastName) score += 10
  if (pi.email)                    score += 5
  if (pi.headline)                 score += 5
  if (resume.summary)              score += 15
  if (resume.workExperiences?.length > 0) score += 20
  if (resume.educations?.length > 0)      score += 15
  if ((resume.skills?.length ?? 0) >= 2)  score += 15
  if (resume.projects?.length > 0)        score += 10
  if (resume.certifications?.length > 0)  score += 5
  return score
}

function timeAgo(iso) {
  if (!iso) return ""
  const d = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (d === 0) return "Today"
  if (d === 1) return "Yesterday"
  if (d < 30) return `${d}d ago`
  return `${Math.floor(d / 30)}mo ago`
}

export default function ResumeCard({ resume, onSetDefault, onDelete, onFeedback, isActionLoading }) {
  const navigate = useNavigate()
  const tmpl = TEMPLATES.find((t) => t.value === resume.template)
  const PreviewComp = tmpl?.preview ?? TemplateProfessional
  const badgeCls = TEMPLATE_BADGE_COLORS[resume.template] ?? "bg-slate-600 text-white"
  const completionScore = computeCompletionScore(resume)

  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow overflow-hidden">
      {/* Mini template preview */}
      <div className="h-36 border-b border-slate-100 overflow-hidden bg-slate-50 relative">
        <div className="absolute inset-0 scale-[0.92] origin-top-left" style={{ width: "109%", height: "109%" }}>
          <PreviewComp />
        </div>
        {resume.isDefault && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
            <Star className="h-3 w-3 fill-current" />
            Default
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Profile image + title + badge */}
        <div className="flex items-start gap-3 mb-2">
          <div className="h-10 w-10 rounded-full border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
            {resume.personalInfo?.profileImage
              ? <img src={resume.personalInfo.profileImage} alt={resume.personalInfo?.firstName ?? "Profile"} className="h-full w-full object-cover" />
              : <User className="h-5 w-5 text-slate-400" />}
          </div>
          <div className="flex-1 flex items-start justify-between gap-2 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">{resume.title}</h3>
            <Badge className={`${badgeCls} text-xs shrink-0`}>{tmpl?.label ?? resume.template}</Badge>
          </div>
        </div>

        {/* Completion */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Completion</span>
            <span className={`font-semibold ${
              completionScore >= 80 ? "text-green-600"
              : completionScore >= 50 ? "text-brand"
              : "text-orange-500"
            }`}>
              {completionScore}%
            </span>
          </div>
          <Progress value={completionScore} className="h-1.5" />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {timeAgo(resume.updatedAt)}
          </span>
          <span className="flex items-center gap-1">
            {resume.visibility === "PUBLIC"
              ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              : <AlertCircle className="h-3.5 w-3.5 text-slate-400" />}
            {resume.visibility?.replace("_", " ")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 mb-2">
          <Button
            variant="outline" size="sm" className="flex-1 text-xs"
            onClick={() => navigate(`/resumes/${resume.id}/view`)}
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> View
          </Button>
          <Button
            variant="outline" size="sm" className="flex-1 text-xs"
            onClick={() => navigate(`/resumes/${resume.id}/edit`)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
          </Button>
          <Button
            variant="ghost" size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
            onClick={() => onDelete(resume)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* AI Career Feedback */}
        <Button
          variant="outline" size="sm"
          className="w-full text-xs text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700 mb-2"
          onClick={() => onFeedback(resume)}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          AI Career Feedback
        </Button>

        {/* Default toggle */}
        {!resume.isDefault ? (
          <Button
            variant="ghost" size="sm"
            className="w-full text-xs text-slate-500 hover:text-yellow-700 hover:bg-yellow-50"
            onClick={() => onSetDefault(resume.id)}
            disabled={isActionLoading}
          >
            <StarOff className="h-3.5 w-3.5 mr-1" />
            Set as Default
          </Button>
        ) : (
          <div className="w-full flex items-center justify-center gap-1 text-xs text-yellow-600 font-medium py-1">
            <Star className="h-3.5 w-3.5 fill-current" />
            Default Resume
          </div>
        )}
      </CardContent>
    </Card>
  )
}
