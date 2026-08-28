import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { updateCompany } from "@/store/company/companyThunk"

const COMPANY_SIZES   = ["MICRO", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]
const COMPANY_TYPES   = ["STARTUP", "PRIVATE", "PUBLIC_LISTED", "GOVERNMENT", "NON_PROFIT", "EDUCATIONAL", "SELF_EMPLOYED"]
const INDUSTRY_TYPES  = [
  "TECHNOLOGY", "FINANCE_BANKING", "HEALTHCARE", "EDUCATION", "MANUFACTURING",
  "RETAIL_ECOMMERCE", "HOSPITALITY_TOURISM", "REAL_ESTATE", "MEDIA_ENTERTAINMENT",
  "TRANSPORTATION_LOGISTICS", "ENERGY_UTILITIES", "AGRICULTURE", "CONSULTING",
  "LEGAL", "TELECOMMUNICATIONS", "AUTOMOTIVE", "PHARMACEUTICAL", "CONSTRUCTION",
  "HUMAN_RESOURCES", "MARKETING_ADVERTISING", "OTHER",
]

function fmt(val) {
  return val.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

export default function BasicInfoForm({ company, isActionLoading }) {
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    name: "", tagline: "", description: "",
    logoUrl: "", coverImageUrl: "", website: "",
    email: "", phone: "", foundedYear: "",
    companySize: "", companyType: "", industryType: "",
    registrationNumber: "",
  })

  // Sync form when company loads
  useEffect(() => {
    if (company) {
      setForm({
        name:               company.name ?? "",
        tagline:            company.tagline ?? "",
        description:        company.description ?? "",
        logoUrl:            company.logoUrl ?? "",
        coverImageUrl:      company.coverImageUrl ?? "",
        website:            company.website ?? "",
        email:              company.email ?? "",
        phone:              company.phone ?? "",
        foundedYear:        company.foundedYear ? String(company.foundedYear) : "",
        companySize:        company.companySize ?? "",
        companyType:        company.companyType ?? "",
        industryType:       company.industryType ?? "",
        registrationNumber: company.registrationNumber ?? "",
      })
    }
  }, [company])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const setSelect = (field) => (val) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      name:               form.name.trim(),
      tagline:            form.tagline.trim() || undefined,
      description:        form.description.trim() || undefined,
      logoUrl:            form.logoUrl.trim() || undefined,
      coverImageUrl:      form.coverImageUrl.trim() || undefined,
      website:            form.website.trim() || undefined,
      email:              form.email.trim() || undefined,
      phone:              form.phone.trim() || undefined,
      foundedYear:        form.foundedYear ? Number(form.foundedYear) : undefined,
      companySize:        form.companySize || undefined,
      companyType:        form.companyType || undefined,
      industryType:       form.industryType || undefined,
      registrationNumber: form.registrationNumber.trim() || undefined,
      // Preserve existing social links
      socialLinks: (company.socialLinks || []).map(sl => ({ platform: sl.platform, url: sl.url })),
    }
    dispatch(updateCompany({ id: company.id, ...payload }))
      .unwrap()
      .then(() => toast.success("Company profile updated"))
      .catch(err => toast.error(err))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ── Identity ──────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
          Identity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Company Name <span className="text-red-500">*</span></Label>
            <Input value={form.name} onChange={set("name")} placeholder="Acme Corp" maxLength={150} required className="border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Tagline</Label>
            <Input value={form.tagline} onChange={set("tagline")} placeholder="Building the future..." maxLength={200} className="border-slate-200" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">Description</Label>
          <Textarea value={form.description} onChange={set("description")} placeholder="Tell candidates about your company, culture, and mission..." rows={4} className="border-slate-200 resize-none text-sm" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Logo URL</Label>
            <Input value={form.logoUrl} onChange={set("logoUrl")} placeholder="https://..." className="border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Cover Image URL</Label>
            <Input value={form.coverImageUrl} onChange={set("coverImageUrl")} placeholder="https://..." className="border-slate-200" />
          </div>
        </div>
      </section>

      {/* ── Contact & Web ─────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
          Contact & Web
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Website</Label>
            <Input value={form.website} onChange={set("website")} placeholder="https://acme.com" className="border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Company Email</Label>
            <Input type="email" value={form.email} onChange={set("email")} placeholder="hr@acme.com" className="border-slate-200" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Phone</Label>
            <Input value={form.phone} onChange={set("phone")} placeholder="+1 234 567 890" className="border-slate-200" />
          </div>
        </div>
      </section>

      {/* ── Company Details ───────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-100 pb-2">
          Company Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Company Size <span className="text-red-500">*</span></Label>
            <Select value={form.companySize} onValueChange={setSelect("companySize")} required>
              <SelectTrigger className="border-slate-200 text-sm w-full"><SelectValue placeholder="Select size" /></SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map(s => <SelectItem key={s} value={s}>{fmt(s)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Company Type <span className="text-red-500">*</span></Label>
            <Select value={form.companyType} onValueChange={setSelect("companyType")} required>
              <SelectTrigger className="border-slate-200 text-sm w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {COMPANY_TYPES.map(t => <SelectItem key={t} value={t}>{fmt(t)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Industry <span className="text-red-500">*</span></Label>
            <Select value={form.industryType} onValueChange={setSelect("industryType")} required>
              <SelectTrigger className="border-slate-200 text-sm w-full"><SelectValue placeholder="Select industry" /></SelectTrigger>
              <SelectContent className="max-h-60">
                {INDUSTRY_TYPES.map(i => <SelectItem key={i} value={i}>{fmt(i)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Founded Year</Label>
            <Input type="number" min={1800} max={2100} value={form.foundedYear} onChange={set("foundedYear")} placeholder="2015" className="border-slate-200" />
          </div>
         
        </div>
        
      </section>

      <div className="flex justify-end pt-2">
        <Button type="submit" className="gap-2 bg-brand hover:bg-brand/90" disabled={isActionLoading || !form.name.trim() || !form.companySize || !form.companyType || !form.industryType}>
          {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </form>
  )
}
