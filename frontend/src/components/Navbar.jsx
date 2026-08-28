import { Link } from "react-router-dom"
import { Button } from "./ui/button"

export default function Navbar() {
  return (
    // Sticky header with clean design
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-bold text-slate-900">
            <img src="/logo.png" alt="MayurJobs" className="h-8 w-8 rounded-lg object-contain shadow-sm border border-slate-100" />
            <span>Mayur<span className="text-brand">Jobs</span></span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#jobs"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Jobs
          </a>
          <a
            href="#employers"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            For Employers
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Features
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-sm">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button className="text-sm">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
