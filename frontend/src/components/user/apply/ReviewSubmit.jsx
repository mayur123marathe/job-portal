import { CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ReviewSubmit({ resume, resumes, coverLetter, expectedSalary, availableFrom, job }) {
  const selectedResumeTitle = resumes.find((r) => r.id.toString() === resume)?.title ?? `Resume #${resume}`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Your Application</h2>
        <p className="text-slate-600">Please review all information before submitting</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Position</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-slate-600">Job Title:</span>
              <span className="font-medium text-slate-900">{job?.title}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-slate-600">Company:</span>
              <span className="font-medium text-slate-900 flex items-center gap-1">
                {job?.company?.name ?? `Company #${job?.companyId}`}
                {job?.company?.verified && (
                  <CheckCircle2 className="h-3.5 w-3.5 fill-blue-500 text-white shrink-0" />
                )}
              </span>
            </p>
            {job?.city && (
              <p className="flex items-center justify-between">
                <span className="text-slate-600">Location:</span>
                <span className="font-medium text-slate-900">
                  {[job.city, job.state, job.country].filter(Boolean).join(", ")}
                </span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Resume</h3>
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-900">{selectedResumeTitle}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Cover Letter</h3>
          <div className="p-4 bg-slate-50 rounded-lg max-h-48 overflow-y-auto">
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {coverLetter || "No cover letter provided"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Additional Details</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-slate-600">Expected Salary:</span>
              <span className="font-medium text-slate-900">
                {expectedSalary ? `₹ ${Number(expectedSalary).toLocaleString("en-IN")}` : "Not specified"}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-slate-600">Available From:</span>
              <span className="font-medium text-slate-900">
                {availableFrom
                  ? availableFrom.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })
                  : "Immediately"}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
