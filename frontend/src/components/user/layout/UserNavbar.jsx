import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, User, Briefcase, FileText, Sparkles, Settings, LogOut, ScrollText, Bookmark, Target } from "lucide-react"
import { logout } from "@/store/user/userAuth"

export default function UserNavbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { savedJobs } = useSelector((state) => state.savedJob)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchLocation, setSearchLocation] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/jobs?q=${searchQuery}&location=${searchLocation}`)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/jobs" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="MayurJobs" className="h-8 w-8 rounded-lg object-contain shadow-sm border border-slate-100" />
            <span className="text-xl font-bold text-slate-900">
              Mayur<span className="text-brand">Jobs</span></span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-2xl mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Job title or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative w-48">
              <Input
                placeholder="Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <Button className="bg-brand" type="submit">Search</Button>
          </form>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/jobs"
              className={`hidden lg:block text-sm font-medium transition-colors ${
                isActive("/jobs") ? "text-brand" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Jobs
            </Link>
            
           
            
            <Link
              to="/ai-tools"
              className={`hidden lg:flex items-center gap-1 text-sm font-medium transition-colors ${
                isActive("/ai-tools") ? "text-brand" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              AI Tools
            </Link>

            <Link
              to="/ai-match"
              className={`hidden lg:flex items-center gap-1 text-sm font-medium transition-colors ${
                isActive("/ai-match") ? "text-brand" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Target className="h-4 w-4" />
              AI Match
            </Link>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="space-y-2 p-2">
                  <div className="rounded-lg border p-3 hover:bg-slate-50 cursor-pointer">
                    <p className="text-sm font-medium">Application Update</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Your application for Senior React Developer has been shortlisted
                    </p>
                    <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="rounded-lg border p-3 hover:bg-slate-50 cursor-pointer">
                    <p className="text-sm font-medium">New Job Match</p>
                    <p className="text-xs text-slate-600 mt-1">
                      5 new jobs match your profile
                    </p>
                    <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
                  </div>
                  <div className="rounded-lg border p-3 hover:bg-slate-50 cursor-pointer">
                    <p className="text-sm font-medium">Profile View</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Your profile was viewed by TechCorp Inc.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">1 day ago</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="ghost" className="w-full text-sm">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 rounded-full bg-brand flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-slate-500">{user?.email || "user@example.com"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/applications")}>
                  <FileText className="mr-2 h-4 w-4" />
                  My Applications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/saved-jobs")}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Saved Jobs
                  {savedJobs.length > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-brand text-white text-[10px] font-bold">
                      {savedJobs.length}
                    </span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/resumes")}>
                  <ScrollText className="mr-2 h-4 w-4" />
                  My Resumes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Job title or keyword"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </div>
        </form>
      </div>
    </nav>
  )
}
