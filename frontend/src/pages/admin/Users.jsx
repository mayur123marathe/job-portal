import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Users as UsersIcon, UserCheck, Briefcase, UserX, AlertTriangle, Trash2 } from "lucide-react"

import {
  fetchAllUsers,
  suspendUser,
  activateUser,
  deleteUser,
  changeUserRole,
} from "@/store/adminUser/adminUserThunk"
import { clearErrors } from "@/store/adminUser/adminUserSlice"

import UserFilters from "@/components/admin/users/UserFilters"
import UserTable from "@/components/admin/users/UserTable"

export default function AdminUsers() {
  const dispatch = useDispatch()
  const { users, isLoading, isActionLoading, error, actionError } = useSelector(
    (state) => state.adminUser
  )

  // ── Filter state ─────────────────────────────────────────────────────────
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // ── Delete confirmation dialog ────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllUsers())
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

  // ── Client-side filtering ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...users]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      )
    }

    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter)
    if (statusFilter !== "all") list = list.filter((u) => u.status === statusFilter)

    return list
  }, [users, search, roleFilter, statusFilter])

  // ── Summary stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = users.length
    const seekers = users.filter((u) => u.role === "ROLE_JOB_SEEKER").length
    const employers = users.filter((u) => u.role === "ROLE_EMPLOYER").length
    const suspended = users.filter((u) => u.status === "SUSPENDED").length
    return { total, seekers, employers, suspended }
  }, [users])

  // ── Action handlers ───────────────────────────────────────────────────────
  const handleSuspend = (id) => {
    dispatch(suspendUser(id))
      .unwrap()
      .then(() => toast.success("User suspended successfully"))
      .catch((err) => toast.error(err))
  }

  const handleActivate = (id) => {
    dispatch(activateUser(id))
      .unwrap()
      .then(() => toast.success("User activated successfully"))
      .catch((err) => toast.error(err))
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    dispatch(deleteUser(deleteTarget.id))
      .unwrap()
      .then(() => {
        toast.success("User deleted successfully")
        setDeleteTarget(null)
      })
      .catch((err) => toast.error(err))
  }

  const handleChangeRole = (id, role) => {
    dispatch(changeUserRole({ id, role }))
      .unwrap()
      .then(() => toast.success("User role updated"))
      .catch((err) => toast.error(err))
  }

  // ── Summary cards config ──────────────────────────────────────────────────
  const summaryCards = [
    { label: "Total Users", value: stats.total, icon: UsersIcon, color: "text-brand bg-blue-50" },
    { label: "Job Seekers", value: stats.seekers, icon: UserCheck, color: "text-emerald-600 bg-emerald-50" },
    { label: "Employers", value: stats.employers, icon: Briefcase, color: "text-purple-600 bg-purple-50" },
    { label: "Suspended", value: stats.suspended, icon: UserX, color: "text-red-600 bg-red-50" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage and monitor all platform users</p>
        </div>
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
                  <p className="text-xl font-bold text-slate-900 leading-tight">
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
      <UserFilters
        onSearch={setSearch}
        onRoleFilter={setRoleFilter}
        onStatusFilter={setStatusFilter}
      />

      {/* Table */}
      <UserTable
        users={filtered}
        isLoading={isLoading}
        isActionLoading={isActionLoading}
        onSuspend={handleSuspend}
        onActivate={handleActivate}
        onDelete={(user) => setDeleteTarget(user)}
        onChangeRole={handleChangeRole}
      />

      {/* Pagination info */}
      {!isLoading && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing{" "}
            <span className="font-semibold text-slate-900">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-900">{users.length}</span> users
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200" disabled>
              Previous
            </Button>
            <Button className="h-8 text-xs bg-slate-900 hover:bg-slate-800" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200" disabled>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="text-center items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">Delete User</DialogTitle>
            <DialogDescription className="text-sm text-slate-500 text-center mt-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                "{deleteTarget?.fullName}"
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              className="flex-1 border-slate-200"
              onClick={() => setDeleteTarget(null)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
              onClick={handleDeleteConfirm}
              disabled={isActionLoading}
            >
              <Trash2 className="h-4 w-4" />
              {isActionLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
