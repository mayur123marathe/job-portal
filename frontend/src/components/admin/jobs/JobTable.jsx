import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, CheckCircle, XCircle, Trash2, MapPin, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig = {
  OPEN: { label: "Open", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  DRAFT: { label: "Draft", className: "bg-slate-100 text-slate-600 border-slate-200" },
  CLOSED: { label: "Closed", className: "bg-slate-100 text-slate-500 border-slate-200" },
  EXPIRED: { label: "Expired", className: "bg-red-50 text-red-600 border-red-200" },
  FILLED: { label: "Filled", className: "bg-blue-50 text-blue-700 border-blue-200" },
}

const typeConfig = {
  FULL_TIME: { label: "Full Time", className: "bg-indigo-50 text-indigo-700" },
  PART_TIME: { label: "Part Time", className: "bg-cyan-50 text-cyan-700" },
  CONTRACT: { label: "Contract", className: "bg-amber-50 text-amber-700" },
  INTERNSHIP: { label: "Internship", className: "bg-violet-50 text-violet-700" },
  REMOTE: { label: "Remote", className: "bg-teal-50 text-teal-700" },
  FREELANCE: { label: "Freelance", className: "bg-orange-50 text-orange-700" },
}

export default function JobTable({ jobs }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-slate-400 text-sm">No jobs match your filters.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-200">
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-10 pl-6">
              #
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Job Title
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Company
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Type
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
              Apps
            </TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Posted
            </TableHead>
            <TableHead className="w-12 pr-4" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job, index) => {
            const status = statusConfig[job.status] || statusConfig.DRAFT
            const type = typeConfig[job.jobType] || typeConfig.FULL_TIME

            return (
              <TableRow key={job.id} className="group hover:bg-slate-50/50 border-slate-100">
                <TableCell className="text-sm text-slate-400 font-medium pl-6">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{job.title}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <p className="text-xs text-slate-400 truncate max-w-[160px]">{job.location}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium text-slate-700">{job.company}</p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn("text-xs font-semibold px-2 py-0.5", type.className)}
                  >
                    {type.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-semibold px-2 py-0.5 border", status.className)}
                  >
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-sm font-bold text-slate-900">{job.applications}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-400">{job.postedAt}</span>
                </TableCell>
                <TableCell className="pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuLabel className="text-xs text-slate-500 font-normal">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Eye className="h-3.5 w-3.5 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50">
                        <CheckCircle className="h-3.5 w-3.5 mr-2" /> Approve Job
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Flag className="h-3.5 w-3.5 mr-2" /> Flag for Review
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-amber-600 focus:text-amber-600 focus:bg-amber-50">
                        <XCircle className="h-3.5 w-3.5 mr-2" /> Close Job
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
