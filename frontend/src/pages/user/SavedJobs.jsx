import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bookmark, BriefcaseBusiness } from "lucide-react"
import { fetchMySavedJobs, unsaveJob } from "@/store/savedJob/savedJobThunk"
import { toast } from "sonner"
import SavedJobCard from "@/components/user/savedJobs/SavedJobCard"

export default function SavedJobs() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { savedJobs, isLoading, isActionLoading } = useSelector((s) => s.savedJob)
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    dispatch(fetchMySavedJobs())
  }, [dispatch])

  const handleUnsave = async (savedJobId) => {
    setRemovingId(savedJobId)
    const result = await dispatch(unsaveJob(savedJobId))
    setRemovingId(null)
    if (!result.error) toast.success("Job removed from saved list")
    else toast.error(result.payload)
  }

  console.log("saved jobs",savedJobs)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Jobs</h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading ? "Loading..." : `${savedJobs.length} job${savedJobs.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/jobs")} className="gap-2">
          <BriefcaseBusiness className="h-4 w-4" />
          Browse Jobs
        </Button>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && savedJobs.length === 0 && (
        <div className="text-center py-20">
          <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">No saved jobs yet</h2>
          <p className="text-sm text-slate-500 mb-6">
            Click the bookmark icon on any job to save it for later.
          </p>
          <Button onClick={() => navigate("/jobs")}>Browse Jobs</Button>
        </div>
      )}

      {/* Job list */}
      {!isLoading && savedJobs.length > 0 && (
        <div className="space-y-4">
          {savedJobs.map((sj) => (
            <SavedJobCard
              key={sj.id}
              savedJob={sj}
              onUnsave={handleUnsave}
              unsaving={removingId === sj.id || isActionLoading}
            />
          ))}
        </div>
      )}

    </div>
  )
}
