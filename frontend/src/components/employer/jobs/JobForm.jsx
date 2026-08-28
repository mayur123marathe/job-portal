import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  Save, Send, ArrowLeft, Loader2, Briefcase, MapPin,
  DollarSign, Settings, Tag, Layers, Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { createJob, updateJob, publishJob } from "@/store/job/jobThunk"
import { fetchCategories, fetchSkills, fetchTags } from "@/store/jobMeta/jobMetaThunk"
import { generateJobDescription, generateJobRequirements, suggestSalary, recommendJobSkills, generateJobResponsibilities, generateJobBenefits, recommendJobTags } from "@/store/ai/aiThunk"
import { clearJobDescription, clearJobRequirements, clearSalarySuggestion, clearRecommendedSkills, clearJobResponsibilities, clearJobBenefits, clearRecommendedTags } from "@/store/ai/aiSlice"
import MultiSelect from "./MultiSelect"

// ── Enum constants ─────────────────────────────────────────────────────────────

const JOB_TYPES        = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE", "REMOTE"]
const WORK_MODES       = ["REMOTE", "HYBRID", "ON_SITE"]
const EXP_LEVELS       = ["ENTRY_LEVEL", "JUNIOR", "MID_LEVEL", "SENIOR_LEVEL", "LEAD", "EXECUTIVE"]
const SALARY_PERIODS   = ["HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]
const CURRENCIES       = ["USD", "INR", "EUR", "GBP", "CAD", "AUD", "SGD"]

function fmt(val) {
  return val.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

// ── Empty form ─────────────────────────────────────────────────────────────────

const EMPTY = {
  title: "", description: "", requirements: "", responsibilities: "", benefits: "",
  categoryId: "",
  skillIds: [], tagIds: [],
  address: "", city: "", state: "", country: "", zipCode: "",
  minSalary: "", maxSalary: "", currency: "USD",
  salaryPeriod: "", salaryNegotiable: false, salaryDisclosed: true,
  jobType: "", workMode: "", experienceLevel: "",
  openings: 1,
  applicationDeadline: "", expiresAt: "",
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildPayload(form) {
  return {
    title:               form.title.trim(),
    description:         form.description.trim(),
    requirements:        form.requirements.trim() || undefined,
    responsibilities:    form.responsibilities.trim() || undefined,
    benefits:            form.benefits.trim() || undefined,
    categoryId:          Number(form.categoryId),
    skillIds:            form.skillIds.length ? form.skillIds : undefined,
    tagIds:              form.tagIds.length ? form.tagIds : undefined,
    address:             form.address.trim() || undefined,
    city:                form.city.trim() || undefined,
    state:               form.state.trim() || undefined,
    country:             form.country.trim() || undefined,
    zipCode:             form.zipCode.trim() || undefined,
    minSalary:           form.minSalary !== "" ? Number(form.minSalary) : undefined,
    maxSalary:           form.maxSalary !== "" ? Number(form.maxSalary) : undefined,
    currency:            form.currency || undefined,
    salaryPeriod:        form.salaryPeriod || undefined,
    salaryNegotiable:    form.salaryNegotiable || undefined,
    salaryDisclosed:     form.salaryDisclosed,
    jobType:             form.jobType,
    workMode:            form.workMode,
    experienceLevel:     form.experienceLevel,
    openings:            Number(form.openings) || 1,
    applicationDeadline: form.applicationDeadline || undefined,
    expiresAt:           form.expiresAt || undefined,
  }
}

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <Icon className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

// ── Field helpers ──────────────────────────────────────────────────────────────

function Field({ label, required, children, hint, action }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between min-h-5">
        <Label className="text-xs font-semibold text-slate-600">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {action}
      </div>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
    </div>
  )
}

function AiButton({ onClick, loading, label, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {loading
        ? <Loader2 className="h-3 w-3 animate-spin" />
        : <Sparkles className="h-3 w-3" />}
      {label}
    </button>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

/**
 * Props:
 *   initialJob  — JobResponse for edit mode, null for create
 *   isEdit      — boolean
 */
export default function JobForm({ initialJob = null, isEdit = false }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isActionLoading } = useSelector(s => s.job)
  const { categories, skills, tags, isLoadingCategories, isLoadingSkills, isLoadingTags } = useSelector(s => s.jobMeta)
  const {
    jobDescription, jobRequirements, salarySuggestion, recommendedSkills,
    jobResponsibilities, jobBenefits, recommendedTags,
    isGeneratingJobDescription, isGeneratingJobRequirements, isSuggestingSalary, isRecommendingSkills,
    isGeneratingJobResponsibilities, isGeneratingJobBenefits, isRecommendingTags,
  } = useSelector(s => s.ai)

  const [form, setForm] = useState(EMPTY)

  // Fetch meta on mount
  useEffect(() => {
    if (!categories.length) dispatch(fetchCategories())
    if (!skills.length)     dispatch(fetchSkills())
    if (!tags.length)       dispatch(fetchTags())
  }, [])

  // Pre-populate for edit
  useEffect(() => {
    if (initialJob) {
      setForm({
        title:               initialJob.title ?? "",
        description:         initialJob.description ?? "",
        requirements:        initialJob.requirements ?? "",
        responsibilities:    initialJob.responsibilities ?? "",
        benefits:            initialJob.benefits ?? "",
        categoryId:          initialJob.category?.id ? String(initialJob.category.id) : "",
        skillIds:            initialJob.skills ? initialJob.skills.map(s => s.id) : [],
        tagIds:              initialJob.tags ? initialJob.tags.map(t => t.id) : [],
        address:             initialJob.address ?? "",
        city:                initialJob.city ?? "",
        state:               initialJob.state ?? "",
        country:             initialJob.country ?? "",
        zipCode:             initialJob.zipCode ?? "",
        minSalary:           initialJob.minSalary != null ? String(initialJob.minSalary) : "",
        maxSalary:           initialJob.maxSalary != null ? String(initialJob.maxSalary) : "",
        currency:            initialJob.currency ?? "USD",
        salaryPeriod:        initialJob.salaryPeriod ?? "",
        salaryNegotiable:    initialJob.salaryNegotiable ?? false,
        salaryDisclosed:     initialJob.salaryDisclosed ?? true,
        jobType:             initialJob.jobType ?? "",
        workMode:            initialJob.workMode ?? "",
        experienceLevel:     initialJob.experienceLevel ?? "",
        openings:            initialJob.openings ?? 1,
        applicationDeadline: initialJob.applicationDeadline ?? "",
        expiresAt:           initialJob.expiresAt ?? "",
      })
    }
  }, [initialJob])

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))
  const setVal = (f) => (v) => setForm(p => ({ ...p, [f]: v }))

  // ── AI helpers ───────────────────────────────────────────────────────────────

  const selectedSkillNames = (skillOpts) =>
    skillOpts.filter(s => form.skillIds.includes(s.id)).map(s => s.name).join(", ")

  const handleGenerateDescription = () => {
    if (!form.title.trim()) { toast.error("Enter a job title first"); return }
    const categoryName = categories.find(c => String(c.id) === form.categoryId)?.name
    dispatch(generateJobDescription({
      title:           form.title,
      skills:          selectedSkillNames(skills.map(s => ({ id: s.id, name: s.name }))) || undefined,
      experienceLevel: form.experienceLevel || undefined,
      jobType:         form.jobType || undefined,
      workMode:        form.workMode || undefined,
      category:        categoryName || undefined,
    }))
  }

  const handleAutoFillRequirements = () => {
    if (!form.title.trim()) { toast.error("Enter a job title first"); return }
    const categoryName = categories.find(c => String(c.id) === form.categoryId)?.name
    dispatch(generateJobRequirements({ title: form.title, category: categoryName }))
  }

  const handleSuggestSalary = () => {
    if (!form.title.trim()) { toast.error("Enter a job title first"); return }
    const skillNames = selectedSkillNames(skills.map(s => ({ id: s.id, name: s.name })))
    dispatch(suggestSalary({
      title:           form.title,
      skills:          skillNames || undefined,
      experienceLevel: form.experienceLevel || undefined,
      jobType:         form.jobType || undefined,
      location:        form.city || form.country || undefined,
    }))
  }

  const handleRecommendSkills = () => {
    if (!form.title.trim()) { toast.error("Enter a job title first"); return }
    dispatch(recommendJobSkills({
      title:       form.title,
      description: form.description || undefined,
    }))
  }

  const handleAutoFillResponsibilities = () => {
    if (!form.title.trim()) { toast.error("Enter a job title first"); return }
    const categoryName = categories.find(c => String(c.id) === form.categoryId)?.name
    dispatch(generateJobResponsibilities({ title: form.title, category: categoryName }))
  }

  const handleAutoFillBenefits = () => {
    if (!form.title.trim()) { toast.error("Enter a job title first"); return }
    const categoryName = categories.find(c => String(c.id) === form.categoryId)?.name
    dispatch(generateJobBenefits({ title: form.title, category: categoryName, jobType: form.jobType || undefined }))
  }

  const handleRecommendTags = () => {
    if (!form.title.trim()) { toast.error("Enter a job title first"); return }
    dispatch(recommendJobTags({ title: form.title, description: form.description || undefined }))
  }

  // ── Apply AI results to form ─────────────────────────────────────────────────

  useEffect(() => {
    if (!jobDescription) return
    setForm(f => ({ ...f, description: jobDescription.content }))
    dispatch(clearJobDescription())
    toast.success("Description generated!")
  }, [jobDescription])

  useEffect(() => {
    if (!jobRequirements) return
    const content = jobRequirements.content
    // Heuristic split: look for a "Responsibilities" heading inside the content
    const splitIdx = content.search(/responsibilities?:/i)
    if (splitIdx > 0) {
      setForm(f => ({
        ...f,
        requirements:     content.substring(0, splitIdx).replace(/requirements?:/i, "").trim(),
        responsibilities: content.substring(splitIdx).replace(/responsibilities?:/i, "").trim(),
      }))
    } else {
      setForm(f => ({ ...f, requirements: content }))
    }
    dispatch(clearJobRequirements())
    toast.success("Requirements auto-filled!")
  }, [jobRequirements])

  useEffect(() => {
    if (!salarySuggestion) return
    setForm(f => ({
      ...f,
      minSalary:    salarySuggestion.minSalary != null ? String(salarySuggestion.minSalary) : f.minSalary,
      maxSalary:    salarySuggestion.maxSalary != null ? String(salarySuggestion.maxSalary) : f.maxSalary,
      currency:     salarySuggestion.currency  || f.currency,
      salaryPeriod: salarySuggestion.period    || f.salaryPeriod,
    }))
    if (salarySuggestion.marketInsight) toast.info(salarySuggestion.marketInsight)
    dispatch(clearSalarySuggestion())
  }, [salarySuggestion])

  useEffect(() => {
    if (!recommendedSkills || !skills.length) return
    const names = recommendedSkills.content
      .split(/[,\n•*\-]/)
      .map(s => s.trim().replace(/^\d+\.\s*/, "").toLowerCase())
      .filter(Boolean)
    const skillOpts = skills.map(s => ({ id: s.id, name: s.name }))
    const matched = skillOpts.filter(s =>
      names.some(n => s.name.toLowerCase() === n || s.name.toLowerCase().includes(n) || n.includes(s.name.toLowerCase()))
    )
    const newIds = matched.map(s => s.id).filter(id => !form.skillIds.includes(id))
    if (newIds.length) {
      setForm(f => ({ ...f, skillIds: [...f.skillIds, ...newIds] }))
      toast.success(`${newIds.length} skill${newIds.length > 1 ? "s" : ""} recommended and added!`)
    } else {
      toast.info("No new matching skills found")
    }
    dispatch(clearRecommendedSkills())
  }, [recommendedSkills])

  useEffect(() => {
    if (!jobResponsibilities) return
    setForm(f => ({ ...f, responsibilities: jobResponsibilities.content }))
    dispatch(clearJobResponsibilities())
    toast.success("Responsibilities auto-filled!")
  }, [jobResponsibilities])

  useEffect(() => {
    if (!jobBenefits) return
    setForm(f => ({ ...f, benefits: jobBenefits.content }))
    dispatch(clearJobBenefits())
    toast.success("Benefits auto-filled!")
  }, [jobBenefits])

  useEffect(() => {
    if (!recommendedTags || !tags.length) return
    const names = recommendedTags.content
      .split(/[,\n•*\-]/)
      .map(t => t.trim().replace(/^\d+\.\s*/, "").toLowerCase())
      .filter(Boolean)
    const tagOpts = tags.map(t => ({ id: t.id, name: t.name }))
    const matched = tagOpts.filter(t =>
      names.some(n => t.name.toLowerCase() === n || t.name.toLowerCase().includes(n) || n.includes(t.name.toLowerCase()))
    )
    const newIds = matched.map(t => t.id).filter(id => !form.tagIds.includes(id))
    if (newIds.length) {
      setForm(f => ({ ...f, tagIds: [...f.tagIds, ...newIds] }))
      toast.success(`${newIds.length} tag${newIds.length > 1 ? "s" : ""} recommended and added!`)
    } else {
      toast.info("No new matching tags found")
    }
    dispatch(clearRecommendedTags())
  }, [recommendedTags])

  const canSubmit = form.title.trim() && form.description.trim() &&
                    form.categoryId && form.jobType && form.workMode && form.experienceLevel

  // ── Submit handlers ─────────────────────────────────────────────────────────

  const handleSaveDraft = async () => {
    if (!canSubmit) { toast.error("Fill required fields"); return }
    try {
      if (isEdit) {
        await dispatch(updateJob({ id: initialJob.id, ...buildPayload(form) })).unwrap()
        toast.success("Job updated")
        navigate("/employer/jobs")
      } else {
        await dispatch(createJob(buildPayload(form))).unwrap()
        toast.success("Job saved as draft")
        navigate("/employer/jobs")
      }
    } catch (err) {
      toast.error(err)
    }
  }

  const handlePublish = async () => {
    if (!canSubmit) { toast.error("Fill required fields"); return }
    try {
      let job
      if (isEdit) {
        job = await dispatch(updateJob({ id: initialJob.id, ...buildPayload(form) })).unwrap()
      } else {
        job = await dispatch(createJob(buildPayload(form))).unwrap()
      }
      if (job.status !== "OPEN") {
        await dispatch(publishJob(job.id)).unwrap()
      }
      toast.success(isEdit ? "Job updated and published" : "Job published!")
      navigate("/employer/jobs")
    } catch (err) {
      toast.error(err)
    }
  }

  // ── Category options ────────────────────────────────────────────────────────
  const categoryOptions = categories.map(c => ({ id: c.id, name: c.name }))
  const skillOptions    = skills.map(s => ({ id: s.id, name: s.name }))
  const tagOptions      = tags.map(t => ({ id: t.id, name: t.name }))





  console.log("categories",categories, "skill",skills, "tags", tags)
  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* ── Left: main form ─────────────────────────────────────────────────── */}
      <div className="xl:col-span-2 space-y-5">

        {/* Job Details */}
        <Section icon={Briefcase} title="Job Details">
          <Field label="Job Title" required>
            <Input
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Senior React Developer"
              maxLength={200}
              className="border-slate-200"
            />
          </Field>
          <Field
            label="Description"
            required
            action={
              <AiButton
                onClick={handleGenerateDescription}
                loading={isGeneratingJobDescription}
                label="Generate with AI"
                disabled={!form.title.trim()}
              />
            }
          >
            <Textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Describe the role, culture, and what makes this position exciting..."
              rows={5}
              className="border-slate-200 resize-none text-sm"
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Requirements"
              action={
                <AiButton
                  onClick={handleAutoFillRequirements}
                  loading={isGeneratingJobRequirements}
                  label="Auto-fill from Title"
                  disabled={!form.title.trim()}
                />
              }
            >
              <Textarea
                value={form.requirements}
                onChange={set("requirements")}
                placeholder="List qualifications, education, certifications..."
                rows={4}
                className="border-slate-200 resize-none text-sm"
              />
            </Field>
            <Field
              label="Responsibilities"
              action={
                <AiButton
                  onClick={handleAutoFillResponsibilities}
                  loading={isGeneratingJobResponsibilities}
                  label="Auto-fill from Title"
                  disabled={!form.title.trim()}
                />
              }
            >
              <Textarea
                value={form.responsibilities}
                onChange={set("responsibilities")}
                placeholder="Key duties and day-to-day tasks..."
                rows={4}
                className="border-slate-200 resize-none text-sm"
              />
            </Field>
          </div>
          <Field
            label="Benefits"
            action={
              <AiButton
                onClick={handleAutoFillBenefits}
                loading={isGeneratingJobBenefits}
                label="Auto-fill from Title"
                disabled={!form.title.trim()}
              />
            }
          >
            <Textarea
              value={form.benefits}
              onChange={set("benefits")}
              placeholder="Health insurance, equity, remote work, gym membership..."
              rows={3}
              className="border-slate-200 resize-none text-sm"
            />
          </Field>
        </Section>

        {/* Classification */}
        <Section icon={Layers} title="Classification">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category" required>
              <Select value={form.categoryId} onValueChange={setVal("categoryId")}>
                <SelectTrigger className="border-slate-200 text-sm w-full">
                  <SelectValue placeholder={isLoadingCategories ? "Loading..." : "Select category"} />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {categoryOptions.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Experience Level" required>
              <Select value={form.experienceLevel} onValueChange={setVal("experienceLevel")}>
                <SelectTrigger className="border-slate-200 text-sm w-full">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {EXP_LEVELS.map(l => (
                    <SelectItem key={l} value={l}>{fmt(l)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Job Type" required>
              <Select value={form.jobType} onValueChange={setVal("jobType")}>
                <SelectTrigger className="border-slate-200 text-sm w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{fmt(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Work Mode" required>
              <Select value={form.workMode} onValueChange={setVal("workMode")}>
                <SelectTrigger className="border-slate-200 text-sm w-full">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {WORK_MODES.map(m => (
                    <SelectItem key={m} value={m}>{fmt(m)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Number of Openings">
            <Input
              type="number"
              min={1}
              value={form.openings}
              onChange={set("openings")}
              className="border-slate-200 w-full"
            />
          </Field>
        </Section>

        {/* Skills & Tags */}
        <Section icon={Tag} title="Skills & Tags">
          <Field
            label="Required Skills"
            hint="Select skills from the library — candidates will be matched against these"
            action={
              <AiButton
                onClick={handleRecommendSkills}
                loading={isRecommendingSkills}
                label="Recommend"
                disabled={!form.title.trim()}
              />
            }
          >
            <MultiSelect
              options={skillOptions}
              selectedIds={form.skillIds}
              onChange={setVal("skillIds")}
              placeholder={isLoadingSkills ? "Loading skills..." : "Select skills..."}
            />
          </Field>
          <Field
            label="Tags"
            hint="Keywords that improve job discoverability"
            action={
              <AiButton
                onClick={handleRecommendTags}
                loading={isRecommendingTags}
                label="Recommend"
                disabled={!form.title.trim()}
              />
            }
          >
            <MultiSelect
              options={tagOptions}
              selectedIds={form.tagIds}
              onChange={setVal("tagIds")}
              placeholder={isLoadingTags ? "Loading tags..." : "Add tags..."}
            />
          </Field>
        </Section>

        {/* Location */}
        <Section icon={MapPin} title="Location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="City">
              <Input value={form.city} onChange={set("city")} placeholder="San Francisco" className="border-slate-200" />
            </Field>
            <Field label="State / Province">
              <Input value={form.state} onChange={set("state")} placeholder="California" className="border-slate-200" />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Country">
              <Input value={form.country} onChange={set("country")} placeholder="United States" className="border-slate-200" />
            </Field>
            <Field label="Zip Code">
              <Input value={form.zipCode} onChange={set("zipCode")} placeholder="94105" className="border-slate-200" />
            </Field>
          </div>
          <Field label="Full Address">
            <Input value={form.address} onChange={set("address")} placeholder="123 Market St, Suite 400" className="border-slate-200" />
          </Field>
        </Section>

        {/* Salary */}
        <Section icon={DollarSign} title="Salary & Compensation">
          <div className="flex items-center justify-between rounded-lg bg-violet-50 border border-violet-100 px-3 py-2">
            <p className="text-xs text-violet-700">
              AI can estimate a competitive salary range for this role.
            </p>
            <AiButton
              onClick={handleSuggestSalary}
              loading={isSuggestingSalary}
              label="Suggest Salary"
              disabled={!form.title.trim()}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Min Salary">
              <Input type="number" min={0} value={form.minSalary} onChange={set("minSalary")} placeholder="50000" className="border-slate-200" />
            </Field>
            <Field label="Max Salary">
              <Input type="number" min={0} value={form.maxSalary} onChange={set("maxSalary")} placeholder="80000" className="border-slate-200" />
            </Field>
            <Field label="Currency">
              <Select value={form.currency} onValueChange={setVal("currency")}>
                <SelectTrigger className="border-slate-200 text-sm w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Salary Period">
            <Select value={form.salaryPeriod} onValueChange={setVal("salaryPeriod")}>
              <SelectTrigger className="border-slate-200 text-sm w-full">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {SALARY_PERIODS.map(p => <SelectItem key={p} value={p}>{fmt(p)}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="negotiable"
                checked={form.salaryNegotiable}
                onCheckedChange={v => setForm(f => ({ ...f, salaryNegotiable: !!v }))}
              />
              <Label htmlFor="negotiable" className="text-sm text-slate-700 cursor-pointer select-none">
                Salary is negotiable
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="disclosed"
                checked={form.salaryDisclosed}
                onCheckedChange={v => setForm(f => ({ ...f, salaryDisclosed: !!v }))}
              />
              <Label htmlFor="disclosed" className="text-sm text-slate-700 cursor-pointer select-none">
                Show salary on listing (uncheck to display "Competitive")
              </Label>
            </div>
          </div>
        </Section>

        {/* Posting Settings */}
        <Section icon={Settings} title="Posting Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Application Deadline" hint="Last date to apply">
              <Input
                type="date"
                value={form.applicationDeadline}
                onChange={set("applicationDeadline")}
                className="border-slate-200"
              />
            </Field>
            <Field label="Posting Expires At" hint="Job auto-expires on this date">
              <Input
                type="date"
                value={form.expiresAt}
                onChange={set("expiresAt")}
                className="border-slate-200"
              />
            </Field>
          </div>
        </Section>
      </div>

      {/* ── Right: action sidebar ────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="sticky top-6 space-y-4">

          {/* Publish card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800">
              {isEdit ? "Save Changes" : "Publish Job"}
            </h3>

            <Button
              className="w-full gap-2 bg-brand hover:bg-brand/90"
              onClick={handlePublish}
              disabled={isActionLoading || !canSubmit}
            >
              {isActionLoading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Send className="h-4 w-4" />}
              {isEdit ? "Save & Publish" : "Publish Now"}
            </Button>

            <Button
              variant="outline"
              className="w-full gap-2 border-slate-200"
              onClick={handleSaveDraft}
              disabled={isActionLoading || !canSubmit}
            >
              {isActionLoading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Save className="h-4 w-4" />}
              {isEdit ? "Save as Draft" : "Save as Draft"}
            </Button>

            <Separator />

            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between">
                <span>Status after save:</span>
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Draft</Badge>
              </div>
              <div className="flex justify-between">
                <span>Status after publish:</span>
                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">Open</Badge>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Completion Checklist</h3>
            <ul className="space-y-2">
              {[
                ["Title", !!form.title.trim()],
                ["Description", !!form.description.trim()],
                ["Category", !!form.categoryId],
                ["Job Type", !!form.jobType],
                ["Work Mode", !!form.workMode],
                ["Experience Level", !!form.experienceLevel],
                ["Skills", form.skillIds.length > 0],
                ["Location", !!(form.city || form.country)],
                ["Salary", !!(form.minSalary || form.maxSalary)],
              ].map(([label, done]) => (
                <li key={label} className="flex items-center gap-2 text-xs">
                  <span className={done ? "text-emerald-500" : "text-slate-300"}>
                    {done ? "✓" : "○"}
                  </span>
                  <span className={done ? "text-slate-700" : "text-slate-400"}>{label}</span>
                  {!done && label === "Title" || !done && label === "Description" || !done && label === "Category" ||
                   !done && label === "Job Type" || !done && label === "Work Mode" || !done && label === "Experience Level"
                    ? <span className="ml-auto text-red-400 font-medium">Required</span>
                    : null
                  }
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 space-y-2">
            <h3 className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Pro Tips</h3>
            <ul className="space-y-1.5 text-xs text-blue-700">
              <li>• Include salary range to get 30% more applicants</li>
              <li>• Tag 5–10 key skills for accurate AI screening</li>
              <li>• Clear responsibilities = better candidate fit</li>
              <li>• Set a deadline to create urgency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
