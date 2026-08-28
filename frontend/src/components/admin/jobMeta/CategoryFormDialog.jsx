import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export default function CategoryFormDialog({
  open, onClose, onSubmit, isLoading, initialData, rootCategories,
}) {
  const isEdit = !!initialData
  const [form, setForm] = useState({ name: "", description: "", iconUrl: "", parentId: "" })

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        iconUrl: initialData?.iconUrl ?? "",
        parentId: initialData?.parentId ? String(initialData.parentId) : "",
      })
    }
  }, [open, initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      iconUrl: form.iconUrl.trim() || undefined,
      parentId: form.parentId ? Number(form.parentId) : undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name" className="text-xs font-semibold text-slate-700">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cat-name"
              placeholder="e.g. Software Engineering"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              maxLength={100}
              className="border-slate-200"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc" className="text-xs font-semibold text-slate-700">
              Description
            </Label>
            <Textarea
              id="cat-desc"
              placeholder="Brief description..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              maxLength={500}
              rows={3}
              className="border-slate-200 resize-none text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-icon" className="text-xs font-semibold text-slate-700">
              Icon URL
            </Label>
            <Input
              id="cat-icon"
              placeholder="https://..."
              value={form.iconUrl}
              onChange={(e) => setForm((f) => ({ ...f, iconUrl: e.target.value }))}
              className="border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">Parent Category</Label>
            <Select
              value={form.parentId || "_none"}
              onValueChange={(v) => setForm((f) => ({ ...f, parentId: v === "_none" ? "" : v }))}
            >
              <SelectTrigger className="border-slate-200 text-sm">
                <SelectValue placeholder="Root level (no parent)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Root level (no parent)</SelectItem>
                {rootCategories
                  .filter((c) => c.id !== initialData?.id)
                  .map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-200"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-slate-900 hover:bg-slate-800"
              disabled={isLoading || !form.name.trim()}
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
