import { Building2, MapPin, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function JobInfoCard({ job }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden">
            {job.company?.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name}
                className="h-full w-full object-fill"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                  e.currentTarget.nextSibling.style.removeProperty("display")
                }}
              />
            ) : null}
            <Building2 className={`h-7 w-7 text-slate-400 ${job.company?.logoUrl ? "hidden" : ""}`} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-0.5">Apply for {job.title}</h1>
            <div className="flex items-center gap-2 flex-wrap text-slate-600 text-sm">
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-medium">{job.company?.name ?? `Company #${job.companyId}`}</span>
                {job.company?.verified && (
                  <CheckCircle2 className="h-4 w-4 fill-primary text-white shrink-0" />
                )}
              </div>
              {job.city && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{[job.city, job.state, job.country].filter(Boolean).join(", ")}</span>
                </div>
              )}
            </div>
            {job.company?.tagline && (
              <p className="text-xs text-slate-400 italic mt-0.5">{job.company.tagline}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
