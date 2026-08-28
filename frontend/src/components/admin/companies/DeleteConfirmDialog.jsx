import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Trash2 } from "lucide-react"

export default function DeleteConfirmDialog({ company, open, onClose, onConfirm, isLoading }) {
  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="text-center items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900">Delete Company</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 text-center mt-1">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">"{company.name}"</span>? This action
            cannot be undone and will remove all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1 border-slate-200"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 gap-2"
            onClick={() => onConfirm(company.id)}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
