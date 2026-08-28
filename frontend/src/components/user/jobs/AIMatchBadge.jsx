import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export default function AIMatchBadge({ score }) {
  if (!score) return null

  const getColorClass = (score) => {
    if (score >= 90) return "bg-green-100 text-green-700 border-green-200"
    if (score >= 75) return "bg-blue-100 text-blue-700 border-blue-200"
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200"
    return "bg-slate-100 text-slate-700 border-slate-200"
  }

  return (
    <Badge variant="outline" className={`gap-1 ${getColorClass(score)}`}>
      <Sparkles className="h-3 w-3" />
      {score}% Match
    </Badge>
  )
}
