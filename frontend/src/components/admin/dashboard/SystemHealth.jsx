import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const services = [
  { name: "API Gateway", status: "operational", latency: "12ms", uptime: "99.98%" },
  { name: "Auth Service", status: "operational", latency: "8ms", uptime: "99.99%" },
  { name: "Job Service", status: "operational", latency: "15ms", uptime: "99.97%" },
  { name: "User Service", status: "operational", latency: "11ms", uptime: "99.99%" },
  { name: "Search Index", status: "degraded", latency: "145ms", uptime: "98.50%" },
  { name: "Email Service", status: "operational", latency: "34ms", uptime: "99.95%" },
]

const statusConfig = {
  operational: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    pulse: true,
  },
  degraded: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    pulse: false,
  },
  down: {
    dot: "bg-red-500",
    text: "text-red-700",
    pulse: false,
  },
}

export default function SystemHealth() {
  const operationalCount = services.filter((s) => s.status === "operational").length
  const allOperational = operationalCount === services.length

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">System Health</CardTitle>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
              allOperational
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full inline-block",
                allOperational ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              )}
            />
            {operationalCount}/{services.length} Online
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3.5">
          {services.map((service) => {
            const config = statusConfig[service.status]
            return (
              <div key={service.name} className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    config.dot,
                    config.pulse && "animate-pulse"
                  )}
                />
                <span className="flex-1 text-sm font-medium text-slate-700 truncate">
                  {service.name}
                </span>
                <span className="text-xs text-slate-400 hidden sm:block font-mono">
                  {service.latency}
                </span>
                <span className={cn("text-xs font-bold tabular-nums", config.text)}>
                  {service.uptime}
                </span>
              </div>
            )
          })}
        </div>

        {/* Overall status bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-medium">Overall Uptime</span>
            <span className="font-bold text-slate-900">99.73%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
              style={{ width: "99.73%" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
