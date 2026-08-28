import { useState } from "react"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { TEMPLATES } from "./ResumeTemplates"

const VISIBILITY_OPTIONS = [
  { value: "PRIVATE",   label: "Private",   desc: "Only visible when you apply" },
  { value: "PUBLIC",    label: "Public",    desc: "Discoverable by employers" },
  { value: "LINK_ONLY", label: "Link Only", desc: "Share via direct link" },
]

export default function CreateResumeDialog({ open, onClose, onSubmit, isLoading }) {
  const [title, setTitle]           = useState("")
  const [template, setTemplate]     = useState("PROFESSIONAL")
  const [visibility, setVisibility] = useState("PRIVATE")
  const [isDefault, setIsDefault]   = useState(false)

  const handleSubmit = () => {
    if (!title.trim()) { toast.error("Resume title is required"); return }
    onSubmit({ title: title.trim(), template, visibility, isDefault })
  }

  const handleClose = () => {
    setTitle(""); setTemplate("PROFESSIONAL"); setVisibility("PRIVATE"); setIsDefault(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl md:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand" />
            Create New Resume
          </DialogTitle>
          <DialogDescription>
            Choose a template and give your resume a title to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label>Resume Title <span className="text-red-500">*</span></Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Backend Engineer Resume, Product Manager Resume…"
              maxLength={150}
            />
            <p className="text-xs text-slate-400">{title.length}/150</p>
          </div>

          {/* Template picker */}
          <div>
            <Label className="mb-3 block">Choose a Template</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TEMPLATES.map((tmpl) => {
                const Prev = tmpl.preview
                const selected = template === tmpl.value
                return (
                  <button
                    key={tmpl.value}
                    type="button"
                    onClick={() => setTemplate(tmpl.value)}
                    className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
                      selected ? "border-brand shadow-md shadow-blue-100" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="h-28 overflow-hidden bg-slate-50 relative">
                      <div className="absolute inset-0">
                        <Prev />
                      </div>
                      {selected && (
                        <div className="absolute inset-0 bg-brand/10 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6 text-brand bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-800">{tmpl.label}</p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">{tmpl.tagline}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">✓ {tmpl.bestFor}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <Label className="mb-2 block">Visibility</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {VISIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVisibility(opt.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    visibility === opt.value ? "border-brand bg-blue-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className={`text-sm font-medium ${visibility === opt.value ? "text-blue-700" : "text-slate-800"}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Set as default */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            <div>
              <p className="text-sm font-medium text-slate-800">Set as default resume</p>
              <p className="text-xs text-slate-500">Auto-selected when applying without choosing a version</p>
            </div>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !title.trim()}
            className="bg-brand hover:bg-brand/90"
          >
            {isLoading ? "Creating…" : "Create Resume"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
