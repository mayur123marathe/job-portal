import { useDispatch } from "react-redux"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  Globe,
  Mail,
  Phone,
  Calendar,
  Users,
  ShieldCheck,
  Ban,
  ExternalLink,
  MapPin,
  Hash,
} from "lucide-react"
import CompanyStatusBadge from "./CompanyStatusBadge"
import { verifyCompany, deactivateCompany } from "@/store/company/companyThunk"
import { cn } from "@/lib/utils"

function InfoRow({ icon: Icon, label, value, href }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-3.5 w-3.5 text-slate-600" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-brand hover:text-brand/80 flex items-center gap-1 mt-0.5"
          >
            {value}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <p className="text-sm font-medium text-slate-900 mt-0.5 break-words">{value}</p>
        )}
      </div>
    </div>
  )
}

function EnumChip({ label }) {
  if (!label) return null
  const display = label
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
      {display}
    </span>
  )
}

export default function CompanyDetailDialog({ company, open, onClose, isActionLoading }) {
  const dispatch = useDispatch()

  if (!company) return null

  const handleVerify = () => {
    dispatch(verifyCompany(company.id))
      .unwrap()
      .then(() => toast.success(`"${company.name}" verified successfully`))
      .catch((err) => toast.error(err))
  }

  const handleDeactivate = () => {
    dispatch(deactivateCompany(company.id))
      .unwrap()
      .then(() => toast.success(`"${company.name}" deactivated`))
      .catch((err) => toast.error(err))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Cover + Logo header */}
        <div className="relative">
          {/* Cover image or gradient */}
          <div
            className={cn(
              "h-28 w-full rounded-t-xl",
              company.coverImageUrl
                ? "bg-cover bg-center"
                : "bg-gradient-to-r from-slate-800 to-slate-900"
            )}
            style={
              company.coverImageUrl
                ? { backgroundImage: `url(${company.coverImageUrl})` }
                : {}
            }
          />

          {/* Logo */}
          <div className="absolute -bottom-5 left-6">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-16 w-16 rounded-xl object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white border-4 border-white shadow-md bg-gradient-to-br from-slate-100 to-slate-200">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
            )}
          </div>

          {/* Status badge top-right */}
          <div className="absolute top-3 right-4">
            <CompanyStatusBadge status={company.status} />
          </div>
        </div>

        {/* Content */}
        <div className="pt-8 px-6 pb-6 space-y-5">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  {company.name}
                </DialogTitle>
                {company.tagline && (
                  <p className="text-sm text-slate-500 mt-0.5">{company.tagline}</p>
                )}
              </div>
              {company.verified && (
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </div>
              )}
            </div>
            {/* Enum chips row */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <EnumChip label={company.industryType} />
              <EnumChip label={company.companyType} />
              <EnumChip label={company.companySize} />
            </div>
          </DialogHeader>

          <Separator />

          {/* Description */}
          {company.description && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                About
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{company.description}</p>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoRow icon={Mail} label="Email" value={company.email} />
            <InfoRow icon={Phone} label="Phone" value={company.phone} />
            <InfoRow
              icon={Globe}
              label="Website"
              value={company.website}
              href={company.website}
            />
            <InfoRow
              icon={Calendar}
              label="Founded"
              value={company.foundedYear ? String(company.foundedYear) : null}
            />
            <InfoRow
              icon={Hash}
              label="Registration No."
              value={company.registrationNumber}
            />
            <InfoRow
              icon={Users}
              label="Owner ID"
              value={company.ownerId ? `#${company.ownerId}` : null}
            />
          </div>

          {/* Locations */}
          {company.locations?.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Locations ({company.locations.length})
              </p>
              <div className="space-y-1.5">
                {company.locations.map((loc) => (
                  <div key={loc.id} className="flex items-center gap-2 text-sm text-slate-700">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>
                      {[loc.city, loc.state, loc.country].filter(Boolean).join(", ")}
                    </span>
                    {loc.isHeadquarter && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200 ml-1"
                      >
                        HQ
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social links */}
          {company.socialLinks?.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Social Links
              </p>
              <div className="flex flex-wrap gap-2">
                {company.socialLinks.map((sl, i) => (
                  <a
                    key={i}
                    href={sl.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {sl.platform?.replace(/_/g, " ")}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
            <div>
              <span className="font-semibold block text-slate-500">Registered</span>
              {company.createdAt
                ? new Date(company.createdAt).toLocaleString()
                : "—"}
            </div>
            {company.verifiedAt && (
              <div>
                <span className="font-semibold block text-slate-500">Verified At</span>
                {new Date(company.verifiedAt).toLocaleString()}
              </div>
            )}
          </div>

          <Separator />

          {/* Admin action buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" size="sm" onClick={onClose} className="border-slate-200">
              Close
            </Button>

            {company.status === "ACTIVE" ? (
              <Button
                size="sm"
                variant="outline"
                className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={handleDeactivate}
                disabled={isActionLoading}
              >
                <Ban className="h-4 w-4" />
                Deactivate
              </Button>
            ) : (
              <Button
                size="sm"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleVerify}
                disabled={isActionLoading}
              >
                <ShieldCheck className="h-4 w-4" />
                Verify Company
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
