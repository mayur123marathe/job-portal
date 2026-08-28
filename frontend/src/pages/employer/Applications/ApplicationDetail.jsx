import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import {
  ArrowLeft, Star, Eye, Calendar, FileText, Trash2,
  Plus, Send, Clock, CheckCircle2, XCircle, AlertCircle,
  Download, ChevronRight, Loader2, Video, Phone, Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchApplicationById } from "@/store/application/applicationThunk"
import { toggleStar, markAsRead, addNote, deleteNote } from "@/store/application/applicationThunk"
import { clearCurrentApplication } from "@/store/application/applicationSlice"
import UpdateStatusDialog from "@/components/employer/applications/UpdateStatusDialog"
import ScheduleInterviewDialog from "@/components/employer/applications/ScheduleInterviewDialog"
import { cn } from "@/lib/utils"

// ── Status config ──────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING:             { label: "Pending",            className: "bg-slate-100 text-slate-600 border-slate-200",     icon: Clock },
  REVIEWING:           { label: "Reviewing",          className: "bg-blue-50 text-blue-700 border-blue-200",         icon: Eye },
  SHORTLISTED:         { label: "Shortlisted",        className: "bg-indigo-50 text-indigo-700 border-indigo-200",   icon: CheckCircle2 },
  INTERVIEW_SCHEDULED: { label: "Interview",          className: "bg-violet-50 text-violet-700 border-violet-200",   icon: Calendar },
  REJECTED:            { label: "Rejected",           className: "bg-red-50 text-red-600 border-red-200",            icon: XCircle },
  HIRED:               { label: "Hired",              className: "bg-emerald-50 text-emerald-700 border-emerald-200",icon: CheckCircle2 },
  WITHDRAWN:           { label: "Withdrawn",          className: "bg-orange-50 text-orange-600 border-orange-200",   icon: XCircle },
}

const INTERVIEW_TYPE_ICON = {
  PHONE_SCREENING: Phone,
  VIDEO_CALL: Video,
  IN_PERSON: Users,
  TECHNICAL: FileText,
  HR: Users,
  PANEL: Users,
}

function fmt(val) {
  return (val || "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}
function fmtDate(dt) {
  if (!dt) return "—"
  return new Date(dt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}
function fmtDateTime(dt) {
  if (!dt) return "—"
  return new Date(dt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

// ── Status timeline ────────────────────────────────────────────────────────────

function StatusTimeline({ history }) {
  if (!history?.length) return <p className="text-sm text-slate-400">No status history yet.</p>
  return (
    <div className="relative space-y-0">
      {[...history].reverse().map((h, i) => (
        <div key={h.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            {i < history.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-slate-800">
              {h.fromStatus ? `${fmt(h.fromStatus)} → ${fmt(h.toStatus)}` : fmt(h.toStatus)}
            </p>
            {h.note && <p className="text-xs text-slate-500 mt-0.5 italic">"{h.note}"</p>}
            <p className="text-xs text-slate-400 mt-0.5">{fmtDateTime(h.changedAt)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}



// ── Notes section ──────────────────────────────────────────────────────────────

function NotesSection({ notes, applicationId }) {
  const dispatch = useDispatch()
  const isActionLoading = useSelector(s => s.application.isActionLoading)
  const [content, setContent] = useState("")
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleAdd = () => {
    if (!content.trim()) return
    dispatch(addNote({ applicationId, content: content.trim() }))
      .unwrap()
      .then(() => { toast.success("Note added"); setContent("") })
      .catch(err => toast.error(err))
  }

  const handleDelete = () => {
    dispatch(deleteNote({ applicationId, noteId: deleteTarget }))
      .unwrap()
      .then(() => { toast.success("Note deleted"); setDeleteTarget(null) })
      .catch(err => { toast.error(err); setDeleteTarget(null) })
  }

  return (
    <>
      <div className="space-y-3">
        {/* Add note */}
        <div className="space-y-2">
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Add an internal note... (visible only to your team)"
            rows={2}
            className="border-slate-200 resize-none text-sm"
          />
          <Button
            size="sm"
            className="gap-1.5 bg-brand hover:bg-brand/90"
            onClick={handleAdd}
            disabled={isActionLoading || !content.trim()}
          >
            {isActionLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            Add Note
          </Button>
        </div>

        {/* Note list */}
        {!notes?.length ? (
          <p className="text-xs text-slate-400 text-center py-4">No notes yet. Add internal comments about this candidate.</p>
        ) : (
          <div className="space-y-2.5 mt-2">
            {notes.map(note => (
              <div key={note.id} className="rounded-lg bg-amber-50 border border-amber-100 p-3 group">
                <p className="text-sm text-slate-700">{note.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">{fmtDateTime(note.createdAt)}</p>
                  <button
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                    onClick={() => setDeleteTarget(note.id)}
                    disabled={isActionLoading}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isActionLoading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ApplicationDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentApplication: app, isLoading, error, isActionLoading } = useSelector(s => s.application)
  const { myJobs } = useSelector(s => s.job)

  const [statusDialog, setStatusDialog]     = useState(false)
 

  useEffect(() => {
    dispatch(fetchApplicationById(Number(id)))
    return () => { dispatch(clearCurrentApplication()) }
  }, [id])

  // Job title lookup
  const jobTitle = myJobs.find(j => j.id === app?.jobId)?.title || (app ? `Job #${app.jobId}` : "")

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !app) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-4">
          <AlertCircle className="h-7 w-7 text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Application not found</h2>
        <p className="text-sm text-slate-400 mt-1">{error || "This application doesn't exist."}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/employer/applications")}>
          Back to Applications
        </Button>
      </div>
    )
  }

  const sCfg = STATUS_CONFIG[app.status] || STATUS_CONFIG.PENDING
  const StatusIcon = sCfg.icon

  return (
    <div className="space-y-5">
      {/* Back + heading */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <button
            onClick={() => navigate("/employer/applications")}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Applications
          </button>
          <h1 className="text-xl font-bold text-slate-900">Application #{app.id}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Candidate #{app.candidateId} · {jobTitle}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => dispatch(toggleStar(app.id)).unwrap().catch(e => toast.error(e))}
            disabled={isActionLoading}
          >
            <Star className={cn("h-5 w-5", app.isStarred ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
          </button>
          {!app.isRead && (
            <Button size="sm" variant="outline" className="gap-1.5 border-slate-200 text-xs"
              onClick={() => dispatch(markAsRead(app.id)).unwrap().catch(e => toast.error(e))}
              disabled={isActionLoading}
            >
              <Eye className="h-3.5 w-3.5" /> Mark as Read
            </Button>
          )}
          <Button size="sm" className="gap-1.5 bg-brand hover:bg-brand/90"
            onClick={() => setStatusDialog(true)}>
            <Send className="h-3.5 w-3.5" /> Update Status
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* ── Left: main content ────────────────────────────────────────────── */}
        <div className="xl:col-span-2 space-y-5">

          {/* Application summary card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Application Details</h2>
              <Badge variant="outline" className={`gap-1 text-xs font-semibold ${sCfg.className}`}>
                <StatusIcon className="h-3 w-3" /> {sCfg.label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-400 font-medium">Applied</p>
                <p className="text-slate-700">{fmtDate(app.appliedAt)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Source</p>
                <p className="text-slate-700">{fmt(app.source)}</p>
              </div>
              {app.expectedSalary && (
                <div>
                  <p className="text-xs text-slate-400 font-medium">Expected Salary</p>
                  <p className="text-slate-700">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: app.expectedSalaryCurrency || "USD",
                      maximumFractionDigits: 0,
                    }).format(app.expectedSalary)}
                  </p>
                </div>
              )}
              {app.availableFrom && (
                <div>
                  <p className="text-xs text-slate-400 font-medium">Available From</p>
                  <p className="text-slate-700">{fmtDate(app.availableFrom)}</p>
                </div>
              )}
            </div>

            {/* Resume */}
            {app.resumeUrl && (
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {app.resumeFileName || "Resume"}
                  </p>
                  <p className="text-xs text-slate-400">PDF Document</p>
                </div>
                <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="gap-1.5 border-slate-200 text-xs">
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                </a>
              </div>
            )}
          </div>

          {/* Cover letter */}
          {app.coverLetter && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Cover Letter</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{app.coverLetter}</p>
            </div>
          )}


          {/* Notes */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">
              Internal Notes <span className="text-slate-400 font-normal text-xs ml-1">(employer-only)</span>
            </h2>
            <NotesSection notes={app.notes} applicationId={app.id} />
          </div>
        </div>

        {/* ── Right: sidebar ────────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Status + quick action */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Current Status</h3>
            <div className={cn("flex items-center gap-2 rounded-lg border px-3 py-2.5", sCfg.className)}>
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm font-semibold">{sCfg.label}</span>
            </div>
            <Button className="w-full gap-1.5 bg-brand hover:bg-brand/90" size="sm"
              onClick={() => setStatusDialog(true)}>
              <ChevronRight className="h-4 w-4" /> Change Status
            </Button>
          </div>

          {/* Status history */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Status History</h3>
            <StatusTimeline history={app.statusHistory} />
          </div>

          {/* Withdrawal info */}
          {app.status === "WITHDRAWN" && (
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 space-y-1">
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">Withdrawn</p>
              <p className="text-xs text-orange-600">{fmtDate(app.withdrawnAt)}</p>
              {app.withdrawnReason && (
                <p className="text-xs text-orange-700 italic mt-1">"{app.withdrawnReason}"</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <UpdateStatusDialog
        open={statusDialog}
        onClose={() => setStatusDialog(false)}
        applicationId={app.id}
        currentStatus={app.status}
      />
     
    </div>
  )
}
