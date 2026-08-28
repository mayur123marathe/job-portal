import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, CheckCircle, Clock, XCircle, Download } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import JobFilters from "@/components/admin/jobs/JobFilters"
import JobTable from "@/components/admin/jobs/JobTable"
import { fetchAllJobsAdmin } from "@/store/job/jobThunk"

function fmtDate(dt) {
  if (!dt) return "—"
  return new Date(dt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function toTableRow(job) {
  return {
    id:           job.id,
    title:        job.title,
    company:      job.companyId ? `Company #${job.companyId}` : "—",
    location:     [job.city, job.country].filter(Boolean).join(", ") || "Remote",
    jobType:      job.jobType,
    status:       job.status,
    applications: job.applicationCount ?? 0,
    postedAt:     fmtDate(job.createdAt),
  }
}

function StatSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-0 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function AdminJobs() {
  const dispatch = useDispatch()
  const { adminJobs: jobs, adminJobsLoading: isLoading } = useSelector((s) => s.job)

  const [search, setSearch]           = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter]   = useState("all")

  useEffect(() => {
    dispatch(fetchAllJobsAdmin())
  }, [dispatch])

  const stats = useMemo(() => ({
    total:   jobs.length,
    open:    jobs.filter((j) => j.status === "OPEN").length,
    pending: jobs.filter((j) => j.status === "DRAFT").length,
    closed:  jobs.filter((j) => j.status === "CLOSED" || j.status === "EXPIRED" || j.status === "FILLED").length,
  }), [jobs])

  const summaryStats = [
    { label: "Total Jobs",       value: stats.total,   icon: Briefcase,   color: "text-brand bg-blue-50" },
    { label: "Open",             value: stats.open,    icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending / Draft",  value: stats.pending, icon: Clock,       color: "text-amber-600 bg-amber-50" },
    { label: "Closed / Expired", value: stats.closed,  icon: XCircle,     color: "text-slate-600 bg-slate-100" },
  ]

  const filtered = useMemo(() => {
    return jobs
      .filter((job) => {
        const matchesSearch =
          search === "" ||
          job.title.toLowerCase().includes(search.toLowerCase()) ||
          (job.companyId?.toString() || "").includes(search)
        const matchesStatus = statusFilter === "all" || job.status === statusFilter
        const matchesType   = typeFilter   === "all" || job.jobType === typeFilter
        return matchesSearch && matchesStatus && matchesType
      })
      .map(toTableRow)
  }, [jobs, search, statusFilter, typeFilter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">Monitor and manage all job postings</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-slate-200 text-slate-600 shadow-sm shrink-0"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary stats */}
      {isLoading ? (
        <StatSkeleton />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900 leading-tight">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Filters */}
      <JobFilters
        onSearch={setSearch}
        onStatusFilter={setStatusFilter}
        onTypeFilter={setTypeFilter}
      />

      {/* Table */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <JobTable jobs={filtered} />
      )}

      {/* Footer count */}
      {!isLoading && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing <span className="font-semibold text-slate-900">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-900">{jobs.length}</span> jobs
          </span>
        </div>
      )}
    </div>
  )
}
