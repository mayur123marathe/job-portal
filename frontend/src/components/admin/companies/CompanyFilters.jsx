import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Download, RefreshCw } from "lucide-react"

const COMPANY_STATUSES = [
  { value: "all", label: "All Status" },
  { value: "PENDING_VERIFICATION", label: "Pending Verification" },
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "REJECTED", label: "Rejected" },
]

const COMPANY_TYPES = [
  { value: "all", label: "All Types" },
  { value: "STARTUP", label: "Startup" },
  { value: "PRIVATE", label: "Private" },
  { value: "PUBLIC_LISTED", label: "Public Listed" },
  { value: "GOVERNMENT", label: "Government" },
  { value: "NON_PROFIT", label: "Non-Profit" },
  { value: "EDUCATIONAL", label: "Educational" },
  { value: "SELF_EMPLOYED", label: "Self Employed" },
]

const INDUSTRY_TYPES = [
  { value: "all", label: "All Industries" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "FINANCE_BANKING", label: "Finance & Banking" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "EDUCATION", label: "Education" },
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "RETAIL_ECOMMERCE", label: "Retail & E-Commerce" },
  { value: "MEDIA_ENTERTAINMENT", label: "Media & Entertainment" },
  { value: "CONSULTING", label: "Consulting" },
  { value: "TELECOMMUNICATIONS", label: "Telecommunications" },
  { value: "PHARMACEUTICAL", label: "Pharmaceutical" },
  { value: "OTHER", label: "Other" },
]

export default function CompanyFilters({
  search,
  onSearch,
  onStatusFilter,
  onTypeFilter,
  onIndustryFilter,
  onRefresh,
  isLoading,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Search by name or slug..."
          className="pl-9 h-9 bg-white border-slate-200 text-sm rounded-lg"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Status filter */}
      <Select onValueChange={onStatusFilter} defaultValue="all">
        <SelectTrigger className="h-9 w-full sm:w-48 bg-white border-slate-200 text-sm rounded-lg">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          {COMPANY_STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type filter */}
      <Select onValueChange={onTypeFilter} defaultValue="all">
        <SelectTrigger className="h-9 w-full sm:w-40 bg-white border-slate-200 text-sm rounded-lg">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          {COMPANY_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Industry filter */}
      <Select onValueChange={onIndustryFilter} defaultValue="all">
        <SelectTrigger className="h-9 w-full sm:w-44 bg-white border-slate-200 text-sm rounded-lg">
          <SelectValue placeholder="All Industries" />
        </SelectTrigger>
        <SelectContent>
          {INDUSTRY_TYPES.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Right-side actions */}
      <div className="flex items-center gap-2 ml-auto">
        <Button
          variant="outline"
          size="sm"
          className="h-9 border-slate-200 text-slate-600 gap-1.5"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 border-slate-200 text-slate-600 gap-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </div>
    </div>
  )
}
