import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import {
  Loader2, Edit2, Check, X, Star, Zap, Plus, Trash2,
  Users, Briefcase, Eye, ToggleLeft, ToggleRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { fetchAllPlans, updatePlanConfig } from "@/store/subscription/subscriptionThunk"

// ── Config ─────────────────────────────────────────────────────────────────────

const PLAN_COLORS = {
  FREE:         { bg: "bg-slate-100",  text: "text-slate-700",  border: "border-slate-200",  ring: "ring-slate-300"  },
  STARTER:      { bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",   ring: "ring-blue-300"   },
  PROFESSIONAL: { bg: "bg-violet-50",  text: "text-violet-700", border: "border-violet-200", ring: "ring-violet-300" },
  ENTERPRISE:   { bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  ring: "ring-amber-300"  },
}

function fmtPrice(val, currency = "INR") {
  if (val == null) return "—"
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(val)
}

function fmtLimit(val) {
  if (val == null) return "—"
  return val === -1 ? "Unlimited" : String(val)
}

// ── Edit Dialog ───────────────────────────────────────────────────────────────

function EditPlanDialog({ plan, open, onClose }) {
  const dispatch = useDispatch()
  const { isActionLoading } = useSelector(s => s.subscription)

  const [form, setForm] = useState({})
  const [features, setFeatures] = useState([])

  useEffect(() => {
    if (plan) {
      setForm({
        displayName:          plan.displayName || "",
        description:          plan.description || "",
        monthlyPrice:         plan.monthlyPrice ?? 0,
        yearlyPrice:          plan.yearlyPrice ?? 0,
        maxJobPostings:       plan.maxJobPostings ?? -1,
        maxFeaturedJobs:      plan.maxFeaturedJobs ?? -1,
        maxResumeViews:       plan.maxResumeViews ?? -1,
        jobPostingDurationDays: plan.jobPostingDurationDays ?? 30,
        supportLevel:         plan.supportLevel || "",
        trialDays:            plan.trialDays ?? 0,
        popular:              plan.popular ?? false,
        active:               plan.active ?? true,
      })
      setFeatures((plan.features || []).map((f, i) => ({ ...f, _key: i })))
    }
  }, [plan])

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))
  const setNum = f => e => setForm(p => ({ ...p, [f]: e.target.value === "" ? "" : Number(e.target.value) }))
  const setToggle = f => v => setForm(p => ({ ...p, [f]: v }))

  const addFeature = () =>
    setFeatures(f => [...f, { featureText: "", highlighted: false, _key: Date.now() }])

  const updateFeature = (key, field, val) =>
    setFeatures(f => f.map(x => x._key === key ? { ...x, [field]: val } : x))

  const removeFeature = key =>
    setFeatures(f => f.filter(x => x._key !== key))

  const handleSave = () => {
    const patch = {
      ...form,
      monthlyPrice:         Number(form.monthlyPrice),
      yearlyPrice:          Number(form.yearlyPrice),
      maxJobPostings:       Number(form.maxJobPostings),
      maxFeaturedJobs:      Number(form.maxFeaturedJobs),
      maxResumeViews:       Number(form.maxResumeViews),
      jobPostingDurationDays: Number(form.jobPostingDurationDays),
      trialDays:            Number(form.trialDays),
      features: features.map(({ featureText, highlighted }) => ({ featureText, highlighted })),
    }
    dispatch(updatePlanConfig({ id: plan.id, ...patch }))
      .unwrap()
      .then(() => { toast.success(`${plan.plan} plan updated`); onClose() })
      .catch(err => toast.error(err))
  }

  if (!plan) return null

  const colors = PLAN_COLORS[plan.plan] || PLAN_COLORS.FREE

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors.bg} ${colors.text}`}>
              {plan.plan}
            </span>
            Edit Plan Configuration
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-1">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Display Name</Label>
              <Input value={form.displayName} onChange={set("displayName")} className="border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Support Level</Label>
              <Input value={form.supportLevel} onChange={set("supportLevel")} placeholder="e.g. Priority Email" className="border-slate-200" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Description</Label>
            <Textarea value={form.description} onChange={set("description")} rows={2} className="border-slate-200 resize-none text-sm" />
          </div>

          {/* Pricing */}
          <div className="rounded-lg border border-slate-200 p-4 space-y-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Pricing</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Monthly Price (INR)</Label>
                <Input type="number" min={0} value={form.monthlyPrice} onChange={setNum("monthlyPrice")} className="border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Yearly Price (INR)</Label>
                <Input type="number" min={0} value={form.yearlyPrice} onChange={setNum("yearlyPrice")} className="border-slate-200" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Trial Days</Label>
              <Input type="number" min={0} value={form.trialDays} onChange={setNum("trialDays")} className="border-slate-200 w-32" />
            </div>
          </div>

          {/* Limits */}
          <div className="rounded-lg border border-slate-200 p-4 space-y-3">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Limits <span className="font-normal text-slate-400">(-1 = Unlimited)</span></p>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Job Postings</Label>
                <Input type="number" min={-1} value={form.maxJobPostings} onChange={setNum("maxJobPostings")} className="border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Featured Jobs</Label>
                <Input type="number" min={-1} value={form.maxFeaturedJobs} onChange={setNum("maxFeaturedJobs")} className="border-slate-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Resume Views</Label>
                <Input type="number" min={-1} value={form.maxResumeViews} onChange={setNum("maxResumeViews")} className="border-slate-200" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Job Posting Duration (days)</Label>
              <Input type="number" min={1} value={form.jobPostingDurationDays} onChange={setNum("jobPostingDurationDays")} className="border-slate-200 w-32" />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.popular} onCheckedChange={setToggle("popular")} />
              <Label className="text-sm font-medium text-slate-700">Mark as Popular</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={setToggle("active")} />
              <Label className="text-sm font-medium text-slate-700">Active (visible to employers)</Label>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Features</p>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-slate-200" onClick={addFeature}>
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {features.map(f => (
                <div key={f._key} className="flex items-center gap-2">
                  <Input
                    value={f.featureText}
                    onChange={e => updateFeature(f._key, "featureText", e.target.value)}
                    placeholder="Feature description..."
                    className="border-slate-200 text-sm flex-1"
                  />
                  <button
                    title="Highlight"
                    onClick={() => updateFeature(f._key, "highlighted", !f.highlighted)}
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      f.highlighted ? "bg-amber-100 border-amber-300 text-amber-600" : "border-slate-200 text-slate-400 hover:text-amber-500"
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => removeFeature(f._key)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {features.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-3">No features yet. Click "Add" to start.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1 border-slate-200" onClick={onClose} disabled={isActionLoading}>
              Cancel
            </Button>
            <Button className="flex-1 bg-brand hover:bg-brand/90" onClick={handleSave} disabled={isActionLoading}>
              {isActionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({ plan, onEdit, onToggleActive, onTogglePopular }) {
  const colors = PLAN_COLORS[plan.plan] || PLAN_COLORS.FREE

  return (
    <div className={`rounded-xl border-2 ${colors.border} bg-white p-5 space-y-4 relative`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-violet-600 text-white shadow-sm">
            <Star className="h-3 w-3 fill-current" /> Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${colors.bg} ${colors.text} mb-1`}>
            {plan.plan}
          </div>
          <h3 className="text-base font-bold text-slate-900">{plan.displayName}</h3>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{plan.description}</p>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0 ml-2">
          <Badge variant="outline" className={`text-xs ${plan.active ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-slate-400 border-slate-200"}`}>
            {plan.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-900">{fmtPrice(plan.monthlyPrice, plan.currency)}</span>
          <span className="text-xs text-slate-500">/ month</span>
        </div>
        <p className="text-xs text-slate-400">{fmtPrice(plan.yearlyPrice, plan.currency)} / year</p>
        {plan.trialDays > 0 && (
          <p className="text-xs text-emerald-600 font-medium">{plan.trialDays}-day free trial</p>
        )}
      </div>

      {/* Limits */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Briefcase className="h-3.5 w-3.5 text-slate-400" />
          <span>{fmtLimit(plan.maxJobPostings)} job postings · {plan.jobPostingDurationDays}d duration</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Zap className="h-3.5 w-3.5 text-slate-400" />
          <span>{fmtLimit(plan.maxFeaturedJobs)} featured jobs</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Eye className="h-3.5 w-3.5 text-slate-400" />
          <span>{fmtLimit(plan.maxResumeViews)} resume views</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Users className="h-3.5 w-3.5 text-slate-400" />
          <span>{plan.supportLevel || "—"} support</span>
        </div>
      </div>

      {/* Features */}
      {plan.features?.length > 0 && (
        <div className="space-y-1.5 border-t border-slate-100 pt-3">
          {plan.features.slice(0, 5).map((f, i) => (
            <div key={i} className={`flex items-start gap-1.5 text-xs ${f.highlighted ? "font-semibold text-slate-800" : "text-slate-600"}`}>
              <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${f.highlighted ? "text-violet-500" : "text-emerald-500"}`} />
              {f.featureText}
            </div>
          ))}
          {plan.features.length > 5 && (
            <p className="text-xs text-slate-400">+{plan.features.length - 5} more features</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-slate-100">
        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs gap-1.5 border-slate-200"
          onClick={() => onEdit(plan)}>
          <Edit2 className="h-3.5 w-3.5" /> Edit
        </Button>
        <button
          title={plan.popular ? "Remove Popular" : "Mark Popular"}
          onClick={() => onTogglePopular(plan)}
          className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
            plan.popular ? "bg-amber-100 border-amber-300 text-amber-600" : "border-slate-200 text-slate-400 hover:text-amber-500"
          }`}
        >
          <Star className="h-3.5 w-3.5" />
        </button>
        <button
          title={plan.active ? "Deactivate" : "Activate"}
          onClick={() => onToggleActive(plan)}
          className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
            plan.active ? "border-emerald-200 text-emerald-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500" : "border-slate-200 text-slate-400 hover:text-emerald-600"
          }`}
        >
          {plan.active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AdminSubscriptions() {
  const dispatch = useDispatch()
  const { plans, isLoading, isActionLoading } = useSelector(s => s.subscription)

  const [editTarget, setEditTarget] = useState(null)
  const [toggleConfirm, setToggleConfirm] = useState(null) // { plan, field }

  useEffect(() => {
    dispatch(fetchAllPlans())
  }, [])

  const handleToggleActive = (plan) => setToggleConfirm({ plan, field: "active" })
  const handleTogglePopular = (plan) => setToggleConfirm({ plan, field: "popular" })

  const confirmToggle = () => {
    if (!toggleConfirm) return
    const { plan, field } = toggleConfirm
    dispatch(updatePlanConfig({ id: plan.id, [field]: !plan[field] }))
      .unwrap()
      .then(() => toast.success(`Plan ${field} updated`))
      .catch(err => toast.error(err))
      .finally(() => setToggleConfirm(null))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscription Plans</h1>
          <p className="text-sm text-slate-500 mt-1">Configure pricing, limits, and features for each plan tier</p>
        </div>
        <Button variant="outline" className="border-slate-200 text-sm gap-2" onClick={() => dispatch(fetchAllPlans())}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 rotate-0 opacity-0 absolute" />}
          Refresh
        </Button>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-96 rounded-xl" />)}
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Zap className="h-12 w-12 text-slate-300 mb-3" />
          <p className="text-slate-500">No plans found. Check if the subscription service is running.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {plans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={setEditTarget}
              onToggleActive={handleToggleActive}
              onTogglePopular={handleTogglePopular}
            />
          ))}
        </div>
      )}

      {/* Summary table */}
      {plans.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Quick Comparison</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Plan</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Monthly</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Yearly</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Job Posts</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Featured</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Resume Views</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Support</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(p => {
                  const c = PLAN_COLORS[p.plan] || PLAN_COLORS.FREE
                  return (
                    <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${c.bg} ${c.text}`}>{p.plan}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{fmtPrice(p.monthlyPrice, p.currency)}</td>
                      <td className="px-4 py-3 text-slate-700 font-medium">{fmtPrice(p.yearlyPrice, p.currency)}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtLimit(p.maxJobPostings)}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtLimit(p.maxFeaturedJobs)}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtLimit(p.maxResumeViews)}</td>
                      <td className="px-4 py-3 text-slate-600">{p.supportLevel || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-1.5 w-1.5 rounded-full ${p.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                          <span className="text-xs text-slate-600">{p.active ? "Active" : "Inactive"}</span>
                          {p.popular && <Star className="h-3 w-3 fill-amber-400 text-amber-400 ml-1" />}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <EditPlanDialog
        plan={editTarget}
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
      />

      {/* Toggle confirm */}
      <AlertDialog open={!!toggleConfirm} onOpenChange={o => !o && setToggleConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {toggleConfirm?.field === "active"
                ? (toggleConfirm?.plan.active ? "Deactivate plan?" : "Activate plan?")
                : (toggleConfirm?.plan.popular ? "Remove 'Most Popular' badge?" : "Mark as 'Most Popular'?")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleConfirm?.field === "active"
                ? (toggleConfirm?.plan.active
                    ? "This will hide the plan from employers on the pricing page."
                    : "This will make the plan visible to employers on the pricing page.")
                : "Only one plan should typically be marked as popular."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggle} disabled={isActionLoading}>
              {isActionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
