import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Download } from "lucide-react"

export default function JobFilters({ onSearch, onStatusFilter, onTypeFilter }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Search jobs or companies..."
          className="pl-9 h-9 bg-white border-slate-200 text-sm rounded-lg"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Status */}
      <Select onValueChange={(val) => onStatusFilter?.(val)}>
        <SelectTrigger className="h-9 w-full sm:w-36 bg-white border-slate-200 text-sm rounded-lg">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="OPEN">Open</SelectItem>
          <SelectItem value="DRAFT">Draft</SelectItem>
          <SelectItem value="CLOSED">Closed</SelectItem>
          <SelectItem value="EXPIRED">Expired</SelectItem>
          <SelectItem value="FILLED">Filled</SelectItem>
        </SelectContent>
      </Select>

      {/* Type */}
      <Select onValueChange={(val) => onTypeFilter?.(val)}>
        <SelectTrigger className="h-9 w-full sm:w-40 bg-white border-slate-200 text-sm rounded-lg">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="FULL_TIME">Full Time</SelectItem>
          <SelectItem value="PART_TIME">Part Time</SelectItem>
          <SelectItem value="CONTRACT">Contract</SelectItem>
          <SelectItem value="INTERNSHIP">Internship</SelectItem>
          <SelectItem value="REMOTE">Remote</SelectItem>
          <SelectItem value="FREELANCE">Freelance</SelectItem>
        </SelectContent>
      </Select>

      {/* Export */}
      <Button
        variant="outline"
        size="sm"
        className="h-9 border-slate-200 text-slate-600 gap-1.5 ml-auto"
      >
        <Download className="h-3.5 w-3.5" />
        Export CSV
      </Button>
    </div>
  )
}
