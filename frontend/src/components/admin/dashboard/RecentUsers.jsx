import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const recentUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "ROLE_JOB_SEEKER",
    joined: "2 min ago",
    avatarColor: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    name: "TechCorp HR",
    email: "hr@techcorp.com",
    role: "ROLE_EMPLOYER",
    joined: "5 min ago",
    avatarColor: "from-purple-400 to-purple-600",
  },
  {
    id: 3,
    name: "Alex Chen",
    email: "alex@example.com",
    role: "ROLE_JOB_SEEKER",
    joined: "12 min ago",
    avatarColor: "from-emerald-400 to-emerald-600",
  },
  {
    id: 4,
    name: "InnovateTech",
    email: "info@innovate.com",
    role: "ROLE_EMPLOYER",
    joined: "25 min ago",
    avatarColor: "from-orange-400 to-orange-600",
  },
  {
    id: 5,
    name: "Maria Santos",
    email: "maria@example.com",
    role: "ROLE_JOB_SEEKER",
    joined: "1 hr ago",
    avatarColor: "from-pink-400 to-pink-600",
  },
]

const roleConfig = {
  ROLE_JOB_SEEKER: { label: "Seeker", className: "bg-blue-50 text-blue-700 border-blue-200" },
  ROLE_EMPLOYER: { label: "Employer", className: "bg-purple-50 text-purple-700 border-purple-200" },
  ROLE_ADMIN: { label: "Admin", className: "bg-red-50 text-red-700 border-red-200" },
}

export default function RecentUsers() {
  return (
    <Card className="border-0 shadow-sm h-full">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">Recent Registrations</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-7 gap-1 px-2"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {recentUsers.map((user) => {
            const initials = user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
            const role = roleConfig[user.role] || roleConfig.ROLE_JOB_SEEKER
            return (
              <div
                key={user.id}
                className="flex items-center gap-3 px-6 py-3.5 hover:bg-slate-50/60 transition-colors group"
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${user.avatarColor} text-white text-xs font-bold`}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-semibold px-1.5 py-0 h-5 border ${role.className}`}
                  >
                    {role.label}
                  </Badge>
                  <span className="text-[11px] text-slate-400 hidden sm:block">{user.joined}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
