import { FileText, User, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

const LINKS = [
  { to: "/resumes",      icon: FileText, label: "My Resumes",      sub: "Build & manage resume versions" },
  { to: "/applications", icon: User,     label: "My Applications", sub: "Track application statuses" },
]

export default function QuickLinksCard() {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="py-4 px-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {LINKS.map(({ to, icon: Icon, label, sub }, i) => (
            <>
              {i > 0 && <Separator key={`sep-${i}`} orientation="vertical" className="hidden sm:block h-auto" />}
              <Link key={to} to={to} className="flex-1">
                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-brand/40 hover:bg-brand/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-brand/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-brand" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-brand transition-colors">{label}</p>
                      <p className="text-xs text-slate-500">{sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
