import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StatsCard from "@/components/employer/dashboard/StatsCard"
import RecentApplicationsTable from "@/components/employer/dashboard/RecentApplicationsTable"
import ActiveJobsList from "@/components/employer/dashboard/ActiveJobsList"
import { Briefcase, FileText, Users, UserCheck, PlusCircle, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { fetchMyJobs } from "@/store/job/jobThunk"
import { fetchCompanyApplications } from "@/store/application/applicationThunk"

export default function Dashboard() {
  const dispatch = useDispatch()
  const { myJobs, isLoading: jobsLoading } = useSelector((state) => state.job)
  const { applications, isLoading: appsLoading } = useSelector((state) => state.application)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchMyJobs())
    dispatch(fetchCompanyApplications({ filters: {} }))
  }, [dispatch])

  const totalJobs        = myJobs.length
  const activeJobs       = myJobs.filter((j) => j.status === "OPEN").length
  const totalApps        = applications.length
  const shortlisted      = applications.filter(
    (a) => a.status === "SHORTLISTED" || a.status === "INTERVIEW_SCHEDULED"
  ).length

  const stats = [
    {
      title: "Total Jobs Posted",
      value: jobsLoading ? "…" : totalJobs.toString(),
      icon: Briefcase,
      loading: jobsLoading,
    },
    {
      title: "Active Jobs",
      value: jobsLoading ? "…" : activeJobs.toString(),
      icon: TrendingUp,
      loading: jobsLoading,
    },
    {
      title: "Applications Received",
      value: appsLoading ? "…" : totalApps.toString(),
      icon: FileText,
      loading: appsLoading,
    },
    {
      title: "Shortlisted / Interview",
      value: appsLoading ? "…" : shortlisted.toString(),
      icon: UserCheck,
      loading: appsLoading,
    },
  ]
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back! Here's an overview of your hiring activity.
          </p>
        </div>
        <Link to="/employer/jobs/create">
          <Button size="lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Job
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* AI Insights Card */}
      <Card className="bg-linear-to-br from-brand/5 to-brand/10 border-brand/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <Users className="h-4 w-4" />
            </div>
            AI Screening Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-2 w-2 rounded-full bg-brand mt-2" />
              <div>
                <p className="font-medium text-slate-900">
                  15 candidates auto-shortlisted today
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Based on AI analysis, these candidates match 90%+ of your job requirements
                  for Senior React Developer position.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-2 w-2 rounded-full bg-green-600 mt-2" />
              <div>
                <p className="font-medium text-slate-900">
                  3 high-potential candidates need review
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  These candidates have exceptional skills but limited experience. Worth
                  considering for junior roles.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-2 w-2 rounded-full bg-amber-600 mt-2" />
              <div>
                <p className="font-medium text-slate-900">Suggestion: Update job description</p>
                <p className="text-sm text-slate-600 mt-1">
                  Your DevOps Engineer posting has low application rate. Consider adjusting
                  salary range or requirements.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-brand/20">
            <Link to="/employer/ai-screening">
              <Button variant="outline" className="border-brand/30 hover:bg-brand/10">
                View AI Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      <RecentApplicationsTable />

      {/* Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveJobsList />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/employer/jobs/create" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                      <PlusCircle className="h-5 w-5 text-brand" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Post a New Job</p>
                      <p className="text-xs text-slate-500">
                        Create and publish a new job listing
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/employer/applications" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Review Applications</p>
                      <p className="text-xs text-slate-500">
                        24 new applications waiting for review
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/employer/candidates" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Browse Candidates</p>
                      <p className="text-xs text-slate-500">
                        Search through candidate database
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
