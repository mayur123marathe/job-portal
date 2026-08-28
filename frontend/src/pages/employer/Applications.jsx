import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  Search, Star, Eye, Clock, Briefcase,
  Filter, Mail, ScrollText, Loader2, Users, Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { fetchCompanyApplications, fetchApplicationById, toggleStar, markAsRead } from "@/store/application/applicationThunk"
import { fetchMyCompany } from "@/store/company/companyThunk"
import { fetchMyJobs } from "@/store/job/jobThunk"
import { summarizeNotes } from "@/store/ai/aiThunk"
import { clearNotesSummary } from "@/store/ai/aiSlice"
import UpdateStatusDialog from "@/components/employer/applications/UpdateStatusDialog"
import ApplicationsTable from "@/components/employer/applications/ApplicationsTable"
import { cn } from "@/lib/utils"

// ── Config ─────────────────────────────────────────────────────────────────────

const STATUS_FILTERS = ["ALL", "PENDING", "REVIEWING", "SHORTLISTED", "INTERVIEW_SCHEDULED", "HIRED", "REJECTED"]

const AI_SHORTLIST_FILTERS = [
  { value: "ALL",                label: "All" },
  { value: "AUTO_SHORTLISTED",   label: "Auto Shortlisted" },
  { value: "REVIEW_RECOMMENDED", label: "Review Recommended" },
  { value: "PENDING_REVIEW",     label: "Pending Review" },
  { value: "LOW_MATCH",          label: "Low Match" },
  { value: "NOT_SCREENED",       label: "Not Screened" },
]

function fmt(val) {
  return (val || "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}


function StatCard({ label, value, icon: Icon, color, subLabel }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
        {subLabel && <p className="text-xs text-slate-400 mt-0.5">{subLabel}</p>}
      </div>
    </div>
  )
}


// ── Main page ──────────────────────────────────────────────────────────────────

export default function Applications() {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()

  const { applications, isLoading, isActionLoading } = useSelector(s => s.application)
  const { myCompany } = useSelector(s => s.company)
  const { myJobs }    = useSelector(s => s.job)
  const { notesSummary, isSummarizingNotes } = useSelector(s => s.ai)

  // Filters
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatus]   = useState("ALL")
  const [jobFilter, setJobFilter]   = useState("")
  const [starredOnly, setStarred]         = useState(false)
  const [unreadOnly, setUnread]           = useState(false)
  const [aiFilter, setAiFilter]           = useState("ALL")
  const [sortBy, setSortBy]               = useState("DEFAULT")

  // Dialog state
  const [statusDialog, setStatusDialog]   = useState(null)           // { id, currentStatus }
  const [notesDialogOpen, setNotesDialog] = useState(false)

  // ── Bootstrap ────────────────────────────────────────────────────────────────
  useEffect(() => {
     dispatch(fetchMyCompany())
    dispatch(fetchMyJobs())
  }, [])

  useEffect(() => {
    if (myCompany?.id) {
      const filters = {}
      if (jobFilter) filters.jobId = jobFilter
      if (statusFilter !== "ALL") filters.status = statusFilter
      if (starredOnly) filters.isStarred = true
      if (unreadOnly)  filters.isRead    = false
      if (aiFilter !== "ALL") filters.aiShortlistStatus = aiFilter
      if (sortBy !== "DEFAULT") filters.sortBy = sortBy
      dispatch(fetchCompanyApplications({ filters }))
    }
  }, [myCompany, statusFilter, jobFilter, starredOnly, unreadOnly, aiFilter, sortBy])


  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:          applications.length,
    pending:        applications.filter(a => a.status === "PENDING").length,
    shortlisted:    applications.filter(a => a.status === "SHORTLISTED").length,
    unread:         applications.filter(a => !a.isRead).length,
    autoShortlisted: applications.filter(a => a.aiShortlistStatus === "AUTO_SHORTLISTED").length,
  }), [applications])

  // ── Client-side search ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return applications
    const q = search.toLowerCase()
    return applications.filter(a =>
      (a.candidate?.fullName || "").toLowerCase().includes(q) ||
      (a.candidate?.email || "").toLowerCase().includes(q) ||
      (a.job?.title || "").toLowerCase().includes(q)
    )
  }, [applications, search])

  // ── Actions ───────────────────────────────────────────────────────────────────
  const handleToggleStar = (e, id) => {
    e.stopPropagation()
    dispatch(toggleStar(id)).unwrap().catch(err => toast.error(err))
  }

  const handleMarkRead = (id) => {
    dispatch(markAsRead(id)).unwrap().catch(err => toast.error(err))
  }

  const handleAIScreen = (app) => {
    navigate(`/employer/applications/${app.id}/screening`)
  }

  const handleSummarizeNotes = async (appId) => {
    try {
      const fullApp = await dispatch(fetchApplicationById(appId)).unwrap()
      const notes = (fullApp.notes ?? []).map(n => n.content).filter(Boolean)
      if (notes.length === 0) {
        toast.info("No recruiter notes found for this application")
        return
      }
      dispatch(clearNotesSummary())
      await dispatch(summarizeNotes(notes)).unwrap()
      setNotesDialog(true)
    } catch {
      toast.error("Failed to load notes")
    }
  }

  // ── No company guard ──────────────────────────────────────────────────────────
  if (!isLoading && !myCompany) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 mb-4">
          <Briefcase className="h-7 w-7 text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Set up your company first</h2>
        <p className="text-sm text-slate-400 mt-1">You need a company profile to receive applications.</p>
        <Button className="mt-4 bg-brand hover:bg-brand/90" onClick={() => navigate("/employer/company")}>
          Go to Company Profile
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
        <p className="text-sm text-slate-500 mt-1">Review and manage all candidate applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total"            value={stats.total}           icon={Users}        color="bg-blue-50 text-brand" />
        <StatCard label="Pending"          value={stats.pending}         icon={Clock}        color="bg-amber-50 text-amber-600" />
        <StatCard label="Auto Shortlisted" value={stats.autoShortlisted} icon={Sparkles}     color="bg-green-50 text-green-600"
          subLabel="AI score ≥ 90" />
        <StatCard label="Unread"           value={stats.unread}          icon={Mail}         color="bg-red-50 text-red-500"
          subLabel={stats.unread > 0 ? "need attention" : "all caught up"} />
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        {/* Row 1: search + job select + AI shortlist + sort — all in one line */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by candidate name or job title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 border-slate-200"
            />
          </div>
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="border-slate-200 text-sm w-full sm:w-48">
              <Filter className="h-3.5 w-3.5 mr-2 text-slate-400" />
              <SelectValue placeholder="All Jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              {myJobs.map(j => (
                <SelectItem key={j.id} value={String(j.id)}>{j.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={aiFilter} onValueChange={setAiFilter}>
            <SelectTrigger className="border-slate-200 text-sm w-full sm:w-48">
              <Sparkles className="h-3.5 w-3.5 mr-2 text-brand" />
              <SelectValue placeholder="AI Shortlist" />
            </SelectTrigger>
            <SelectContent>
              {AI_SHORTLIST_FILTERS.map(f => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-slate-200 text-sm w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEFAULT">Newest First</SelectItem>
              <SelectItem value="AI_SCORE_DESC">AI Score: High to Low</SelectItem>
              <SelectItem value="AI_SCORE_ASC">AI Score: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row 2: status tabs + toggles */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1.5 flex-wrap flex-1">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === s
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s === "ALL" ? "All" : fmt(s)}
              </button>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setStarred(!starredOnly)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors",
                starredOnly ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              <Star className="h-3.5 w-3.5" /> Starred
            </button>
            <button
              onClick={() => setUnread(!unreadOnly)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors",
                unreadOnly ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              <Eye className="h-3.5 w-3.5" /> Unread
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <ApplicationsTable
          applications={filtered}
          isLoading={isLoading}
          emptyTitle={applications.length === 0 ? "No applications yet" : "No results match your filters"}
          emptySubtitle={applications.length === 0 ? "Applications will appear here once candidates apply to your jobs." : "Try adjusting your search or filter criteria."}
          onRowClick={(app) => navigate(`/employer/applications/${app.id}`)}
          onToggleStar={handleToggleStar}
          onUpdateStatus={(app) => setStatusDialog({ id: app.id, currentStatus: app.status })}
          onAIScreen={handleAIScreen}
          onSummarizeNotes={handleSummarizeNotes}
          onMarkRead={handleMarkRead}
          isActionLoading={isActionLoading}
        />
      </div>

      {/* Update Status Dialog */}
      {statusDialog && (
        <UpdateStatusDialog
          open={!!statusDialog}
          onClose={() => setStatusDialog(null)}
          applicationId={statusDialog.id}
          currentStatus={statusDialog.currentStatus}
        />
      )}

      {/* Notes Summary Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={o => { if (!o) { setNotesDialog(false); dispatch(clearNotesSummary()) } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
              <ScrollText className="h-4 w-4 text-indigo-600" />
              Notes Summary (TL;DR)
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            {isSummarizingNotes ? (
              <div className="flex items-center gap-2 py-8 justify-center text-sm text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
                Summarizing recruiter notes...
              </div>
            ) : notesSummary?.content ? (
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-4 border border-slate-200 whitespace-pre-line leading-relaxed">
                {notesSummary.content}
              </p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
