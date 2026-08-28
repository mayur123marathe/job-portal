import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { ArrowLeft, Check, Star, Loader2, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { fetchActivePlans, createPaymentOrder } from "@/store/subscription/subscriptionThunk"
import { fetchMyCompany } from "@/store/company/companyThunk"
import { clearPaymentOrder } from "@/store/subscription/subscriptionSlice"

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPrice(val, currency = "INR") {
  if (!val && val !== 0) return "Custom"
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(val)
}

function fmtLimit(val) {
  return val === -1 ? "Unlimited" : String(val ?? "—")
}

const PLAN_RING = {
  FREE:         "border-slate-200",
  STARTER:      "border-blue-200",
  PROFESSIONAL: "border-violet-400",
  ENTERPRISE:   "border-amber-300",
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

function PlanCard({ plan, billingCycle, isCurrentPlan, onSelect }) {
  const price  = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
  const isEnterprise = plan.plan === "ENTERPRISE"
  const border = isCurrentPlan ? "border-blue-500 ring-2 ring-blue-200" : PLAN_RING[plan.plan] || "border-slate-200"

  return (
    <div className={`relative rounded-xl border-2 ${border} bg-white p-6 flex flex-col`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-violet-600 text-white shadow-sm">
            <Star className="h-3 w-3 fill-current" /> Most Popular
          </span>
        </div>
      )}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand text-white shadow-sm">
            Current
          </span>
        </div>
      )}

      <div className="space-y-1 mb-4">
        <h3 className="text-lg font-bold text-slate-900">{plan.displayName}</h3>
        <p className="text-xs text-slate-500">{plan.description}</p>
      </div>

      <div className="mb-5">
        {isEnterprise ? (
          <p className="text-2xl font-bold text-slate-900">Contact Us</p>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-slate-900">{fmtPrice(price, plan.currency)}</span>
              <span className="text-sm text-slate-500">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
            </div>
            {billingCycle === "yearly" && plan.monthlyPrice > 0 && (
              <p className="text-xs text-emerald-600 font-medium mt-0.5">
                Save {fmtPrice(plan.monthlyPrice * 12 - plan.yearlyPrice, plan.currency)} vs monthly
              </p>
            )}
          </>
        )}
        {plan.trialDays > 0 && (
          <p className="text-xs text-brand font-medium mt-1">{plan.trialDays}-day free trial</p>
        )}
      </div>

      {/* Limits */}
      <div className="space-y-1.5 mb-5 text-xs text-slate-600">
        <div className="flex justify-between">
          <span>Job Postings</span>
          <span className="font-semibold text-slate-800">{fmtLimit(plan.maxJobPostings)}</span>
        </div>
        <div className="flex justify-between">
          <span>Featured Jobs</span>
          <span className="font-semibold text-slate-800">{fmtLimit(plan.maxFeaturedJobs)}</span>
        </div>
        <div className="flex justify-between">
          <span>Resume Views</span>
          <span className="font-semibold text-slate-800">{fmtLimit(plan.maxResumeViews)}</span>
        </div>
        <div className="flex justify-between">
          <span>Support</span>
          <span className="font-semibold text-slate-800">{plan.supportLevel || "—"}</span>
        </div>
      </div>

      {/* Features */}
      {plan.features?.length > 0 && (
        <div className="space-y-1.5 mb-5 border-t border-slate-100 pt-4 flex-1">
          {plan.features.map((f, i) => (
            <div key={i} className={`flex items-start gap-1.5 text-xs ${f.highlighted ? "font-semibold text-slate-800" : "text-slate-600"}`}>
              <Check className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${f.highlighted ? "text-violet-500" : "text-emerald-500"}`} />
              {f.featureText}
            </div>
          ))}
        </div>
      )}

      <Button
        className={`w-full mt-auto ${
          isCurrentPlan
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            : plan.popular
            ? "bg-violet-600 hover:bg-violet-700"
            : "bg-brand hover:bg-brand/90"
        }`}
        disabled={isCurrentPlan}
        onClick={() => !isCurrentPlan && onSelect(plan, billingCycle)}
      >
        {isCurrentPlan ? "Current Plan" : isEnterprise ? "Contact Sales" : "Select Plan"}
      </Button>
    </div>
  )
}

// ── Purchase Dialog ───────────────────────────────────────────────────────────

function PurchaseDialog({ open, onClose, plan, billingCycle, companyId }) {
  const dispatch = useDispatch()
  const { paymentOrder, isActionLoading } = useSelector(s => s.subscription)
  const { user } = useSelector(s => s.auth)

  const price = billingCycle === "monthly" ? plan?.monthlyPrice : plan?.yearlyPrice

  const handleCreateOrder = () => {
    if (!companyId) return toast.error("Company not found")
    dispatch(createPaymentOrder({
      companyId,
      userId: user?.id,
      amount: price,
      currency: plan?.currency || "INR",
      gateway: "RAZORPAY",
      purpose: "SUBSCRIPTION",
      subscriptionPlan: plan?.plan,
    }))
      .unwrap()
      .then(() => toast.success("Payment order created. Proceed to payment gateway."))
      .catch(err => toast.error(err))
  }

  const handleClose = () => {
    dispatch(clearPaymentOrder())
    onClose()
  }

  if (!plan) return null

  return (
    <Dialog open={open} onOpenChange={o => !o && handleClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Subscribe to {plan.displayName}</DialogTitle>
          <DialogDescription>Review your order before proceeding to payment</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Plan</span>
              <span className="font-semibold text-slate-800">{plan.displayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Billing</span>
              <span className="font-semibold text-slate-800 capitalize">{billingCycle}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
              <span className="text-slate-600 font-medium">Total</span>
              <span className="font-bold text-slate-900 text-base">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: plan.currency || "INR", maximumFractionDigits: 0 }).format(price)}
              </span>
            </div>
          </div>

          {paymentOrder ? (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 space-y-2">
              <p className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Order Created
              </p>
              <div className="text-xs text-emerald-700 space-y-1">
                <p>Order #: <span className="font-mono font-semibold">{paymentOrder.orderNumber}</span></p>
                <p>Gateway Order ID: <span className="font-mono font-semibold">{paymentOrder.gatewayOrderId}</span></p>
              </div>
              <p className="text-xs text-emerald-600 mt-2">
                Use the Gateway Order ID to complete payment via Razorpay checkout.
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Clicking "Create Order" will generate a Razorpay order. Complete the payment in the Razorpay checkout window.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isActionLoading}>Cancel</Button>
          <Button
            className="bg-brand hover:bg-brand/90"
            onClick={handleCreateOrder}
            disabled={isActionLoading || !!paymentOrder}
          >
            {isActionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {paymentOrder ? "Order Created" : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Plans() {
  const dispatch = useDispatch()
  const { activePlans, activeSubscription, isLoading } = useSelector(s => s.subscription)
  const { myCompany } = useSelector(s => s.company)

  const [billingCycle, setBillingCycle] = useState("monthly")
  const [selected, setSelected] = useState(null) // { plan, billingCycle }

  useEffect(() => {
    dispatch(fetchActivePlans())
    if (!myCompany) dispatch(fetchMyCompany())
  }, [])

  const handleSelect = (plan, cycle) => {
    if (plan.plan === "ENTERPRISE") {
      window.location.href = "mailto:sales@aijobportal.com"
    } else {
      setSelected({ plan, cycle })
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link to="/employer/billing" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-3">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Billing
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Plans & Pricing</h1>
        <p className="text-sm text-slate-500 mt-1">Choose the perfect plan for your hiring needs</p>
      </div>

      {/* Billing cycle toggle */}
      <div className="flex items-center gap-4">
        <Label className={`text-sm font-medium ${billingCycle === "monthly" ? "text-slate-900" : "text-slate-400"}`}>Monthly</Label>
        <Switch
          checked={billingCycle === "yearly"}
          onCheckedChange={c => setBillingCycle(c ? "yearly" : "monthly")}
        />
        <Label className={`text-sm font-medium ${billingCycle === "yearly" ? "text-slate-900" : "text-slate-400"}`}>
          Yearly
        </Label>
        {billingCycle === "yearly" && (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Save up to 20%</Badge>
        )}
      </div>

      {/* Plans grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[480px] rounded-xl" />)}
        </div>
      ) : activePlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Zap className="h-12 w-12 text-slate-300 mb-3" />
          <p className="text-slate-500">No plans available. Check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {activePlans.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              isCurrentPlan={activeSubscription?.plan === plan.plan && activeSubscription?.status === "ACTIVE"}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      {/* All plans include */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4">All plans include</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "Applicant tracking system",
            "Interview scheduling",
            "Email notifications",
            "Mobile-friendly dashboard",
            "Resume database access",
            "Team collaboration",
            "GDPR compliant",
            "99.9% uptime SLA",
            "Regular feature updates",
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
              <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Purchase dialog */}
      {selected && (
        <PurchaseDialog
          open={!!selected}
          onClose={() => setSelected(null)}
          plan={selected.plan}
          billingCycle={selected.cycle}
          companyId={myCompany?.id}
        />
      )}
    </div>
  )
}
