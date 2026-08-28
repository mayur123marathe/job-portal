import { useDispatch } from "react-redux"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  ShieldCheck,
  Ban,
  Trash2,
  Building2,
  CheckCircle,
  Globe,
} from "lucide-react"
import CompanyStatusBadge from "./CompanyStatusBadge"
import { verifyCompany, deactivateCompany, deleteCompany } from "@/store/company/companyThunk"
import { cn } from "@/lib/utils"

const typeLabels = {
  STARTUP: "Startup",
  PRIVATE: "Private",
  PUBLIC_LISTED: "Public",
  GOVERNMENT: "Govt.",
  NON_PROFIT: "Non-Profit",
  EDUCATIONAL: "Education",
  SELF_EMPLOYED: "Self-Employed",
}

const sizeLabels = {
  MICRO: "1–10",
  SMALL: "11–50",
  MEDIUM: "51–200",
  LARGE: "201–1K",
  ENTERPRISE: "1K+",
}

const industryCropLabels = {
  FINANCE_BANKING: "Finance",
  RETAIL_ECOMMERCE: "Retail",
  MEDIA_ENTERTAINMENT: "Media",
  TRANSPORTATION_LOGISTICS: "Logistics",
  ENERGY_UTILITIES: "Energy",
  MARKETING_ADVERTISING: "Marketing",
  HUMAN_RESOURCES: "HR",
}

function industryLabel(raw) {
  if (!raw) return "—"
  return (
    industryCropLabels[raw] ||
    raw
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  )
}

function formatDate(dateStr) {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// ── Loading skeleton ─────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i} className="border-slate-100">
          <TableCell className="pl-6">
            <Skeleton className="h-4 w-4" />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ── Main table ───────────────────────────────────────────────────────────────
export default function CompanyTable({
  companies,
  isLoading,
  isActionLoading,
  onViewDetail,
  onDeleteConfirm,
}) {
  const dispatch = useDispatch()

  const handleVerify = (company) => {
    dispatch(verifyCompany(company.id))
      .unwrap()
      .then(() => toast.success(`"${company.name}" verified successfully`))
      .catch((err) => toast.error(err))
  }

  const handleDeactivate = (company) => {
    dispatch(deactivateCompany(company.id))
      .unwrap()
      .then(() => toast.success(`"${company.name}" has been deactivated`))
      .catch((err) => toast.error(err))
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-200">
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-6 w-10">
              #
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Company
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Industry / Type
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Size
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Verified
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Registered
            </TableHead>
            <TableHead className="w-12 pr-4" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : companies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <Building2 className="h-10 w-10 text-slate-300" />
                  <p className="text-sm text-slate-500 font-medium">No companies found</p>
                  <p className="text-xs text-slate-400">
                    Try changing your filters or refreshing
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company, index) => (
              <TableRow
                key={company.id}
                className="group hover:bg-slate-50/50 border-slate-100"
              >
                {/* Index */}
                <TableCell className="text-sm text-slate-400 font-medium pl-6">
                  {index + 1}
                </TableCell>

                {/* Company info */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Logo or placeholder */}
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500">
                        <Building2 className="h-5 w-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 leading-tight truncate max-w-[180px]">
                        {company.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {company.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-0.5 text-xs text-blue-500 hover:text-brand truncate max-w-[140px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="h-3 w-3 shrink-0" />
                            {company.website.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <p className="text-xs text-slate-400 truncate max-w-[140px]">
                            {company.tagline || company.slug || "—"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Industry / Type */}
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {industryLabel(company.industryType)}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {typeLabels[company.companyType] || company.companyType || "—"}
                    </p>
                  </div>
                </TableCell>

                {/* Size */}
                <TableCell>
                  <span className="text-sm text-slate-600 font-medium">
                    {sizeLabels[company.companySize] || company.companySize || "—"}
                    <span className="text-xs text-slate-400 ml-0.5">emp</span>
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <CompanyStatusBadge status={company.status} />
                </TableCell>

                {/* Verified */}
                <TableCell>
                  {company.verified ? (
                    <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Unverified</span>
                  )}
                </TableCell>

                {/* Registered date */}
                <TableCell>
                  <span className="text-xs text-slate-500">{formatDate(company.createdAt)}</span>
                </TableCell>

                {/* Actions */}
                <TableCell className="pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isActionLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-xs text-slate-500 font-normal">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => onViewDetail(company)}>
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        View Details
                      </DropdownMenuItem>

                      {/* Show Verify only if not already verified / active */}
                      {company.status !== "ACTIVE" && (
                        <DropdownMenuItem
                          onClick={() => handleVerify(company)}
                          className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 mr-2" />
                          Verify Company
                        </DropdownMenuItem>
                      )}

                      {/* Show Deactivate only if currently active */}
                      {company.status === "ACTIVE" && (
                        <DropdownMenuItem
                          onClick={() => handleDeactivate(company)}
                          className="text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                        >
                          <Ban className="h-3.5 w-3.5 mr-2" />
                          Deactivate
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => onDeleteConfirm(company)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" />
                        Delete Company
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
