import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  UserPlus,
  Briefcase,
  FileText,
  Building2,
  AlertTriangle,
  CheckCircle,
  Star,
  XCircle,
} from "lucide-react"

const activities = [
  {
    id: 1,
    title: "New user registered",
    desc: "Sarah Johnson joined as Job Seeker",
    time: "2 min ago",
    icon: UserPlus,
    color: "text-brand",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    title: "New job posted",
    desc: 'TechCorp posted "Senior React Developer"',
    time: "5 min ago",
    icon: Briefcase,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 3,
    title: "Application submitted",
    desc: 'Alex Chen applied for "Data Analyst"',
    time: "12 min ago",
    icon: FileText,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    id: 4,
    title: "Company registered",
    desc: "InnovateTech registered as employer",
    time: "25 min ago",
    icon: Building2,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    id: 5,
    title: "Job flagged for review",
    desc: '"Work From Home" job reported by 3 users',
    time: "1 hr ago",
    icon: AlertTriangle,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    id: 6,
    title: "Job listing approved",
    desc: '"Backend Engineer" at StartupXYZ approved',
    time: "2 hr ago",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 7,
    title: "Employer verified",
    desc: "GlobalCorp verified as premium employer",
    time: "3 hr ago",
    icon: Star,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    id: 8,
    title: "Job closed",
    desc: '"Marketing Manager" at BrandCo closed',
    time: "5 hr ago",
    icon: XCircle,
    color: "text-slate-600",
    bg: "bg-slate-100",
  },
]

export default function RecentActivity() {
  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">Recent Activity</CardTitle>
          <button className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors">
            View all
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[340px]">
          <div className="divide-y divide-slate-50">
            {activities.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      item.bg
                    )}
                  >
                    <Icon className={cn("h-3.5 w-3.5", item.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 leading-tight">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{item.desc}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
                    {item.time}
                  </span>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
