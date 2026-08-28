import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import {
  ArrowLeft, Search, Download, FileText, Receipt, CreditCard,
  Loader2, AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { fetchCompanyTransactions, fetchInvoiceByTransaction } from "@/store/subscription/subscriptionThunk"
import { fetchMyCompany } from "@/store/company/companyThunk"

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function fmtAmount(val, currency = "INR") {
  if (val == null) return "—"
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(val)
}

function fmt(val) {
  return (val || "").replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

const STATUS_CONFIG = {
  SUCCESS: { label: "Paid",    className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200"       },
  FAILED:  { label: "Failed",  className: "bg-red-50 text-red-600 border-red-200"             },
}

// ── Invoice Detail Dialog ─────────────────────────────────────────────────────

function InvoiceDialog({ transactionNumber, open, onClose }) {
  const dispatch = useDispatch()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (open && transactionNumber) {
      setLoading(true)
      setErr(null)
      dispatch(fetchInvoiceByTransaction(transactionNumber))
        .unwrap()
        .then(data => setInvoice(data))
        .catch(e => setErr(e))
        .finally(() => setLoading(false))
    } else {
      setInvoice(null)
    }
  }, [open, transactionNumber])

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand" /> Invoice Details
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}

        {err && !loading && (
          <div className="flex flex-col items-center py-8 text-center">
            <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
            <p className="text-sm text-slate-500">{err}</p>
          </div>
        )}

        {invoice && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Invoice Number</p>
                <p className="font-mono font-semibold text-slate-800">{invoice.invoiceNumber}</p>
              </div>
              <p className="text-xs text-slate-400">{fmtDate(invoice.invoiceDate)}</p>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Purpose</span>
                <span className="font-medium text-slate-700">{fmt(invoice.purpose)}</span>
              </div>
              {invoice.subscriptionPlan && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan</span>
                  <span className="font-medium text-slate-700">{invoice.subscriptionPlan}</span>
                </div>
              )}
              {(invoice.billingPeriodStart || invoice.billingPeriodEnd) && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Period</span>
                  <span className="font-medium text-slate-700">
                    {fmtDate(invoice.billingPeriodStart)} – {fmtDate(invoice.billingPeriodEnd)}
                  </span>
                </div>
              )}
              <div className="border-t border-slate-200 pt-2 mt-1 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Subtotal</span>
                  <span>{fmtAmount(invoice.subTotal, invoice.currency)}</span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Tax ({invoice.taxRate}%)</span>
                    <span>{fmtAmount(invoice.taxAmount, invoice.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base text-slate-900 pt-1">
                  <span>Total</span>
                  <span>{fmtAmount(invoice.totalAmount, invoice.currency)}</span>
                </div>
              </div>
            </div>

            {(invoice.companyName || invoice.billingEmail || invoice.billingAddress) && (
              <div className="space-y-1 text-xs text-slate-600">
                <p className="font-semibold text-slate-700 uppercase tracking-wide text-[10px]">Billed To</p>
                {invoice.companyName && <p className="font-medium text-slate-800">{invoice.companyName}</p>}
                {invoice.billingEmail && <p>{invoice.billingEmail}</p>}
                {invoice.billingAddress && <p className="text-slate-400">{invoice.billingAddress}</p>}
                {invoice.taxId && <p>Tax ID: {invoice.taxId}</p>}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Invoices() {
  const dispatch = useDispatch()
  const { transactions, isLoading } = useSelector(s => s.subscription)
  const { myCompany } = useSelector(s => s.company)

  const [search, setSearch] = useState("")
  const [invoiceDialog, setInvoiceDialog] = useState(null) // transactionNumber

  useEffect(() => {
    if (!myCompany) dispatch(fetchMyCompany())
  }, [])

  useEffect(() => {
    if (myCompany?.id) dispatch(fetchCompanyTransactions(myCompany.id))
  }, [myCompany])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return transactions
    return transactions.filter(t =>
      t.transactionNumber?.toLowerCase().includes(q) ||
      t.orderNumber?.toLowerCase().includes(q) ||
      fmt(t.status).toLowerCase().includes(q)
    )
  }, [transactions, search])

  // Stats
  const totalPaid    = useMemo(() => transactions.filter(t => t.status === "SUCCESS").reduce((s, t) => s + (t.amount || 0), 0), [transactions])
  const totalCount   = transactions.length
  const currentYear  = new Date().getFullYear()
  const thisYearPaid = useMemo(() =>
    transactions.filter(t => t.status === "SUCCESS" && new Date(t.paidAt || t.createdAt).getFullYear() === currentYear)
      .reduce((s, t) => s + (t.amount || 0), 0),
    [transactions]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/employer/billing" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-3">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Billing
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Billing History</h1>
        <p className="text-sm text-slate-500 mt-1">View and download your payment records</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Paid (All Time)", value: fmtAmount(totalPaid), icon: Receipt, color: "bg-emerald-50 text-emerald-600" },
          { label: "Total Transactions",    value: totalCount,            icon: CreditCard, color: "bg-blue-50 text-brand"   },
          { label: `Paid in ${currentYear}`, value: fmtAmount(thisYearPaid), icon: FileText, color: "bg-violet-50 text-violet-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by transaction number or status..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 border-slate-200"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-3">
              <FileText className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600">
              {transactions.length === 0 ? "No transactions yet" : "No results match your search"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {transactions.length === 0 ? "Payments will appear here once you subscribe to a plan." : "Try adjusting your search terms."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-semibold text-slate-700">Transaction #</TableHead>
                <TableHead className="font-semibold text-slate-700">Order #</TableHead>
                <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                <TableHead className="font-semibold text-slate-700">Method</TableHead>
                <TableHead className="font-semibold text-slate-700">Status</TableHead>
                <TableHead className="font-semibold text-slate-700">Date</TableHead>
                <TableHead className="w-28 font-semibold text-slate-700">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => {
                const sc = STATUS_CONFIG[t.status] || STATUS_CONFIG.PENDING
                return (
                  <TableRow key={t.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-mono text-xs text-slate-700">{t.transactionNumber}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{t.orderNumber}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{fmtAmount(t.amount, t.currency)}</TableCell>
                    <TableCell className="text-sm text-slate-600">{fmt(t.paymentMethod)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs font-semibold ${sc.className}`}>
                        {sc.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {fmtDate(t.paidAt || t.createdAt)}
                    </TableCell>
                    <TableCell>
                      {t.status === "SUCCESS" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs gap-1 text-brand hover:text-brand/70 hover:bg-blue-50"
                          onClick={() => setInvoiceDialog(t.transactionNumber)}
                        >
                          <Download className="h-3.5 w-3.5" /> View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <InvoiceDialog
        transactionNumber={invoiceDialog}
        open={!!invoiceDialog}
        onClose={() => setInvoiceDialog(null)}
      />
    </div>
  )
}
