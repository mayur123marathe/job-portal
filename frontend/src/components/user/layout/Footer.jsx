import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"
import { Link } from "react-router-dom"
import { Briefcase } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/jobs" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="MayurJobs" className="h-8 w-8 rounded-lg object-contain shadow-sm border border-slate-200" />
              <span className="text-xl font-bold text-slate-900">MayurJobs</span>
            </Link>
            <p className="text-sm text-slate-600">
              Find your dream job with AI-powered recommendations and smart matching.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                <TwitterLogoIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                <LinkedInLogoIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-600 transition-colors">
                <GitHubLogoIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">For Job Seekers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/jobs" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/applications" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  My Applications
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/ai-tools" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  AI Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">For Employers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/employer/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  AI Screening
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600">
            © {new Date().getFullYear()} Mayur Job Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
