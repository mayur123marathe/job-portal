import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const monthlyData = [
  { label: "Jan", users: 4200, jobs: 1800 },
  { label: "Feb", users: 5800, jobs: 2200 },
  { label: "Mar", users: 5200, jobs: 2600 },
  { label: "Apr", users: 7500, jobs: 2900 },
  { label: "May", users: 6800, jobs: 3400 },
  { label: "Jun", users: 8900, jobs: 3100 },
  { label: "Jul", users: 9200, jobs: 3800 },
  { label: "Aug", users: 8600, jobs: 4200 },
  { label: "Sep", users: 10400, jobs: 4500 },
  { label: "Oct", users: 11200, jobs: 4900 },
  { label: "Nov", users: 10800, jobs: 5100 },
  { label: "Dec", users: 12453, jobs: 5300 },
]

function AreaSparkline({ data, color, gradientId }) {
  const W = 600
  const H = 120
  const PAD = { t: 10, r: 10, b: 10, l: 10 }
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const max = Math.max(...data) * 1.1

  const pts = data.map((v, i) => {
    const x = PAD.l + (i / (data.length - 1)) * innerW
    const y = PAD.t + innerH - (v / max) * innerH
    return [x, y]
  })

  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ")
  const areaPath = `${linePath} L ${pts[pts.length - 1][0]} ${H - PAD.b} L ${pts[0][0]} ${H - PAD.b} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="4"
        fill={color}
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  )
}

export default function PlatformChart() {
  const userData = monthlyData.map((d) => d.users)
  const jobData = monthlyData.map((d) => d.jobs)

  const visibleLabels = monthlyData.filter((_, i) => i % 3 === 0 || i === monthlyData.length - 1)

  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">Platform Growth</CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">Users & active jobs over 12 months</p>
          </div>
          <div className="flex items-center gap-4 text-xs shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 inline-block" />
              <span className="text-slate-500 font-medium">Users</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-500 font-medium">Jobs</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 space-y-4">
        {/* Users chart */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-500">Total Users</span>
            <span className="text-xs font-bold text-brand">12,453</span>
          </div>
          <AreaSparkline data={userData} color="#3b82f6" gradientId="grad-users" />
        </div>

        {/* Jobs chart */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-500">Active Jobs</span>
            <span className="text-xs font-bold text-emerald-600">5,300</span>
          </div>
          <AreaSparkline data={jobData} color="#10b981" gradientId="grad-jobs" />
        </div>

        {/* Month labels */}
        <div className="flex justify-between px-0.5">
          {visibleLabels.map((d) => (
            <span key={d.label} className="text-[10px] text-slate-400 font-medium">
              {d.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
