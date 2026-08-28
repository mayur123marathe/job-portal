import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, ArrowRight, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { closeJob } from "@/store/job/jobThunk"

const statusConfig = {
  OPEN: { label: "Open", variant: "success" },
  CLOSED: { label: "Closed", variant: "secondary" },
  DRAFT: { label: "Draft", variant: "outline" },
}

const getTimeAgo = (date) => {
  const now = new Date()
  const createdDate = new Date(date)
  const diffInMs = now - createdDate
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "1 day ago"
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`
  return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`
}

export default function ActiveJobsList() {
  const dispatch = useDispatch()
  const { myJobs } = useSelector((state) => state.job)
  const { applications } = useSelector((state) => state.application)

  // Get only active (OPEN) jobs and limit to 4
  const activeJobs = myJobs.filter((job) => job.status === "OPEN").slice(0, 4)

  const handleCloseJob = (jobId) => {
    dispatch(closeJob(jobId))
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active Jobs</CardTitle>
        <Link to="/employer/jobs">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeJobs.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No active jobs</p>
              <Link to="/employer/jobs/create">
                <Button variant="link" className="mt-2">
                  Create your first job
                </Button>
              </Link>
            </div>
          ) : (
            activeJobs.map((job) => {
              const status = statusConfig[job.status]
              return (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900">{job.title}</h4>
                      <Badge variant={status.variant} className="text-xs">
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{[job.city, job.country].filter(Boolean).join(", ") || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{getTimeAgo(job.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {applications.filter((a) => a.jobId === job.id).length} applications
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Link to={`/employer/jobs/${job.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Job</DropdownMenuItem>
                      <DropdownMenuItem>View Applications</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleCloseJob(job.id)}
                      >
                        Close Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
