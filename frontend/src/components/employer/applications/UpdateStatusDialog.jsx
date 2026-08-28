import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { updateApplicationStatus } from "@/store/application/applicationThunk"

const STATUSES = [
  { value: "PENDING",              label: "Pending",              color: "text-slate-600" },
  { value: "REVIEWING",            label: "Reviewing",            color: "text-brand" },
  { value: "SHORTLISTED",          label: "Shortlisted",          color: "text-indigo-600" },
  { value: "INTERVIEW_SCHEDULED",  label: "Interview Scheduled",  color: "text-violet-600" },
  { value: "REJECTED",             label: "Rejected",             color: "text-red-600" },
  { value: "HIRED",                label: "Hired",                color: "text-emerald-600" },
]

export default function UpdateStatusDialog({ open, onClose, applicationId, currentStatus }) {
  const dispatch = useDispatch()
  const isActionLoading = useSelector(s => s.application.isActionLoading)

  const [status, setStatus] = useState(currentStatus || "")
  const [note, setNote]     = useState("")

  const handleSubmit = () => {
    if (!status) return
    dispatch(updateApplicationStatus({ id: applicationId, status, note: note.trim() || undefined }))
      .unwrap()
      .then(() => { toast.success("Status updated"); onClose() })
      .catch(err => toast.error(err))
  }

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">Update Application Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">New Status <span className="text-red-500">*</span></Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-slate-200 text-sm">
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => (
                  <SelectItem key={s.value} value={s.value}>
                    <span className={s.color}>{s.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Internal Note <span className="text-slate-400">(optional)</span></Label>
            <Textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note about this decision..."
              rows={3}
              className="border-slate-200 resize-none text-sm"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1 border-slate-200" onClick={onClose} disabled={isActionLoading}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-brand hover:bg-brand/90"
              onClick={handleSubmit}
              disabled={isActionLoading || !status || status === currentStatus}
            >
              {isActionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
