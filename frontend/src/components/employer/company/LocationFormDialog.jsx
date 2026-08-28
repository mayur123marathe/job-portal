import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

const EMPTY = { city: "", country: "", label: "", address: "", state: "", zipCode: "", isHeadquarter: false }

export default function LocationFormDialog({ open, onClose, onSubmit, isLoading, initialData }) {
  const isEdit = !!initialData
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (open) {
      setForm(initialData
        ? { city: initialData.city ?? "", country: initialData.country ?? "", label: initialData.label ?? "", address: initialData.address ?? "", state: initialData.state ?? "", zipCode: initialData.zipCode ?? "", isHeadquarter: initialData.isHeadquarter ?? false }
        : EMPTY
      )
    }
  }, [open, initialData])

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.city.trim() || !form.country.trim()) return
    onSubmit({
      city:          form.city.trim(),
      country:       form.country.trim(),
      label:         form.label.trim() || undefined,
      address:       form.address.trim() || undefined,
      state:         form.state.trim() || undefined,
      zipCode:       form.zipCode.trim() || undefined,
      isHeadquarter: form.isHeadquarter,
    })
  }

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Location" : "Add Location"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">City <span className="text-red-500">*</span></Label>
              <Input value={form.city} onChange={set("city")} placeholder="San Francisco" required className="border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Country <span className="text-red-500">*</span></Label>
              <Input value={form.country} onChange={set("country")} placeholder="United States" required className="border-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">State / Province</Label>
              <Input value={form.state} onChange={set("state")} placeholder="California" className="border-slate-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Zip Code</Label>
              <Input value={form.zipCode} onChange={set("zipCode")} placeholder="94105" className="border-slate-200" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Label</Label>
            <Input value={form.label} onChange={set("label")} placeholder="e.g. HQ Office, Branch" className="border-slate-200" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Full Address</Label>
            <Input value={form.address} onChange={set("address")} placeholder="123 Market St, Suite 400" className="border-slate-200" />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="is-hq"
              checked={form.isHeadquarter}
              onCheckedChange={v => setForm(f => ({ ...f, isHeadquarter: !!v }))}
            />
            <Label htmlFor="is-hq" className="text-sm text-slate-700 cursor-pointer select-none">
              Set as Headquarters
            </Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1 border-slate-200" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-brand hover:bg-brand/90" disabled={isLoading || !form.city.trim() || !form.country.trim()}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Location"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
