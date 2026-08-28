import { Users, Briefcase, Building2, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import StatsCard from "@/components/admin/dashboard/StatsCard"
import RecentActivity from "@/components/admin/dashboard/RecentActivity"
import PlatformChart from "@/components/admin/dashboard/PlatformChart"
import RecentUsers from "@/components/admin/dashboard/RecentUsers"
import TopEmployers from "@/components/admin/dashboard/TopEmployers"
import QuickActions from "@/components/admin/dashboard/QuickActions"
import SystemHealth from "@/components/admin/dashboard/SystemHealth"

const stats = [
  {
    title: "Total Users",
    value: "12,453",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    color: "blue",
    description: "2,341 active this week",
  },
  {
    title: "Active Jobs",
    value: "8,234",
    change: "+8.2%",
    trend: "up",
    icon: Briefcase,
    color: "green",
    description: "523 posted today",
  },
  {
    title: "Companies",
    value: "1,452",
    change: "+4.3%",
    trend: "up",
    icon: Building2,
    color: "purple",
    description: "124 pending review",
  },
  {
    title: "Applications",
    value: "45,678",
    change: "+15.8%",
    trend: "up",
    icon: FileText,
    color: "orange",
    description: "3,211 submitted today",
  },
]

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">{today}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-slate-200 text-slate-600 shadow-sm shrink-0"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PlatformChart />
        </div>
        <QuickActions />
      </div>

      {/* Recent Users + Top Employers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentUsers />
        <TopEmployers />
      </div>

      {/* Activity Feed + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <SystemHealth />
      </div>
    </div>
  )
}
