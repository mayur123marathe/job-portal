import { useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { fetchJobById } from "@/store/job/jobThunk"
import { clearCurrentJob } from "@/store/job/jobSlice"
import JobForm from "@/components/employer/jobs/JobForm"

export default function EditJob() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentJob, isLoading, error } = useSelector(s => s.job)

  useEffect(() => {
    dispatch(fetchJobById(Number(id)))
    return () => { dispatch(clearCurrentJob()) }
  }, [id, dispatch])

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || (!isLoading && !currentJob)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Job not found</h2>
        <p className="text-sm text-slate-400 mt-1">{error || "This job doesn't exist or you don't have access."}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/employer/jobs")}>
          Back to Jobs
        </Button>
      </div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/employer/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-3 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Job</h1>
            <p className="text-sm text-slate-500 mt-1">
              Editing: <span className="font-medium text-slate-700">{currentJob.title}</span>
            </p>
          </div>
        </div>
      </div>

      <JobForm initialJob={currentJob} isEdit />
    </div>
  )
}
