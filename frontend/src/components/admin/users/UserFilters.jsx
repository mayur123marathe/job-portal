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

export default function UserFilters({ onSearch, onRoleFilter, onStatusFilter }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9 h-9 bg-white border-slate-200 text-sm rounded-lg"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      {/* Role */}
      <Select onValueChange={(val) => onRoleFilter?.(val)}>
        <SelectTrigger className="h-9 w-full sm:w-40 bg-white border-slate-200 text-sm rounded-lg">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="ROLE_JOB_SEEKER">Job Seekers</SelectItem>
          <SelectItem value="ROLE_EMPLOYER">Employers</SelectItem>
          <SelectItem value="ROLE_ADMIN">Admins</SelectItem>
        </SelectContent>
      </Select>

      {/* Status */}
      <Select onValueChange={(val) => onStatusFilter?.(val)}>
        <SelectTrigger className="h-9 w-full sm:w-40 bg-white border-slate-200 text-sm rounded-lg">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="SUSPENDED">Suspended</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
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
