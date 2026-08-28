import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { Plus, Trash2, Save, Loader2, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { updateCompany } from "@/store/company/companyThunk"

const PLATFORMS = [
  "LINKEDIN", "TWITTER", "FACEBOOK", "INSTAGRAM",
  "GITHUB", "YOUTUBE", "WEBSITE", "OTHER",
]

const PLATFORM_COLORS = {
  LINKEDIN:  "bg-blue-50 text-blue-700 border-blue-200",
  TWITTER:   "bg-sky-50 text-sky-700 border-sky-200",
  FACEBOOK:  "bg-indigo-50 text-indigo-700 border-indigo-200",
  INSTAGRAM: "bg-pink-50 text-pink-700 border-pink-200",
  GITHUB:    "bg-slate-100 text-slate-700 border-slate-200",
  YOUTUBE:   "bg-red-50 text-red-700 border-red-200",
  WEBSITE:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  OTHER:     "bg-orange-50 text-orange-700 border-orange-200",
}

function fmt(val) {
  return val.charAt(0) + val.slice(1).toLowerCase()
}

function emptyLink() {
  return { platform: "", url: "" }
}

export default function SocialLinksForm({ company, isActionLoading }) {
  const dispatch = useDispatch()
  const [links, setLinks] = useState([])

  useEffect(() => {
    if (company?.socialLinks) {
      setLinks(
        company.socialLinks.length > 0
          ? company.socialLinks.map(sl => ({ platform: sl.platform, url: sl.url }))
          : []
      )
    }
  }, [company])

  const addLink = () => setLinks(prev => [...prev, emptyLink()])

  const removeLink = (idx) => setLinks(prev => prev.filter((_, i) => i !== idx))

  const setField = (idx, field) => (val) =>
    setLinks(prev => prev.map((l, i) => i === idx ? { ...l, [field]: val } : l))

  const handleUrlChange = (idx) => (e) =>
    setLinks(prev => prev.map((l, i) => i === idx ? { ...l, url: e.target.value } : l))

  const handleSave = () => {
    const valid = links.filter(l => l.platform && l.url.trim())
    const payload = {
      // Preserve all basic company fields
      name:               company.name,
      tagline:            company.tagline || undefined,
      description:        company.description || undefined,
      logoUrl:            company.logoUrl || undefined,
      coverImageUrl:      company.coverImageUrl || undefined,
      website:            company.website || undefined,
      email:              company.email || undefined,
      phone:              company.phone || undefined,
      foundedYear:        company.foundedYear || undefined,
      companySize:        company.companySize || undefined,
      companyType:        company.companyType || undefined,
      industryType:       company.industryType || undefined,
      registrationNumber: company.registrationNumber || undefined,
      socialLinks: valid.map(l => ({ platform: l.platform, url: l.url.trim() })),
    }
    dispatch(updateCompany({ id: company.id, ...payload }))
      .unwrap()
      .then(() => toast.success("Social links saved"))
      .catch(err => toast.error(err))
  }

  // Used platforms (for duplicate-warning only — allow repeats, just inform)
  const usedPlatforms = links.map(l => l.platform).filter(Boolean)

  return (
    <div className="space-y-5">
      {links.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <Link2 className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">No social links yet</p>
          <p className="mt-1 text-xs text-slate-400">Add links to your company's social profiles</p>
          <Button size="sm" variant="outline" className="mt-4 gap-1.5" onClick={addLink}>
            <Plus className="h-4 w-4" /> Add First Link
          </Button>
        </div>
      )}

      {links.map((link, idx) => (
        <div key={idx} className="flex items-end gap-3">
          {/* Platform select */}
          <div className="w-44 space-y-1.5 shrink-0">
            {idx === 0 && (
              <Label className="text-xs font-semibold text-slate-600">Platform</Label>
            )}
            <Select value={link.platform} onValueChange={setField(idx, "platform")}>
              <SelectTrigger className="border-slate-200 text-sm">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map(p => (
                  <SelectItem key={p} value={p}>
                    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold border ${PLATFORM_COLORS[p] || ""}`}>
                      {fmt(p)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* URL input */}
          <div className="flex-1 space-y-1.5">
            {idx === 0 && (
              <Label className="text-xs font-semibold text-slate-600">URL</Label>
            )}
            <Input
              value={link.url}
              onChange={handleUrlChange(idx)}
              placeholder="https://..."
              className="border-slate-200"
            />
          </div>

          {/* Remove */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50 shrink-0"
            onClick={() => removeLink(idx)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* Add row button (when links exist) */}
      {links.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 border-dashed border-slate-300 text-slate-500 hover:text-slate-700"
          onClick={addLink}
        >
          <Plus className="h-4 w-4" /> Add Another
        </Button>
      )}

      {/* Save */}
      {links.length > 0 && (
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button
            onClick={handleSave}
            className="gap-2 bg-brand hover:bg-brand/90"
            disabled={isActionLoading}
          >
            {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Links
          </Button>
        </div>
      )}
    </div>
  )
}
