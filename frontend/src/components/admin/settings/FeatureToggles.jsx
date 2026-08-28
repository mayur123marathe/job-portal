import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Save } from "lucide-react"

const features = [
  {
    id: "ai_screening",
    label: "AI Resume Screening",
    desc: "Automatically screen and rank candidates using AI models",
    enabled: true,
    badge: "AI",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    id: "ai_matching",
    label: "AI Job Matching",
    desc: "Match job seekers with relevant jobs using machine learning",
    enabled: true,
    badge: "AI",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    id: "resume_parsing",
    label: "Resume Parsing",
    desc: "Automatically extract structured data from uploaded resumes",
    enabled: true,
    badge: null,
    badgeColor: null,
  },
  {
    id: "google_oauth",
    label: "Google OAuth Login",
    desc: "Allow users to register and sign in with their Google account",
    enabled: true,
    badge: null,
    badgeColor: null,
  },
  {
    id: "email_notifications",
    label: "Email Notifications",
    desc: "Send automated emails for applications, matches, and status updates",
    enabled: true,
    badge: null,
    badgeColor: null,
  },
  {
    id: "subscription",
    label: "Subscription Plans",
    desc: "Enable paid subscription tiers for employer accounts",
    enabled: true,
    badge: "Revenue",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "job_expiry",
    label: "Automatic Job Expiry",
    desc: "Automatically expire job listings after the configured duration",
    enabled: true,
    badge: null,
    badgeColor: null,
  },
  {
    id: "public_profiles",
    label: "Public Candidate Profiles",
    desc: "Allow employers to browse and contact candidates directly",
    enabled: false,
    badge: "Beta",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "referral",
    label: "Referral Program",
    desc: "Reward users who refer new employers or job seekers",
    enabled: false,
    badge: "Beta",
    badgeColor: "bg-blue-100 text-blue-700",
  },
]

export default function FeatureToggles() {
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Zap className="h-4 w-4 text-slate-500" />
            Feature Flags
          </CardTitle>
          <CardDescription className="text-sm">
            Enable or disable platform features without redeploying
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex-1 pr-8">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{feature.label}</p>
                    {feature.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${feature.badgeColor}`}
                      >
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{feature.desc}</p>
                </div>
                <Switch defaultChecked={feature.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="border-slate-200 text-slate-600">
          Reset to Defaults
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
