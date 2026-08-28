import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X, SlidersHorizontal } from "lucide-react"

// ── Enum options matching backend ─────────────────────────────────────────────

const JOB_TYPES = [
  { value: "FULL_TIME",   label: "Full-time" },
  { value: "PART_TIME",   label: "Part-time" },
  { value: "CONTRACT",    label: "Contract" },
  { value: "INTERNSHIP",  label: "Internship" },
  { value: "FREELANCE",   label: "Freelance" },
  { value: "REMOTE",      label: "Remote" },
]

const WORK_MODES = [
  { value: "REMOTE",  label: "Remote" },
  { value: "HYBRID",  label: "Hybrid" },
  { value: "ON_SITE", label: "On-site" },
]

const EXP_LEVELS = [
  { value: "ENTRY_LEVEL",   label: "Entry Level",  sub: "0–1 yr" },
  { value: "JUNIOR",        label: "Junior",       sub: "1–3 yrs" },
  { value: "MID_LEVEL",     label: "Mid Level",    sub: "3–5 yrs" },
  { value: "SENIOR_LEVEL",  label: "Senior",       sub: "5–8 yrs" },
  { value: "LEAD",          label: "Lead",         sub: "8+ yrs" },
  { value: "EXECUTIVE",     label: "Executive",    sub: "C-level" },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function toggle(arr, val) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

function fmtSalary(n) {
  if (n >= 100000) return `$${Math.round(n / 1000)}k`
  if (n >= 1000)   return `$${(n / 1000).toFixed(0)}k`
  return `$${n}`
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function JobFilters({ filters, setFilters, onReset }) {
  const { jobTypes, workModes, expLevels, minSalary, maxSalary } = filters

  const activeCount =
    jobTypes.length + workModes.length + expLevels.length +
    (minSalary > 0 ? 1 : 0) + (maxSalary < 500000 ? 1 : 0)

  const update = (key, val) => setFilters((f) => ({ ...f, [key]: val }))

  return (
    <Card className="sticky top-20 border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <CardTitle className="text-base">Filters</CardTitle>
            {activeCount > 0 && (
              <Badge className="bg-brand text-white text-xs px-1.5 py-0.5 h-5">
                {activeCount}
              </Badge>
            )}
          </div>
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs text-slate-500 hover:text-red-600">
              <X className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-0">

        {/* Job Type */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Job Type</h4>
          <div className="space-y-2">
            {JOB_TYPES.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox
                  id={`jt-${value}`}
                  checked={jobTypes.includes(value)}
                  onCheckedChange={() => update("jobTypes", toggle(jobTypes, value))}
                  className="data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Work Mode */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Work Mode</h4>
          <div className="space-y-2">
            {WORK_MODES.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox
                  id={`wm-${value}`}
                  checked={workModes.includes(value)}
                  onCheckedChange={() => update("workModes", toggle(workModes, value))}
                  className="data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Experience Level */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">Experience Level</h4>
          <div className="space-y-2">
            {EXP_LEVELS.map(({ value, label, sub }) => (
              <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox
                  id={`el-${value}`}
                  checked={expLevels.includes(value)}
                  onCheckedChange={() => update("expLevels", toggle(expLevels, value))}
                  className="data-[state=checked]:bg-brand data-[state=checked]:border-brand"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{label}</span>
                  <span className="text-xs text-slate-400">{sub}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Salary Range */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Salary Range</h4>
            <span className="text-xs text-brand font-medium">
              {fmtSalary(minSalary)} – {fmtSalary(maxSalary)}
            </span>
          </div>
          <Slider
            min={0}
            max={500000}
            step={10000}
            value={[minSalary, maxSalary]}
            onValueChange={([min, max]) => setFilters((f) => ({ ...f, minSalary: min, maxSalary: max }))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>$0</span>
            <span>$500k+</span>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
