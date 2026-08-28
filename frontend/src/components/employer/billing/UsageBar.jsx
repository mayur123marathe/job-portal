import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"

export default function UsageBar({ label, current, limit, unit = "", tooltip, variant = "default" }) {
  const percentage = (current / limit) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  const getProgressColor = () => {
    if (isAtLimit) return "bg-red-600"
    if (isNearLimit) return "bg-amber-600"
    return "bg-brand"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700">{label}</span>
          {tooltip && (
            <div className="group relative">
              <Info className="h-4 w-4 text-slate-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-lg z-10">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <span className={cn(
          "text-sm font-semibold",
          isAtLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-slate-900"
        )}>
          {current} / {limit} {unit}
        </span>
      </div>
      <div className="relative">
        <Progress
          value={Math.min(percentage, 100)}
          className="h-2"
        />
        <style>{`
          .${getProgressColor().replace('bg-', '')} {
            background-color: ${
              isAtLimit ? '#dc2626' : isNearLimit ? '#d97706' : '#2563eb'
            };
          }
        `}</style>
      </div>
      {isAtLimit && (
        <p className="text-xs text-red-600">
          Limit reached. Upgrade your plan to continue.
        </p>
      )}
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-amber-600">
          You're approaching your limit. Consider upgrading.
        </p>
      )}
    </div>
  )
}
