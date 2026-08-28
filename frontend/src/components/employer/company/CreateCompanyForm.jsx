import { useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { Building2, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { createCompany } from "@/store/company/companyThunk"

const COMPANY_SIZES  = ["MICRO", "SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]
const COMPANY_TYPES  = ["STARTUP", "PRIVATE", "PUBLIC_LISTED", "GOVERNMENT", "NON_PROFIT", "EDUCATIONAL", "SELF_EMPLOYED"]
const INDUSTRY_TYPES = [
  "TECHNOLOGY", "FINANCE_BANKING", "HEALTHCARE", "EDUCATION", "MANUFACTURING",
  "RETAIL_ECOMMERCE", "HOSPITALITY_TOURISM", "REAL_ESTATE", "MEDIA_ENTERTAINMENT",
  "TRANSPORTATION_LOGISTICS", "ENERGY_UTILITIES", "AGRICULTURE", "CONSULTING",
  "LEGAL", "TELECOMMUNICATIONS", "AUTOMOTIVE", "PHARMACEUTICAL", "CONSTRUCTION",
  "HUMAN_RESOURCES", "MARKETING_ADVERTISING", "OTHER",
]

function fmt(val) {
  return val.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

export default function CreateCompanyForm({ isActionLoading }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    name: "", companySize: "", companyType: "", industryType: "",
  })

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))
  const setSelect = (f) => (v) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.companySize || !form.companyType || !form.industryType) return
    dispatch(createCompany({
      name: form.name.trim(),
      companySize: form.companySize,
      companyType: form.companyType,
      industryType: form.industryType,
    }))
      .unwrap()
      .then(() => toast.success("Company created! Complete your profile below."))
      .catch(err => toast.error(err))
  }

  const canSubmit = form.name.trim() && form.companySize && form.companyType && form.industryType

  return (
    <div className="mx-auto max-w-lg">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-4">
          <Building2 className="h-8 w-8 text-brand" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Set up your company</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-sm">
          Create your company profile to start posting jobs and attracting top talent.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-600">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={form.name}
            onChange={set("name")}
            placeholder="Acme Corp"
            maxLength={150}
            required
            className="border-slate-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              Size <span className="text-red-500">*</span>
            </Label>
            <Select value={form.companySize} onValueChange={setSelect("companySize")}>
              <SelectTrigger className="border-slate-200 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map(s => <SelectItem key={s} value={s}>{fmt(s)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select value={form.companyType} onValueChange={setSelect("companyType")}>
              <SelectTrigger className="border-slate-200 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_TYPES.map(t => <SelectItem key={t} value={t}>{fmt(t)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              Industry <span className="text-red-500">*</span>
            </Label>
            <Select value={form.industryType} onValueChange={setSelect("industryType")}>
              <SelectTrigger className="border-slate-200 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {INDUSTRY_TYPES.map(i => <SelectItem key={i} value={i}>{fmt(i)}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full gap-2 bg-brand hover:bg-brand/90 mt-2"
          disabled={isActionLoading || !canSubmit}
        >
          {isActionLoading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Plus className="h-4 w-4" />}
          Create Company Profile
        </Button>
      </form>
    </div>
  )
}
