import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import {
  PlusCircle, Search, Briefcase, Eye, Edit2, Send,
  XCircle, Trash2, MoreHorizontal, MapPin, Users,
  Clock, TrendingUp, Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchMyJobs, publishJob, closeJob, deleteJob } from "@/store/job/jobThunk"

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  OPEN:    { label: "Open",    className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  DRAFT:   { label: "Draft",   className: "bg-amber-50 text-amber-700 border-amber-200" },
  CLOSED:  { label: "Closed",  className: "bg-slate-100 text-slate-600 border-slate-200" },
  EXPIRED: { label: "Expired", className: "bg-red-50 text-red-600 border-red-200" },
  FILLED:  { label: "Filled",  className: "bg-blue-50 text-blue-700 border-blue-200" },
}

const STATUS_FILTERS = ["ALL", "OPEN", "DRAFT", "CLOSED", "EXPIRED", "FILLED"]

function fmt(val) {
  return val.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function fmtDate(dt) {
  if (!dt) return "—"
  return new Date(dt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function fmtSalary(job) {
  if (job.salaryDisclosed === false) return "Competitive"
  if (!job.minSalary && !job.maxSalary) return "—"
  const cur = job.currency || "USD"
  const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n)
  if (job.minSalary && job.maxSalary) return `${fmt(job.minSalary)} – ${fmt(job.maxSalary)}`
  return fmt(job.minSalary || job.maxSalary)
}

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className={`rounded-xl border p-4 bg-white shadow-sm flex items-center gap-3`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  )
}

// ── Skeleton rows ──────────────────────────────────────────────────────────────

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 7 }).map((_, j) => (
        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
      ))}
    </TableRow>
  ))
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Jobs() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { myJobs, isLoading, isActionLoading } = useSelector(s => s.job)

  const [search, setSearch]           = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    dispatch(fetchMyJobs())
  }, [dispatch])

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total:   myJobs.length,
    open:    myJobs.filter(j => j.status === "OPEN").length,
    draft:   myJobs.filter(j => j.status === "DRAFT").length,
    closed:  myJobs.filter(j => j.status === "CLOSED" || j.status === "EXPIRED").length,
    appTotal: myJobs.reduce((acc, j) => acc + (j.applicationCount || 0), 0),
  }), [myJobs])

  // ── Filtered list ──────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return myJobs.filter(j => {
      const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
        (j.categoryName || "").toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === "ALL" || j.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [myJobs, search, statusFilter])

  // ── Actions ────────────────────────────────────────────────────────────────

  const handlePublish = (id) => {
    dispatch(publishJob(id)).unwrap()
      .then(() => toast.success("Job published!"))
      .catch(err => toast.error(err))
  }

  const handleClose = (id) => {
    dispatch(closeJob(id)).unwrap()
      .then(() => toast.success("Job closed"))
      .catch(err => toast.error(err))
  }

  const handleDelete = () => {
    dispatch(deleteJob(deleteTarget)).unwrap()
      .then(() => { toast.success("Job deleted"); setDeleteTarget(null) })
      .catch(err => { toast.error(err); setDeleteTarget(null) })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Postings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your job listings in one place</p>
        </div>
        <Link to="/employer/jobs/create">
          <Button className="gap-2 bg-brand hover:bg-brand/90 shrink-0">
            <PlusCircle className="h-4 w-4" /> Post a Job
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Jobs"      value={stats.total}    icon={Briefcase}   color="bg-blue-50 text-brand" />
        <StatCard label="Active (Open)"   value={stats.open}     icon={TrendingUp}  color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Drafts"          value={stats.draft}    icon={Clock}       color="bg-amber-50 text-amber-600" />
        <StatCard label="Total Applicants" value={stats.appTotal} icon={Users}      color="bg-violet-50 text-violet-600" />
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by title or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 border-slate-200"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s === "ALL" ? "All" : fmt(s)}
                {s !== "ALL" && (
                  <span className="ml-1.5 opacity-70">
                    {myJobs.filter(j => j.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold text-slate-700">Job Title</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
              <TableHead className="font-semibold text-slate-700">Type / Mode</TableHead>
              <TableHead className="font-semibold text-slate-700">Location</TableHead>
              <TableHead className="font-semibold text-slate-700 text-right">Applicants</TableHead>
              <TableHead className="font-semibold text-slate-700">Deadline</TableHead>
              <TableHead className="font-semibold text-slate-700">Posted</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonRows />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
                      <Briefcase className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">
                      {myJobs.length === 0 ? "No jobs posted yet" : "No jobs match your filter"}
                    </p>
                    {myJobs.length === 0 && (
                      <Link to="/employer/jobs/create">
                        <Button size="sm" className="mt-3 bg-brand hover:bg-brand/90 gap-1.5">
                          <PlusCircle className="h-4 w-4" /> Post your first job
                        </Button>
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(job => {
                const sCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.DRAFT
                const location = [job.city, job.country].filter(Boolean).join(", ")
                return (
                  <TableRow key={job.id} className="hover:bg-slate-50/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{job.title}</p>
                        {job.categoryName && (
                          <p className="text-xs text-slate-400 mt-0.5">{job.categoryName}</p>
                        )}
                        {job.skillNames?.length > 0 && (
                          <div className="flex gap-1 flex-wrap mt-1">
                            {job.skillNames.slice(0, 3).map(s => (
                              <span key={s} className="text-xs bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">{s}</span>
                            ))}
                            {job.skillNames.length > 3 && (
                              <span className="text-xs text-slate-400">+{job.skillNames.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs font-semibold ${sCfg.className}`}>
                        {sCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <span className="text-xs bg-blue-50 text-blue-700 rounded px-1.5 py-0.5 font-medium">
                          {fmt(job.jobType || "")}
                        </span>
                        <br />
                        <span className="text-xs bg-indigo-50 text-indigo-700 rounded px-1.5 py-0.5 font-medium">
                          {fmt(job.workMode || "")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {location ? (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {location}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800 text-sm">
                          {job.applicationCount ?? 0}
                        </span>
                        {job.openings > 1 && (
                          <span className="text-xs text-slate-400">/ {job.openings}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {fmtDate(job.applicationDeadline)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400">
                      {fmtDate(job.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => navigate(`/employer/jobs/${job.id}/edit`)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          {job.status === "DRAFT" && (
                            <DropdownMenuItem
                              className="text-emerald-600"
                              onClick={() => handlePublish(job.id)}
                              disabled={isActionLoading}
                            >
                              <Send className="mr-2 h-4 w-4" /> Publish
                            </DropdownMenuItem>
                          )}
                          {job.status === "OPEN" && (
                            <DropdownMenuItem
                              className="text-orange-600"
                              onClick={() => handleClose(job.id)}
                              disabled={isActionLoading}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Close
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-700 focus:bg-red-50"
                            onClick={() => setDeleteTarget(job.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The job posting and all associated data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isActionLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
