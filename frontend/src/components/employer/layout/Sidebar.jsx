import { Link, NavLink, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { cn } from "@/lib/utils"
import { logout } from "@/store/user/userAuth"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  BrainCircuit,
  MessageSquare,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Sparkles,
} from "lucide-react"

const navigation = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Hiring",
    items: [
      { name: "All Jobs", href: "/employer/jobs", icon: Briefcase },
      { name: "Create Job", href: "/employer/jobs/create", icon: PlusCircle },
      { name: "Applications", href: "/employer/applications", icon: FileText },
      
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "AI Screening", href: "/employer/ai-screening", icon: BrainCircuit },
     
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Company Profile", href: "/employer/company", icon: Building2 },
     
      { name: "Settings", href: "/employer/settings", icon: Settings },
    ],
  },
]

export default function Sidebar({ collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <div
      className={cn(
        "relative flex flex-col bg-slate-950 transition-all duration-300 shrink-0",
        collapsed ? "w-16" : "w-64",
        // Mobile: off-canvas, Desktop: always visible
        "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Brand Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-4 shrink-0">
        {!collapsed ? (
          <Link to="/employer/dashboard" className="flex items-center gap-2.5 min-w-0">
            <img src="/logo.png" alt="MayurJobs" className="h-8 w-8 shrink-0 rounded-lg object-contain shadow-sm" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">MayurJobs.AI</p>
              <p className="text-[10px] text-slate-400 leading-tight">Employer Dashboard</p>
            </div>
          </Link>
        ) : (
          <Link to="/employer/dashboard" className="flex items-center justify-center w-full">
            <img src="/logo.png" alt="MayurJobs" className="h-8 w-8 rounded-lg object-contain shadow-sm" />
          </Link>
        )}
      </div>

      {/* Collapse Toggle — desktop only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-18 z-10 h-6 w-6 rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white shadow-md"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className={cn("py-4 space-y-5", collapsed ? "px-2" : "px-3")}>
          {navigation.map((section) => (
            <div key={section.title}>
              {/* Section label */}
              {!collapsed ? (
                <h3 className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                  {section.title}
                </h3>
              ) : (
                <div className="border-t border-white/5 mb-2" />
              )}

              {/* Nav items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      end={item.href === "/employer/jobs"}
                      title={collapsed ? item.name : undefined}
                      onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all duration-150",
                          collapsed ? "justify-center px-0" : "px-3",
                          isActive
                            ? "bg-brand/90 text-white shadow-sm shadow-brand/30"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        )
                      }
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Logout */}
      <div className={cn("border-t border-white/5 p-3", collapsed && "flex justify-center")}>
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors",
            collapsed ? "justify-center px-2" : "px-3 w-full"
          )}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}
