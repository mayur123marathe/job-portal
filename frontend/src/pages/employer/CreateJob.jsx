import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import JobForm from "@/components/employer/jobs/JobForm"

export default function CreateJob() {
  return (
    <div className="space-y-5">
      {/* Back + heading */}
      <div>
        <Link
          to="/employer/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-3 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Post a New Job</h1>
        <p className="text-sm text-slate-500 mt-1">
          Fill in the details below. You can save a draft and publish later.
        </p>
      </div>

      <JobForm />
    </div>
  )
}
