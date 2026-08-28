import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function TagFormDialog({ open, onClose, onSubmit, isLoading, initialData }) {
  const isEdit = !!initialData
  const [name, setName] = useState("")

  useEffect(() => {
    if (open) setName(initialData?.name ?? "")
  }, [open, initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim() })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Tag" : "Add Tag"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="tag-name" className="text-xs font-semibold text-slate-700">
              Tag Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tag-name"
              placeholder="e.g. remote-friendly, startup, fintech"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              className="border-slate-200"
              required
              autoFocus
            />
            <p className="text-xs text-slate-400">{name.length}/60 characters</p>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1 border-slate-200" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-slate-900 hover:bg-slate-800" disabled={isLoading || !name.trim()}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Tag"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
