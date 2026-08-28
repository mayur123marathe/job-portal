import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { MapPin, Plus, Pencil, Trash2, Star, StarOff, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import LocationFormDialog from "./LocationFormDialog"
import { addLocation, updateLocation, removeLocation, setHeadquarter } from "@/store/company/companyThunk"

export default function LocationsSection({ company }) {
  const dispatch = useDispatch()
  const isActionLoading = useSelector(s => s.company.isActionLoading)

  const [addOpen, setAddOpen]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)   // location object
  const [deleteTarget, setDeleteTarget] = useState(null) // location id

  const locations = company.locations || []

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAdd = (payload) => {
    dispatch(addLocation({ companyId: company.id, ...payload }))
      .unwrap()
      .then(() => { toast.success("Location added"); setAddOpen(false) })
      .catch(err => toast.error(err))
  }

  const handleEdit = (payload) => {
    dispatch(updateLocation({ companyId: company.id, locationId: editTarget.id, ...payload }))
      .unwrap()
      .then(() => { toast.success("Location updated"); setEditTarget(null) })
      .catch(err => toast.error(err))
  }

  const handleDelete = () => {
    dispatch(removeLocation({ companyId: company.id, locationId: deleteTarget }))
      .unwrap()
      .then(() => { toast.success("Location removed"); setDeleteTarget(null) })
      .catch(err => toast.error(err))
  }

  const handleSetHQ = (locId) => {
    dispatch(setHeadquarter({ companyId: company.id, locationId: locId }))
      .unwrap()
      .then(() => toast.success("Headquarters updated"))
      .catch(err => toast.error(err))
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {locations.length === 0
            ? "No locations added yet."
            : `${locations.length} location${locations.length > 1 ? "s" : ""}`}
        </p>
        <Button size="sm" className="gap-1.5 bg-brand hover:bg-brand/90" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" /> Add Location
        </Button>
      </div>

      {/* Location cards */}
      {locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Building2 className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">No locations yet</p>
          <p className="mt-1 text-xs text-slate-400">Add your company's offices and branches</p>
          <Button size="sm" variant="outline" className="mt-4 gap-1.5" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add First Location
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {locations.map((loc) => (
            <LocationCard
              key={loc.id}
              loc={loc}
              isActionLoading={isActionLoading}
              onEdit={() => setEditTarget(loc)}
              onDelete={() => setDeleteTarget(loc.id)}
              onSetHQ={() => handleSetHQ(loc.id)}
            />
          ))}
        </div>
      )}

      {/* Add dialog */}
      <LocationFormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        isLoading={isActionLoading}
      />

      {/* Edit dialog */}
      <LocationFormDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        isLoading={isActionLoading}
        initialData={editTarget}
      />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={o => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Location?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the location from your company profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isActionLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ── Location Card ──────────────────────────────────────────────────────────

function LocationCard({ loc, isActionLoading, onEdit, onDelete, onSetHQ }) {
  const cityLine = [loc.city, loc.state, loc.country].filter(Boolean).join(", ")

  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition-colors">
      {/* HQ badge */}
      {loc.isHeadquarter && (
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
          <Star className="h-3 w-3" /> HQ
        </span>
      )}

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
          <MapPin className="h-4 w-4 text-brand" />
        </div>

        <div className="min-w-0 flex-1">
          {loc.label && (
            <p className="text-sm font-semibold text-slate-800 truncate">{loc.label}</p>
          )}
          <p className="text-sm text-slate-600 truncate">{cityLine}</p>
          {loc.address && (
            <p className="mt-0.5 text-xs text-slate-400 truncate">{loc.address}</p>
          )}
          {loc.zipCode && (
            <p className="mt-0.5 text-xs text-slate-400">ZIP: {loc.zipCode}</p>
          )}
        </div>
      </div>

      {/* Action row */}
      <div className="mt-3 flex items-center gap-2 pt-3 border-t border-slate-100">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-slate-500 hover:text-slate-900"
          onClick={onEdit}
          disabled={isActionLoading}
        >
          <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
        </Button>

        {!loc.isHeadquarter && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            onClick={onSetHQ}
            disabled={isActionLoading}
          >
            <Star className="h-3.5 w-3.5 mr-1" /> Set as HQ
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
          onClick={onDelete}
          disabled={isActionLoading}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
        </Button>
      </div>
    </div>
  )
}
