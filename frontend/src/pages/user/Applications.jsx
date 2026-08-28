import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, CheckCircle2, FileText, TrendingUp, Users } from "lucide-react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { fetchMyApplications, withdrawApplication } from "@/store/application/applicationThunk"
import ApplicationCard from "@/components/user/applications/ApplicationCard"

const TAB_STATUSES = {
  active:      ["PENDING", "REVIEWING", "SHORTLISTED", "INTERVIEW_SCHEDULED"],
  shortlisted: ["SHORTLISTED", "INTERVIEW_SCHEDULED"],
  hired:       ["HIRED"],
  rejected:    ["REJECTED", "WITHDRAWN"],
}


function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-5 flex gap-4">
            <Skeleton className="h-11 w-11 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-1.5 w-full rounded-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  const Ico = icon
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
          <Ico className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900">{value}</p>
          <p className="text-xs text-slate-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function Applications() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { myApplications: apps, isLoading, isActionLoading, error } = useSelector((s) => s.application)

  const [selectedTab, setSelectedTab] = useState("all")
  const [withdrawTarget, setWithdrawTarget] = useState(null)

  useEffect(() => {
    dispatch(fetchMyApplications())
  }, [dispatch])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  const stats = {
    total:       apps.length,
    active:      apps.filter((a) => TAB_STATUSES.active.includes(a.status)).length,
    shortlisted: apps.filter((a) => TAB_STATUSES.shortlisted.includes(a.status)).length,
    hired:       apps.filter((a) => a.status === "HIRED").length,
  }

  const filtered =
    selectedTab === "all"
      ? apps
      : TAB_STATUSES[selectedTab]
        ? apps.filter((a) => TAB_STATUSES[selectedTab].includes(a.status))
        : apps

  const handleWithdrawConfirm = () => {
    if (!withdrawTarget) return
    dispatch(withdrawApplication({ id: withdrawTarget.id, reason: "Candidate withdrew" })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success("Application withdrawn")
        setWithdrawTarget(null)
      }
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-brand" />
          My Applications
        </h1>
        <p className="text-slate-500 text-sm mt-1">Track and manage your job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Applied"   value={stats.total}       icon={Briefcase}    color="text-brand bg-blue-50" />
        <StatCard label="Active"          value={stats.active}      icon={TrendingUp}   color="text-indigo-600 bg-indigo-50" />
        <StatCard label="Shortlisted"     value={stats.shortlisted} icon={CheckCircle2} color="text-purple-600 bg-purple-50" />
        <StatCard label="Hired"           value={stats.hired}       icon={Users}        color="text-green-600 bg-green-50" />
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="all">All ({apps.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({stats.shortlisted})</TabsTrigger>
          <TabsTrigger value="hired">Hired ({stats.hired})</TabsTrigger>
          <TabsTrigger value="rejected">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-3 mt-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : filtered.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="font-medium text-slate-600">No applications found</p>
                <p className="text-sm text-slate-400 mt-1">
                  {selectedTab === "all"
                    ? "You haven't applied to any jobs yet."
                    : "No applications in this category."}
                </p>
                {selectedTab === "all" && (
                  <Button className="mt-4 bg-brand hover:bg-brand/90" onClick={() => navigate("/jobs")}>
                    Browse Jobs
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filtered.map((app) => (
              <ApplicationCard key={app.id} app={app} onWithdraw={setWithdrawTarget} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Withdraw confirmation */}
      <AlertDialog open={!!withdrawTarget} onOpenChange={(o) => { if (!o) setWithdrawTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Application?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw your application for{" "}
              <span className="font-semibold">Job #{withdrawTarget?.jobId}</span>?
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdrawConfirm}
              disabled={isActionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isActionLoading ? "Withdrawing…" : "Withdraw"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
