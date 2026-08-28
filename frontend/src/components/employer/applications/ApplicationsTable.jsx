import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Star, Eye, MoreHorizontal, FileText, Sparkles,
  ScrollText, Users, ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import AiScoreCircle from "@/components/ui/AiScoreCircle"

const STATUS_CONFIG = {
  PENDING:             { label: "Pending",    className: "bg-slate-100 text-slate-600 border-slate-200" },
  REVIEWING:           { label: "Reviewing",  className: "bg-blue-50 text-blue-700 border-blue-200" },
  SHORTLISTED:         { label: "Shortlisted",className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  INTERVIEW_SCHEDULED: { label: "Interview",  className: "bg-violet-50 text-violet-700 border-violet-200" },
  REJECTED:            { label: "Rejected",   className: "bg-red-50 text-red-600 border-red-200" },
  HIRED:               { label: "Hired",      className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  WITHDRAWN:           { label: "Withdrawn",  className: "bg-orange-50 text-orange-600 border-orange-200" },
}

function fmtDate(dt) {
  if (!dt) return "—"
  return new Date(dt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function getInitials(name) {
  if (!name) return "?"
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
}

function SkeletonRows({ cols }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: cols }).map((_, j) => (
        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
      ))}
    </TableRow>
  ))
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Reusable applications table.
 *
 * Compact mode  (no onUpdateStatus/onToggleStar): used in dashboard — shows a simple "Review" button.
 * Full mode     (onUpdateStatus + onToggleStar provided): used in Applications page — shows star column + actions dropdown.
 */
export default function ApplicationsTable({
  applications = [],
  isLoading = false,
  emptyTitle = "No applications yet",
  emptySubtitle = "Applications will appear here once candidates apply.",
  // callbacks — presence determines which columns/actions are shown
  onRowClick,
  onToggleStar,       // full mode: star column
  onUpdateStatus,     // full mode: dropdown → Update Status
  onAIScreen,         // full mode: dropdown → AI Screen
  onSummarizeNotes,   // full mode: dropdown → Summarize Notes
  onMarkRead,
  isActionLoading = false,
}) {
  const navigate = useNavigate()
  const isFullMode = !!onToggleStar
  const colSpan = isFullMode ? 8 : 6

  const handleRowClick = (app) => {
    if (!app.isRead && onMarkRead) onMarkRead(app.id)
    if (onRowClick) onRowClick(app)
    else navigate(`/employer/applications/${app.id}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          {isFullMode && <TableHead className="w-8" />}
          <TableHead className="font-semibold text-slate-700">Candidate</TableHead>
          <TableHead className="font-semibold text-slate-700">Job Position</TableHead>
          <TableHead className="font-semibold text-slate-700">Status</TableHead>
          <TableHead className="font-semibold text-slate-700">AI Score</TableHead>
          <TableHead className="font-semibold text-slate-700">Applied</TableHead>
          <TableHead className="w-10 text-right font-semibold text-slate-700">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          <SkeletonRows cols={colSpan} />
        ) : applications.length === 0 ? (
          <TableRow>
            <TableCell colSpan={colSpan}>
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
                  <Users className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-600">{emptyTitle}</p>
                <p className="text-xs text-slate-400 mt-1">{emptySubtitle}</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          applications.map(app => {
            const sCfg          = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.PENDING
            const jobTitle      = app.job?.title ?? `Job #${app.jobId}`
            const candidateName = app.candidate?.fullName ?? `Candidate #${app.candidateId}`
            const isUnread      = !app.isRead

            return (
              <TableRow
                key={app.id}
                className={cn(
                  "cursor-pointer hover:bg-slate-50/60 transition-colors",
                  isUnread && "bg-blue-50/30"
                )}
                onClick={() => handleRowClick(app)}
              >
                {/* Star — full mode only */}
                {isFullMode && (
                  <TableCell className="pr-0 w-8" onClick={e => e.stopPropagation()}>
                    <button
                      className="p-1 rounded hover:bg-slate-100 transition-colors"
                      onClick={e => { e.stopPropagation(); onToggleStar(e, app.id) }}
                      disabled={isActionLoading}
                    >
                      <Star className={cn(
                        "h-4 w-4",
                        app.isStarred ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      )} />
                    </button>
                  </TableCell>
                )}

                {/* Candidate */}
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white text-sm font-bold">
                      {getInitials(app.candidate?.fullName)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{candidateName}</p>
                      {app.candidate?.email && (
                        <p className="text-xs text-slate-400">{app.candidate.email}</p>
                      )}
                      {isUnread && (
                        <span className="text-xs text-brand font-semibold">New</span>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* Job */}
                <TableCell>
                  <p className="text-sm text-slate-700 font-medium truncate max-w-[200px]">{jobTitle}</p>
                  {app.job?.city && (
                    <p className="text-xs text-slate-400">{[app.job.city, app.job.country].filter(Boolean).join(", ")}</p>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant="outline" className={`text-xs font-semibold ${sCfg.className}`}>
                    {sCfg.label}
                  </Badge>
                </TableCell>

                {/* AI Score */}
                <TableCell>
                  <AiScoreCircle score={app.screening?.overallScore} />
                </TableCell>

                {/* Applied */}
                <TableCell className="text-xs text-slate-400">
                  {fmtDate(app.appliedAt)}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                  {isFullMode ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem onClick={() => navigate(`/employer/applications/${app.id}`)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        {onUpdateStatus && (
                          <DropdownMenuItem onClick={() => onUpdateStatus(app)}>
                            <FileText className="mr-2 h-4 w-4" /> Update Status
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {onAIScreen && (
                          <DropdownMenuItem onClick={() => onAIScreen(app)}>
                            <Sparkles className="mr-2 h-4 w-4 text-brand" /> View AI Screening
                          </DropdownMenuItem>
                        )}
                        {onSummarizeNotes && (
                          <DropdownMenuItem onClick={() => onSummarizeNotes(app.id)}>
                            <ScrollText className="mr-2 h-4 w-4 text-indigo-600" /> Summarize Notes
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={e => { e.stopPropagation(); onToggleStar(e, app.id) }}>
                          <Star className="mr-2 h-4 w-4" />
                          {app.isStarred ? "Remove Star" : "Star Candidate"}
                        </DropdownMenuItem>
                        {isUnread && onMarkRead && (
                          <DropdownMenuItem onClick={() => onMarkRead(app.id)}>
                            <Eye className="mr-2 h-4 w-4" /> Mark as Read
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-brand hover:text-brand/80"
                      onClick={() => navigate(`/employer/applications/${app.id}`)}
                    >
                      Review
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
