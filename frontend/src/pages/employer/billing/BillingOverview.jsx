import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import {
  Loader2, TrendingUp, Briefcase, Star, Eye, Calendar,
  AlertTriangle, CheckCircle, XCircle, Clock, CreditCard,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { fetchActiveSubscription, fetchSubscriptionHistory, cancelSubscription } from "@/store/subscription/subscriptionThunk"
import { fetchMyCompany } from "@/store/company/companyThunk"

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function fmtLimit(val) {
  return val === -1 ? "∞" : String(val ?? "—")
}

const PLAN_COLORS = {
  FREE:         { bg: "bg-slate-100",  text: "text-slate-700"  },
  STARTER:      { bg: "bg-blue-100",   text: "text-blue-700"   },
  PROFESSIONAL: { bg: "bg-violet-100", text: "text-violet-700" },
  ENTERPRISE:   { bg: "bg-amber-100",  text: "text-amber-700"  },
}

const STATUS_CONFIG = {
  ACTIVE:    { label: "Active",    className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle },
  EXPIRED:   { label: "Expired",   className: "bg-slate-100 text-slate-600 border-slate-200",     icon: Clock       },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-600 border-red-200",             icon: XCircle     },
  PAUSED:    { label: "Paused",    className: "bg-amber-50 text-amber-700 border-amber-200",       icon: Clock       },
}

// ── Usage Bar ─────────────────────────────────────────────────────────────────

function UsageBar({ label, used, max, icon: Icon, color }) {
  const isUnlimited = max === -1
  const pct = isUnlimited ? 0 : max === 0 ? 0 : Math.min(100, Math.round((used / max) * 100))
  const isHigh = pct >= 80

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="font-medium text-slate-700">{label}</span>
        </div>
        <span className="text-slate-500 text-xs font-mono">
          {used} / {isUnlimited ? "∞" : max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        {!isUnlimited && (
          <div
            className={`h-full rounded-full transition-all ${isHigh ? "bg-red-500" : "bg-blue-500"}`}
            style={{ width: `${pct}%` }}
          />
        )}
        {isUnlimited && <div className="h-full rounded-full bg-emerald-400 w-full opacity-30" />}
      </div>
      {isHigh && !isUnlimited && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> {100 - pct}% remaining
        </p>
      )}
    </div>
  )
}

// ── Cancel Dialog ─────────────────────────────────────────────────────────────

function CancelSubscriptionDialog({ open, onClose, subscriptionId }) {
  const dispatch = useDispatch()
  const { isActionLoading } = useSelector(s => s.subscription)
  const [reason, setReason] = useState("")
  const [immediate, setImmediate] = useState(false)

  const handleCancel = () => {
    if (!reason.trim()) return toast.error("Please provide a cancellation reason")
    dispatch(cancelSubscription({ subscriptionId, cancellationReason: reason.trim(), cancelImmediately: immediate }))
      .unwrap()
      .then(() => { toast.success("Subscription cancelled"); onClose() })
      .catch(err => toast.error(err))
  }

  return (
    <AlertDialog open={open} onOpenChange={o => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Please tell us why you're cancelling. This helps us improve.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 my-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Reason <span className="text-red-500">*</span></Label>
            <Textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Switching to a different platform, no longer hiring..."
              rows={3}
              className="border-slate-200 resize-none text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={immediate} onCheckedChange={setImmediate} />
            <Label className="text-sm text-slate-700">Cancel immediately (instead of at period end)</Label>
          </div>
          {immediate && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Access will end today. Remaining subscription days are not refunded.
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isActionLoading}>Keep Subscription</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isActionLoading || !reason.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {isActionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Cancel Subscription
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function BillingOverview() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { activeSubscription: sub, subscriptionHistory, isLoading } = useSelector(s => s.subscription)
  const { myCompany } = useSelector(s => s.company)

  const [cancelDialog, setCancelDialog] = useState(false)

  useEffect(() => {
    if (!myCompany) dispatch(fetchMyCompany())
  }, [])

  useEffect(() => {
    if (myCompany?.id) {
      dispatch(fetchActiveSubscription(myCompany.id))
      dispatch(fetchSubscriptionHistory(myCompany.id))
    }
  }, [myCompany])

  // ── No company ────────────────────────────────────────────────────────────
  if (!isLoading && !myCompany) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Briefcase className="h-12 w-12 text-slate-300 mb-3" />
        <h2 className="text-lg font-semibold text-slate-800">Set up your company first</h2>
        <p className="text-sm text-slate-400 mt-1">A company profile is required to manage subscriptions.</p>
        <Button className="mt-4 bg-brand hover:bg-brand/90" onClick={() => navigate("/employer/company")}>
          Go to Company Profile
        </Button>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading && !sub) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    )
  }

  const planColors = sub ? PLAN_COLORS[sub.plan] || PLAN_COLORS.FREE : null
  const statusCfg  = sub ? STATUS_CONFIG[sub.status] || STATUS_CONFIG.ACTIVE : null
  const StatusIcon = statusCfg?.icon || CheckCircle

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your plan, usage, and payment history</p>
      </div>

      {/* No active subscription */}
      {!sub && (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mx-auto mb-4">
            <CreditCard className="h-7 w-7 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">No active subscription</h2>
          <p className="text-sm text-slate-500 mt-1 mb-5">Choose a plan to unlock job postings and premium features.</p>
          <Link to="/employer/billing/plans">
            <Button className="bg-brand hover:bg-brand/90 gap-2">
              <TrendingUp className="h-4 w-4" /> View Plans
            </Button>
          </Link>
        </div>
      )}

      {/* Active subscription */}
      {sub && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Plan card */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${planColors.bg} ${planColors.text}`}>
                    {sub.plan}
                  </span>
                  <Badge variant="outline" className={`text-xs font-semibold gap-1 ${statusCfg.className}`}>
                    <StatusIcon className="h-3 w-3" /> {statusCfg.label}
                  </Badge>
                </div>
                <h2 className="text-xl font-bold text-slate-900">Current Plan</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {fmtDate(sub.startDate)} → {fmtDate(sub.endDate)}
                </p>
              </div>
              <div className="text-right">
                {sub.autoRenew && (
                  <p className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Auto-renews {fmtDate(sub.endDate)}
                  </p>
                )}
                {sub.cancelledAt && (
                  <p className="text-xs text-red-500 font-medium flex items-center justify-end gap-1">
                    <XCircle className="h-3.5 w-3.5" /> Cancelled {fmtDate(sub.cancelledAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Usage */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Usage This Period</p>
              <UsageBar label="Job Postings"   used={sub.jobPostingsUsed}   max={sub.maxJobPostings}   icon={Briefcase} color="text-blue-500" />
              <UsageBar label="Featured Jobs"  used={sub.featuredJobsUsed}  max={sub.maxFeaturedJobs}  icon={Star}      color="text-violet-500" />
              <UsageBar label="Resume Views"   used={sub.resumeViewsUsed}   max={sub.maxResumeViews}   icon={Eye}       color="text-indigo-500" />
            </div>

            {/* Cancellation reason */}
            {sub.cancellationReason && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
                <p className="font-semibold mb-0.5">Cancellation Reason</p>
                <p className="italic">"{sub.cancellationReason}"</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1 border-t border-slate-100">
              <Link to="/employer/billing/plans" className="flex-1">
                <Button className="w-full gap-1.5 bg-brand hover:bg-brand/90">
                  <TrendingUp className="h-4 w-4" /> Upgrade Plan
                </Button>
              </Link>
              {sub.status === "ACTIVE" && (
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
                  onClick={() => setCancelDialog(true)}>
                  <XCircle className="h-4 w-4" /> Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Plan limits */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Plan Limits</p>
              <div className="space-y-2 text-sm">
                {[
                  { label: "Job Postings", val: fmtLimit(sub.maxJobPostings) },
                  { label: "Featured Jobs", val: fmtLimit(sub.maxFeaturedJobs) },
                  { label: "Resume Views", val: fmtLimit(sub.maxResumeViews) },
                  { label: "Job Duration", val: `${sub.jobPostingDurationDays}d` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-500">{label}</span>
                    <span className={`font-semibold ${val === "∞" ? "text-emerald-600" : "text-slate-800"}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Quick Links</p>
              {[
                { label: "View All Plans", href: "/employer/billing/plans", icon: TrendingUp },
                { label: "Payment History", href: "/employer/billing/payment", icon: CreditCard },
                { label: "Invoices", href: "/employer/billing/invoices", icon: Calendar },
              ].map(({ label, href, icon: Icon }) => (
                <Link key={href} to={href}>
                  <button className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <Icon className="h-4 w-4 text-slate-400" /> {label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subscription History */}
      {subscriptionHistory.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <History className="h-4 w-4 text-slate-500" />
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Subscription History</p>
          </div>
          <div className="divide-y divide-slate-100">
            {subscriptionHistory.map(h => {
              const sc = STATUS_CONFIG[h.status] || STATUS_CONFIG.ACTIVE
              const pc = PLAN_COLORS[h.plan] || PLAN_COLORS.FREE
              const SI = sc.icon
              return (
                <div key={h.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${pc.bg} ${pc.text}`}>{h.plan}</span>
                    <div>
                      <p className="text-sm text-slate-700 font-medium">{fmtDate(h.startDate)} – {fmtDate(h.endDate)}</p>
                      {h.cancellationReason && (
                        <p className="text-xs text-slate-400 truncate max-w-xs">"{h.cancellationReason}"</p>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs font-semibold gap-1 ${sc.className}`}>
                    <SI className="h-3 w-3" /> {sc.label}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <CancelSubscriptionDialog
        open={cancelDialog}
        onClose={() => setCancelDialog(false)}
        subscriptionId={sub?.id}
      />
    </div>
  )
}
