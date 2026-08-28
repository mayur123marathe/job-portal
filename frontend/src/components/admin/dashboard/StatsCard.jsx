import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

const colorMap = {
  blue: {
    bg: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-200",
    glow: "bg-blue-400",
  },
  green: {
    bg: "from-emerald-500 to-green-600",
    shadow: "shadow-emerald-200",
    glow: "bg-emerald-400",
  },
  purple: {
    bg: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-200",
    glow: "bg-violet-400",
  },
  orange: {
    bg: "from-orange-500 to-amber-500",
    shadow: "shadow-orange-200",
    glow: "bg-orange-400",
  },
  red: {
    bg: "from-red-500 to-rose-600",
    shadow: "shadow-red-200",
    glow: "bg-red-400",
  },
}

export default function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color = "blue",
  description,
}) {
  const colors = colorMap[color]
  const isPositive = trend === "up"

  return (
    <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-slate-400 truncate">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
              colors.bg,
              colors.shadow
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>

        {change && (
          <div className="mt-4 flex items-center gap-1.5">
            <div
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
                isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {change}
            </div>
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        )}
      </CardContent>

      {/* Decorative glow */}
      <div
        className={cn(
          "absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-[0.06]",
          colors.glow
        )}
      />
    </Card>
  )
}
