import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"

const employers = [
  {
    id: 1,
    name: "TechCorp Inc",
    industry: "Technology",
    jobs: 42,
    applications: 384,
    status: "verified",
    color: "bg-blue-50 text-blue-700",
  },
  {
    id: 2,
    name: "InnovateTech",
    industry: "Software",
    jobs: 31,
    applications: 256,
    status: "verified",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    id: 3,
    name: "GlobalCorp",
    industry: "Finance",
    jobs: 28,
    applications: 198,
    status: "verified",
    color: "bg-purple-50 text-purple-700",
  },
  {
    id: 4,
    name: "StartupXYZ",
    industry: "SaaS",
    jobs: 19,
    applications: 143,
    status: "pending",
    color: "bg-orange-50 text-orange-700",
  },
  {
    id: 5,
    name: "DataSystems",
    industry: "Analytics",
    jobs: 15,
    applications: 87,
    status: "verified",
    color: "bg-cyan-50 text-cyan-700",
  },
]

export default function TopEmployers() {
  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">Top Employers</CardTitle>
          <button className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors">
            View all
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {employers.map((employer) => (
            <div
              key={employer.id}
              className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${employer.color}`}
              >
                <Building2 className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-slate-900 truncate">{employer.name}</p>
                  {employer.status === "verified" && (
                    <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-black shrink-0">
                      ✓
                    </span>
                  )}
                  {employer.status === "pending" && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 shrink-0"
                    >
                      Pending
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400">{employer.industry}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-slate-900">{employer.jobs}</p>
                <p className="text-[11px] text-slate-400">{employer.applications} apps</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
