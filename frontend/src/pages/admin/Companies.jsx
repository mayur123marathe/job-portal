import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ShieldCheck, Clock, Ban, XCircle, Download } from "lucide-react"

import { fetchAllCompanies, deleteCompany } from "@/store/company/companyThunk"
import { clearErrors } from "@/store/company/companySlice"

import CompanyFilters from "@/components/admin/companies/CompanyFilters"
import CompanyTable from "@/components/admin/companies/CompanyTable"
import CompanyDetailDialog from "@/components/admin/companies/CompanyDetailDialog"
import DeleteConfirmDialog from "@/components/admin/companies/DeleteConfirmDialog"

export default function AdminCompanies() {
  const dispatch = useDispatch()
  const { companies, isLoading, isActionLoading, error, actionError } = useSelector(
    (state) => state.company
  )

  // ── Local filter state ────────────────────────────────────────────────────
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [detailCompany, setDetailCompany] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllCompanies())
  }, [dispatch])

  // ── Show API errors via toast ─────────────────────────────────────────────
  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearErrors())
    }
    if (actionError) {
      toast.error(actionError)
      dispatch(clearErrors())
    }
  }, [error, actionError, dispatch])

  // ── Refresh with current API-level filters ────────────────────────────────
  const handleRefresh = () => {
    const filters = {}
    if (statusFilter !== "all") filters.status = statusFilter
    if (typeFilter !== "all") filters.companyType = typeFilter
    if (industryFilter !== "all") filters.industryType = industryFilter
    dispatch(fetchAllCompanies(filters))
  }

  // ── Client-side search on top of API results ──────────────────────────────
  const filtered = useMemo(() => {
    let list = [...companies]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.slug?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== "all") list = list.filter((c) => c.status === statusFilter)
    if (typeFilter !== "all") list = list.filter((c) => c.companyType === typeFilter)
    if (industryFilter !== "all") list = list.filter((c) => c.industryType === industryFilter)

    return list
  }, [companies, search, statusFilter, typeFilter, industryFilter])

  // ── Summary stats (derived from full list) ────────────────────────────────
  const stats = useMemo(() => {
    const total = companies.length
    const pending = companies.filter((c) => c.status === "PENDING_VERIFICATION").length
    const active = companies.filter((c) => c.status === "ACTIVE").length
    const suspended = companies.filter((c) => c.status === "SUSPENDED").length
    const rejected = companies.filter((c) => c.status === "REJECTED").length
    return { total, pending, active, suspended, rejected }
  }, [companies])

  // ── Delete handler ────────────────────────────────────────────────────────
  const handleDeleteConfirm = (id) => {
    dispatch(deleteCompany(id))
      .unwrap()
      .then(() => {
        toast.success("Company deleted successfully")
        setDeleteTarget(null)
      })
      .catch((err) => toast.error(err))
  }

  // ── Summary cards config ──────────────────────────────────────────────────
  const summaryCards = [
    {
      label: "Total Companies",
      value: stats.total,
      icon: Building2,
      color: "text-brand bg-blue-50",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Active & Verified",
      value: stats.active,
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Suspended",
      value: stats.suspended,
      icon: Ban,
      color: "text-red-600 bg-red-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Company Management
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Review, verify, and manage all registered companies
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-slate-200 text-slate-600 shadow-sm shrink-0"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${card.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 leading-tight">
                    {isLoading ? "—" : card.value}
                  </p>
                  <p className="text-xs text-slate-500">{card.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <CompanyFilters
        search={search}
        onSearch={setSearch}
        onStatusFilter={setStatusFilter}
        onTypeFilter={setTypeFilter}
        onIndustryFilter={setIndustryFilter}
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      {/* Table */}
      <CompanyTable
        companies={filtered}
        isLoading={isLoading}
        isActionLoading={isActionLoading}
        onViewDetail={(company) => setDetailCompany(company)}
        onDeleteConfirm={(company) => setDeleteTarget(company)}
      />

      {/* Pagination info */}
      {!isLoading && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing{" "}
            <span className="font-semibold text-slate-900">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-900">{companies.length}</span> companies
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200" disabled>
              Previous
            </Button>
            <Button className="h-8 text-xs bg-slate-900 hover:bg-slate-800" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail dialog */}
      <CompanyDetailDialog
        company={detailCompany}
        open={!!detailCompany}
        onClose={() => setDetailCompany(null)}
        isActionLoading={isActionLoading}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        company={deleteTarget}
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isActionLoading}
      />
    </div>
  )
}
