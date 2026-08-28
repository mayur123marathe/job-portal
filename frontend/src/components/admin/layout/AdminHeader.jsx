import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/store/user/userAuth"
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  UserPlus,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Building2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const notifications = [
  {
    id: 1,
    icon: UserPlus,
    title: "New user registered",
    desc: "Sarah Johnson joined as Job Seeker",
    time: "2 min ago",
    iconColor: "text-brand",
    iconBg: "bg-blue-50",
  },
  {
    id: 2,
    icon: Briefcase,
    title: "New job posted",
    desc: 'TechCorp posted "Senior React Developer"',
    time: "5 min ago",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    id: 3,
    icon: AlertTriangle,
    title: "Job flagged for review",
    desc: '"Work From Home" job reported by 3 users',
    time: "1 hr ago",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
  {
    id: 4,
    icon: CheckCircle,
    title: "Job listing approved",
    desc: '"Backend Engineer" at StartupXYZ approved',
    time: "2 hr ago",
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    id: 5,
    icon: Building2,
    title: "New employer registered",
    desc: "GlobalCorp verified as premium employer",
    time: "3 hr ago",
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
  },
]

export default function AdminHeader({ onMenuClick }) {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const initials = `${user?.firstName?.[0] || "A"}${user?.lastName?.[0] || ""}`.toUpperCase()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-slate-600"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search bar */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="Search users, jobs, companies..."
            className="pl-9 bg-slate-50 border-slate-200 text-sm focus-visible:ring-slate-300"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 ml-auto">

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-slate-600 hover:text-slate-900">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px] flex items-center justify-center bg-red-500 hover:bg-red-500 border-2 border-white">
                {notifications.length}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between py-3">
              <span className="font-semibold">Notifications</span>
              <span className="text-xs font-normal text-slate-400">
                {notifications.length} unread
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              {notifications.map((n, i) => {
                const Icon = n.icon
                return (
                  <div key={n.id}>
                    <div className="flex items-start gap-3 px-3 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${n.iconBg}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${n.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 leading-tight">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{n.desc}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                    {i < notifications.length - 1 && <DropdownMenuSeparator />}
                  </div>
                )
              })}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-xs h-8 text-slate-500 hover:text-slate-900">
                View All Notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2 hover:bg-slate-100">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-red-500 to-rose-600 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900 leading-tight">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-slate-500">Administrator</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-semibold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-500 font-normal mt-0.5">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
