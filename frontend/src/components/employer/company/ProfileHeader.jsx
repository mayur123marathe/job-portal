import { Building2, ShieldCheck, Clock, Ban } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig = {
  ACTIVE:               { label: "Active",               className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  PENDING_VERIFICATION: { label: "Pending Verification", className: "bg-amber-50 text-amber-700 border-amber-200" },
  SUSPENDED:            { label: "Suspended",            className: "bg-red-50 text-red-700 border-red-200" },
  REJECTED:             { label: "Rejected",             className: "bg-slate-100 text-slate-600 border-slate-200" },
}

const statusIcon = {
  ACTIVE:               <ShieldCheck className="h-3.5 w-3.5" />,
  PENDING_VERIFICATION: <Clock className="h-3.5 w-3.5" />,
  SUSPENDED:            <Ban className="h-3.5 w-3.5" />,
  REJECTED:             <Ban className="h-3.5 w-3.5" />,
}

export default function ProfileHeader({ company }) {
  const cfg = statusConfig[company.status] || statusConfig.PENDING_VERIFICATION

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      {/* Cover image */}
      <div
        className={cn(
          "h-36 w-full",
          company.coverImageUrl ? "bg-cover bg-center" : "bg-brand"
        )}
        style={company.coverImageUrl ? { backgroundImage: `url(${company.coverImageUrl})` } : {}}
      />

      {/* Logo + info row */}
      <div className="px-6 pb-5">
        <div className="flex items-end gap-4 -mt-8 mb-4">
          {/* Logo */}
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="h-20 w-20 rounded-xl object-cover border-4 border-white shadow-md shrink-0"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-white border-4 border-white shadow-md bg-gradient-to-br from-slate-100 to-slate-200 shrink-0">
              <Building2 className="h-9 w-9 text-slate-400" />
            </div>
          )}

          {/* Badges */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Badge variant="outline" className={cn("gap-1 text-xs font-semibold border", cfg.className)}>
              {statusIcon[company.status]}
              {cfg.label}
            </Badge>
            {company.verified && (
              <Badge variant="outline" className="gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">{company.name}</h2>
          {company.tagline && (
            <p className="text-sm text-slate-500 mt-0.5">{company.tagline}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
            {company.industryType && (
              <span>{company.industryType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
            )}
            {company.companyType && (
              <span>{company.companyType.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
            )}
            {company.companySize && (
              <span>{company.companySize.charAt(0) + company.companySize.slice(1).toLowerCase()} company</span>
            )}
            {company.foundedYear && <span>Est. {company.foundedYear}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
