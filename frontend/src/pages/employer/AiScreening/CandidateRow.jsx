import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import AiScoreCircle from "@/components/ui/AiScoreCircle"
import { getInitials } from "./config"

export default function CandidateRow({ app }) {
  const navigate = useNavigate()

  return (
    <div
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
      onClick={() => navigate(`/employer/applications/${app.id}/screening`)}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white text-xs font-bold">
        {getInitials(app.candidate?.fullName)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {app.candidate?.fullName ?? `Candidate #${app.candidateId}`}
        </p>
        <p className="text-xs text-slate-400 truncate">
          {app.job?.title ?? `Job #${app.jobId}`}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <AiScoreCircle score={app.screening?.overallScore} size={38} stroke={3} />
        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand transition-colors" />
      </div>
    </div>
  )
}
