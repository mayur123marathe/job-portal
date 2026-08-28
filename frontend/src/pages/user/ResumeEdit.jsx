import { useEffect, useRef, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
  ArrowLeft, Eye, User, FileText, Briefcase, GraduationCap,
  Code2, FolderGit2, Award, Languages, BadgeCheck,
  Plus, Pencil, Trash2, X, Check, Globe,
  Sparkles, Loader2, Camera, Settings, Copy,
} from "lucide-react"
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons"
import {
  fetchResumeById, fetchMyResumes, updatePersonalInfo, updateResumeSummary, updateResume,
  addWorkExperience, updateWorkExperience, deleteWorkExperience,
  addEducation,     updateEducation,     deleteEducation,
  addSkill,         updateSkill,         deleteSkill,
  addProject,       updateProject,       deleteProject,
  addCertification, updateCertification, deleteCertification,
  addAward,         updateAward,         deleteAward,
  addLanguage,      updateLanguage,      deleteLanguage,
} from "@/store/resume/resumeThunk"
import {
  generateResumeSummary, generateExperienceBullets,
  parseResumeText, getResumeImprovements,
} from "@/store/ai/aiThunk"
import { uploadToCloudinary } from "@/utils/uploadToCloudinary"
import { TEMPLATES } from "@/components/user/resumes/ResumeTemplates"

// ── Constants ─────────────────────────────────────────────────────────────────

const JOB_TYPES = ["FULL_TIME","PART_TIME","CONTRACT","INTERNSHIP","FREELANCE","REMOTE"]
const PROFICIENCY_LEVELS = ["BEGINNER","ELEMENTARY","INTERMEDIATE","ADVANCED","EXPERT"]
const LANG_PROFICIENCIES = ["BASIC","CONVERSATIONAL","PROFESSIONAL","FLUENT","NATIVE"]
const PROF_LABELS = { BEGINNER:"Beginner", ELEMENTARY:"Elementary", INTERMEDIATE:"Intermediate", ADVANCED:"Advanced", EXPERT:"Expert" }
const LANG_LABELS = { BASIC:"Basic", CONVERSATIONAL:"Conversational", PROFESSIONAL:"Professional", FLUENT:"Fluent", NATIVE:"Native" }

const SECTIONS = [
  { key: "personal",       label: "Personal Info",    icon: User,          field: null },
  { key: "summary",        label: "Summary",          icon: FileText,      field: "summary" },
  { key: "experience",     label: "Work Experience",  icon: Briefcase,     field: "workExperiences" },
  { key: "education",      label: "Education",        icon: GraduationCap, field: "educations" },
  { key: "skills",         label: "Skills",           icon: Code2,         field: "skills" },
  { key: "projects",       label: "Projects",         icon: FolderGit2,    field: "projects" },
  { key: "certifications", label: "Certifications",   icon: BadgeCheck,    field: "certifications" },
  { key: "awards",         label: "Awards",           icon: Award,         field: "awards" },
  { key: "languages",      label: "Languages",        icon: Languages,     field: "languages" },
  { key: "settings",       label: "Settings",         icon: Settings,      field: null },
  { key: "ai-review",      label: "AI Review",        icon: Sparkles,      field: null },
  { key: "parse-resume",   label: "Parse Resume",     icon: FileText,      field: null },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (d) => d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""
const toInput  = (d) => d ? d.substring(0, 10) : ""

// ── Shared: tag input ─────────────────────────────────────────────────────────

function TagInput({ tags = [], onChange, placeholder = "Add tag…" }) {
  const [val, setVal] = useState("")
  const add = () => {
    const v = val.trim()
    if (v && !tags.includes(v)) { onChange([...tags, v]); setVal("") }
  }
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full px-2.5 py-0.5 text-xs font-medium">
            {t}
            <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))} className="hover:text-red-500">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={val} onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }}
          placeholder={placeholder} className="h-8 text-sm" />
        <Button type="button" size="sm" variant="outline" onClick={add} className="h-8 px-3">Add</Button>
      </div>
    </div>
  )
}

// ── Shared: section wrapper ───────────────────────────────────────────────────

function SectionDialog({ open, onClose, title, onSave, isLoading, children }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="space-y-3 py-1">{children}</div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={onSave} disabled={isLoading} className="bg-brand hover:bg-brand/90">
            {isLoading ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SectionCard({ item, onEdit, onDelete, children }) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-slate-200 bg-white hover:border-blue-200 transition-colors">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-brand" onClick={() => onEdit(item)}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => onDelete(item)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

function AddButton({ onClick, label }) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="border-dashed">
      <Plus className="h-3.5 w-3.5 mr-1.5" />{label}
    </Button>
  )
}

function FRow({ label, children }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-slate-500">{label}</Label>
      {children}
    </div>
  )
}

function DeleteConfirm({ open, onClose, onConfirm, label, isLoading }) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {label}?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
            {isLoading ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// ── Shared: copy-from menu ────────────────────────────────────────────────────

function CopyFromMenu({ resumes, onSelect }) {
  if (!resumes?.length) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs text-slate-600 border-dashed hover:text-brand hover:border-brand">
          <Copy className="h-3.5 w-3.5" />
          Copy from resume
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-xs text-slate-500 font-normal">Select a resume to copy from</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {resumes.map((r) => (
          <DropdownMenuItem key={r.id} onClick={() => onSelect(r)} className="cursor-pointer gap-2">
            <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{r.title}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Section: Personal Info ────────────────────────────────────────────────────

function PersonalInfoSection({ resumeId, resume, isLoading, dispatch, otherResumes = [] }) {
  const pi = resume?.personalInfo ?? {}
  const [form, setForm] = useState({
    firstName: "", lastName: "", headline: "", email: "", phone: "",
    city: "", country: "", linkedinUrl: "", githubUrl: "", portfolioUrl: "", websiteUrl: "",
    profileImage: "",
  })
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => { if (pi) setForm({ firstName: pi.firstName ?? "", lastName: pi.lastName ?? "", headline: pi.headline ?? "", email: pi.email ?? "", phone: pi.phone ?? "", city: pi.city ?? "", country: pi.country ?? "", linkedinUrl: pi.linkedinUrl ?? "", githubUrl: pi.githubUrl ?? "", portfolioUrl: pi.portfolioUrl ?? "", websiteUrl: pi.websiteUrl ?? "", profileImage: pi.profileImage ?? "" }) }, [resume])

  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const handleCopyFrom = (src) => {
    const p = src.personalInfo ?? {}
    setForm({
      firstName: p.firstName ?? "", lastName: p.lastName ?? "",
      headline: p.headline ?? "", email: p.email ?? "", phone: p.phone ?? "",
      city: p.city ?? "", country: p.country ?? "",
      linkedinUrl: p.linkedinUrl ?? "", githubUrl: p.githubUrl ?? "",
      portfolioUrl: p.portfolioUrl ?? "", websiteUrl: p.websiteUrl ?? "",
      profileImage: p.profileImage ?? "",
    })
    toast.success(`Copied from "${src.title}" — click Save to apply`)
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploadingImage(true)
    try {
      const url = await uploadToCloudinary(file)
      setForm((prev) => ({ ...prev, profileImage: url }))
      toast.success("Image uploaded!")
    } catch (err) {
      toast.error(err?.message || "Image upload failed")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleSave = () => {
    dispatch(updatePersonalInfo({ resumeId, data: form })).then((a) => {
      if (a.meta.requestStatus === "fulfilled") toast.success("Personal info saved!")
    })
  }
  return (
    <div className="space-y-4">
      {otherResumes.length > 0 && (
        <div className="flex justify-end">
          <CopyFromMenu resumes={otherResumes} onSelect={handleCopyFrom} />
        </div>
      )}
      {/* Profile Image */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-2 border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center">
            {form.profileImage
              ? <img src={form.profileImage} alt="Profile" className="h-full w-full object-cover" />
              : <User className="h-8 w-8 text-slate-400" />}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingImage}
            className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-brand text-white flex items-center justify-center shadow hover:bg-brand/90 disabled:opacity-60"
          >
            {isUploadingImage ? <Loader2 className="h-3 w-3 animate-spin" /> : <Camera className="h-3 w-3" />}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <p className="text-xs text-slate-400">Click camera to upload profile photo</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FRow label="First Name"><Input value={form.firstName} onChange={f("firstName")} placeholder="John" /></FRow>
        <FRow label="Last Name"><Input value={form.lastName} onChange={f("lastName")} placeholder="Doe" /></FRow>
      </div>
      <FRow label="Professional Headline"><Input value={form.headline} onChange={f("headline")} placeholder="Senior Software Engineer" /></FRow>
      <div className="grid grid-cols-2 gap-3">
        <FRow label="Email"><Input type="email" value={form.email} onChange={f("email")} /></FRow>
        <FRow label="Phone"><Input value={form.phone} onChange={f("phone")} placeholder="+1 555-0100" /></FRow>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FRow label="City"><Input value={form.city} onChange={f("city")} /></FRow>
        <FRow label="Country"><Input value={form.country} onChange={f("country")} /></FRow>
      </div>
      <Separator />
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Online Presence</p>
      <FRow label="LinkedIn URL"><div className="relative"><LinkedInLogoIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input value={form.linkedinUrl} onChange={f("linkedinUrl")} className="pl-9" placeholder="https://linkedin.com/in/…" /></div></FRow>
      <FRow label="GitHub URL"><div className="relative"><GitHubLogoIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input value={form.githubUrl} onChange={f("githubUrl")} className="pl-9" placeholder="https://github.com/…" /></div></FRow>
      <FRow label="Portfolio URL"><div className="relative"><Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input value={form.portfolioUrl} onChange={f("portfolioUrl")} className="pl-9" placeholder="https://mysite.com" /></div></FRow>
      <FRow label="Website URL"><div className="relative"><Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><Input value={form.websiteUrl} onChange={f("websiteUrl")} className="pl-9" /></div></FRow>
      <Button onClick={handleSave} disabled={isLoading} className="w-full bg-brand hover:bg-brand/90">
        <Check className="h-4 w-4 mr-1.5" />{isLoading ? "Saving…" : "Save Personal Info"}
      </Button>
    </div>
  )
}

// ── Section: Summary ──────────────────────────────────────────────────────────

function SummarySection({ resumeId, resume, isLoading, dispatch, otherResumes = [] }) {
  const [text, setText] = useState(resume?.summary ?? "")
  const { isGeneratingResumeSummary } = useSelector(s => s.ai)
  useEffect(() => { if (resume?.summary !== undefined) setText(resume.summary ?? "") }, [resume])

  const handleCopyFrom = (src) => {
    setText(src.summary ?? "")
    toast.success(`Copied from "${src.title}" — click Save to apply`)
  }

  const handleGenerateWithAI = async () => {
    const payload = {
      targetJobTitle: resume?.personalInfo?.headline || "",
      workExperiences: (resume?.workExperiences ?? []).map(e => ({
        jobTitle: e.jobTitle, company: e.companyName, description: e.description || "",
      })),
      skills: (resume?.skills ?? []).map(s => s.skillName).filter(Boolean),
      educations: (resume?.educations ?? []).map(e => ({
        degree: e.degree, fieldOfStudy: e.fieldOfStudy, institutionName: e.institutionName,
      })),
      yearsOfExperience: null,
    }
    try {
      const result = await dispatch(generateResumeSummary(payload)).unwrap()
      setText(result.content)
      toast.success("Summary generated!")
    } catch (err) {
      toast.error(err || "Failed to generate summary")
    }
  }

  const handleSave = () => {
    dispatch(updateResumeSummary({ resumeId, summary: text })).then((a) => {
      if (a.meta.requestStatus === "fulfilled") toast.success("Summary saved!")
    })
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Write a compelling 2–4 sentence overview of your career, key skills, and career goals.</p>
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          onClick={handleGenerateWithAI}
          disabled={isGeneratingResumeSummary}
          variant="outline"
          size="sm"
          className="gap-2 border-blue-200 text-brand hover:bg-blue-50"
        >
          {isGeneratingResumeSummary
            ? <><Loader2 className="h-4 w-4 animate-spin" />Generating…</>
            : <><Sparkles className="h-4 w-4" />Generate with AI</>}
        </Button>
        <CopyFromMenu resumes={otherResumes} onSelect={handleCopyFrom} />
      </div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder="Experienced software engineer with 5+ years building scalable web applications…" />
      <p className="text-xs text-slate-400">{text.length} characters</p>
      <Button onClick={handleSave} disabled={isLoading} className="bg-brand hover:bg-brand/90">
        <Check className="h-4 w-4 mr-1.5" />{isLoading ? "Saving…" : "Save Summary"}
      </Button>
    </div>
  )
}

// ── Section: Work Experience ──────────────────────────────────────────────────

const EXP_DEF = { companyName:"", companyLogoUrl:"", jobTitle:"", employmentType:"FULL_TIME", location:"", startDate:"", endDate:"", isCurrentJob:false, description:"", technologies:[] }

function WorkExperienceSection({ resumeId, data=[], isLoading, dispatch, otherResumes=[] }) {
  const [open, setOpen]   = useState(false)
  const [form, setForm]   = useState(EXP_DEF)
  const [editing, setEd]  = useState(null)
  const [delItem, setDel] = useState(null)
  const { isGeneratingBullets } = useSelector(s => s.ai)
  const f = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const openAdd  = () => { setEd(null); setForm(EXP_DEF); setOpen(true) }
  const openEdit = (item) => { setEd(item); setForm({ ...item, startDate: toInput(item.startDate), endDate: toInput(item.endDate), technologies: item.technologies ?? [] }); setOpen(true) }
  const handleCopyFrom = async (src) => {
    const items = src.workExperiences ?? []
    if (!items.length) { toast.info(`No work experiences in "${src.title}"`); return }
    let n = 0
    for (const { id: _id, displayOrder: _ord, ...data } of items) {
      const r = await dispatch(addWorkExperience({ resumeId, data }))
      if (r.meta.requestStatus === "fulfilled") n++
    }
    if (n > 0) toast.success(`Added ${n} experience${n !== 1 ? "s" : ""} from "${src.title}"`)
  }
  const save = () => {
    const payload = { ...form, endDate: form.isCurrentJob ? null : form.endDate || null }
    const thunk = editing ? updateWorkExperience({ resumeId, experienceId: editing.id, data: payload }) : addWorkExperience({ resumeId, data: payload })
    dispatch(thunk).then((a) => { if (a.meta.requestStatus === "fulfilled") { toast.success(editing ? "Updated!" : "Added!"); setOpen(false) } })
  }
  const del = () => {
    dispatch(deleteWorkExperience({ resumeId, experienceId: delItem.id })).then((a) => { if (a.meta.requestStatus === "fulfilled") { toast.success("Deleted"); setDel(null) } })
  }
  const handleGenerateBullets = async () => {
    try {
      const result = await dispatch(generateExperienceBullets({
        jobTitle: form.jobTitle,
        company: form.companyName,
        rawDescription: form.description,
        achievementsHint: "",
      })).unwrap()
      const bulleted = (result.bullets ?? []).map(b => `• ${b}`).join("\n")
      setForm(prev => ({ ...prev, description: bulleted }))
      toast.success("Bullet points generated!")
    } catch (err) {
      toast.error(err || "Failed to generate bullet points")
    }
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CopyFromMenu resumes={otherResumes} onSelect={handleCopyFrom} />
        <AddButton onClick={openAdd} label="Add Experience" />
      </div>
      {[...data].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)).map((item) => (
        <SectionCard key={item.id} item={item} onEdit={openEdit} onDelete={setDel}>
          <p className="font-semibold text-slate-900">{item.jobTitle}</p>
          <p className="text-sm text-slate-600">{item.companyName}{item.location && ` · ${item.location}`}</p>
          <p className="text-xs text-slate-400">{fmtDate(item.startDate)} – {item.isCurrentJob ? "Present" : fmtDate(item.endDate)}</p>
          {item.technologies?.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{item.technologies.map(t=><span key={t} className="text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{t}</span>)}</div>}
        </SectionCard>
      ))}
      <SectionDialog open={open} onClose={()=>setOpen(false)} title={editing?"Edit Experience":"Add Experience"} onSave={save} isLoading={isLoading}>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Company *"><Input value={form.companyName} onChange={f("companyName")} placeholder="TechCorp" /></FRow>
          <FRow label="Job Title *"><Input value={form.jobTitle} onChange={f("jobTitle")} placeholder="Senior Engineer" /></FRow>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Employment Type">
            <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={form.employmentType} onChange={f("employmentType")}>
              {JOB_TYPES.map(t=><option key={t} value={t}>{t.replace("_"," ")}</option>)}
            </select>
          </FRow>
          <FRow label="Location"><Input value={form.location} onChange={f("location")} placeholder="City / Remote" /></FRow>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Start Date *"><Input type="date" value={form.startDate} onChange={f("startDate")} /></FRow>
          <FRow label="End Date"><Input type="date" value={form.endDate} onChange={f("endDate")} disabled={form.isCurrentJob} /></FRow>
        </div>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isCurrentJob} onChange={e=>setForm({...form,isCurrentJob:e.target.checked,endDate:""})} className="rounded" /><span className="text-sm">Currently working here</span></label>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-500">Description</Label>
            <Button
              type="button" variant="ghost" size="sm"
              onClick={handleGenerateBullets}
              disabled={isGeneratingBullets || !form.jobTitle}
              className="h-7 gap-1.5 text-xs text-brand hover:bg-blue-50 px-2"
            >
              {isGeneratingBullets
                ? <><Loader2 className="h-3 w-3 animate-spin" />Generating…</>
                : <><Sparkles className="h-3 w-3" />Generate Bullets</>}
            </Button>
          </div>
          <Textarea value={form.description} onChange={f("description")} rows={3} placeholder="Key achievements and responsibilities…" />
        </div>
        <FRow label="Technologies"><TagInput tags={form.technologies} onChange={(v)=>setForm({...form,technologies:v})} placeholder="React, AWS…" /></FRow>
        <FRow label="Company Logo URL"><Input value={form.companyLogoUrl} onChange={f("companyLogoUrl")} placeholder="https://…" /></FRow>
      </SectionDialog>
      <DeleteConfirm open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} label="experience" isLoading={isLoading} />
    </div>
  )
}

// ── Section: Education ────────────────────────────────────────────────────────

const EDU_DEF = { institutionName:"", degree:"", fieldOfStudy:"", grade:"", startDate:"", endDate:"", isCurrentlyStudying:false, description:"" }

function EducationSection({ resumeId, data=[], isLoading, dispatch, otherResumes=[] }) {
  const [open,setOpen]=useState(false); const [form,setForm]=useState(EDU_DEF); const [editing,setEd]=useState(null); const [delItem,setDel]=useState(null)
  const f=(k)=>(e)=>setForm({...form,[k]:e.target.value})
  const openAdd=()=>{setEd(null);setForm(EDU_DEF);setOpen(true)}
  const openEdit=(item)=>{setEd(item);setForm({...item,startDate:toInput(item.startDate),endDate:toInput(item.endDate)});setOpen(true)}
  const handleCopyFrom=async(src)=>{
    const items=src.educations??[]
    if(!items.length){toast.info(`No education in "${src.title}"`);return}
    let n=0
    for(const{id:_id,displayOrder:_ord,...data}of items){const r=await dispatch(addEducation({resumeId,data}));if(r.meta.requestStatus==="fulfilled")n++}
    if(n>0)toast.success(`Added ${n} education${n!==1?"s":""} from "${src.title}"`)
  }
  const save=()=>{
    const payload={...form,endDate:form.isCurrentlyStudying?null:form.endDate||null}
    const thunk=editing?updateEducation({resumeId,educationId:editing.id,data:payload}):addEducation({resumeId,data:payload})
    dispatch(thunk).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success(editing?"Updated!":"Added!");setOpen(false)}})
  }
  const del=()=>{dispatch(deleteEducation({resumeId,educationId:delItem.id})).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success("Deleted");setDel(null)}})}
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CopyFromMenu resumes={otherResumes} onSelect={handleCopyFrom} />
        <AddButton onClick={openAdd} label="Add Education" />
      </div>
      {[...data].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)).map(item=>(
        <SectionCard key={item.id} item={item} onEdit={openEdit} onDelete={setDel}>
          <p className="font-semibold text-slate-900">{item.degree}{item.fieldOfStudy&&` in ${item.fieldOfStudy}`}</p>
          <p className="text-sm text-slate-600">{item.institutionName}</p>
          <p className="text-xs text-slate-400">{fmtDate(item.startDate)} – {item.isCurrentlyStudying?"Present":fmtDate(item.endDate)}{item.grade&&` · GPA: ${item.grade}`}</p>
        </SectionCard>
      ))}
      <SectionDialog open={open} onClose={()=>setOpen(false)} title={editing?"Edit Education":"Add Education"} onSave={save} isLoading={isLoading}>
        <FRow label="Institution *"><Input value={form.institutionName} onChange={f("institutionName")} placeholder="University of California" /></FRow>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Degree *"><Input value={form.degree} onChange={f("degree")} placeholder="B.S. Computer Science" /></FRow>
          <FRow label="Field of Study"><Input value={form.fieldOfStudy} onChange={f("fieldOfStudy")} placeholder="Computer Science" /></FRow>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <FRow label="Start Date *"><Input type="date" value={form.startDate} onChange={f("startDate")} /></FRow>
          <FRow label="End Date"><Input type="date" value={form.endDate} onChange={f("endDate")} disabled={form.isCurrentlyStudying} /></FRow>
          <FRow label="Grade / GPA"><Input value={form.grade} onChange={f("grade")} placeholder="3.8/4.0" /></FRow>
        </div>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isCurrentlyStudying} onChange={e=>setForm({...form,isCurrentlyStudying:e.target.checked,endDate:""})} className="rounded" /><span className="text-sm">Currently studying</span></label>
        <FRow label="Description"><Textarea value={form.description} onChange={f("description")} rows={2} placeholder="Thesis, honours, activities…" /></FRow>
      </SectionDialog>
      <DeleteConfirm open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} label="education" isLoading={isLoading} />
    </div>
  )
}

// ── Section: Skills ───────────────────────────────────────────────────────────

const SKILL_DEF = { skillName:"", proficiencyLevel:"INTERMEDIATE", yearsOfExperience:"" }

function SkillsSection({ resumeId, data=[], isLoading, dispatch, otherResumes=[] }) {
  const [open,setOpen]=useState(false); const [form,setForm]=useState(SKILL_DEF); const [editing,setEd]=useState(null); const [delItem,setDel]=useState(null)
  const f=(k)=>(e)=>setForm({...form,[k]:e.target.value})
  const openAdd=()=>{setEd(null);setForm(SKILL_DEF);setOpen(true)}
  const openEdit=(item)=>{setEd(item);setForm({...item});setOpen(true)}
  const handleCopyFrom=async(src)=>{
    const items=src.skills??[]
    if(!items.length){toast.info(`No skills in "${src.title}"`);return}
    let n=0
    for(const{id:_id,displayOrder:_ord,...data}of items){const r=await dispatch(addSkill({resumeId,data}));if(r.meta.requestStatus==="fulfilled")n++}
    if(n>0)toast.success(`Added ${n} skill${n!==1?"s":""} from "${src.title}"`)
  }
  const save=()=>{
    const payload={...form,yearsOfExperience:form.yearsOfExperience?Number(form.yearsOfExperience):null}
    const thunk=editing?updateSkill({resumeId,skillId:editing.id,data:payload}):addSkill({resumeId,data:payload})
    dispatch(thunk).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success(editing?"Updated!":"Added!");setOpen(false)}})
  }
  const del=()=>{dispatch(deleteSkill({resumeId,skillId:delItem.id})).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success("Deleted");setDel(null)}})}
  const PROF_COLOR = { BEGINNER:"bg-slate-200", ELEMENTARY:"bg-blue-200", INTERMEDIATE:"bg-blue-400", ADVANCED:"bg-brand", EXPERT:"bg-indigo-700" }
  const PROF_PCT   = { BEGINNER:20, ELEMENTARY:40, INTERMEDIATE:60, ADVANCED:80, EXPERT:100 }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CopyFromMenu resumes={otherResumes} onSelect={handleCopyFrom} />
        <AddButton onClick={openAdd} label="Add Skill" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[...data].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)).map(item=>(
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-200">
            <div className="flex-1 min-w-0 mr-2">
              <div className="flex justify-between mb-1"><span className="text-sm font-medium text-slate-800">{item.skillName}</span><span className="text-xs text-slate-400">{PROF_LABELS[item.proficiencyLevel]}</span></div>
              <div className="h-1.5 bg-slate-100 rounded-full"><div className={`h-1.5 rounded-full ${PROF_COLOR[item.proficiencyLevel]}`} style={{width:`${PROF_PCT[item.proficiencyLevel]}%`}} /></div>
              {item.yearsOfExperience && <p className="text-xs text-slate-400 mt-0.5">{item.yearsOfExperience} yr{item.yearsOfExperience!==1?"s":""}</p>}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-brand" onClick={()=>openEdit(item)}><Pencil className="h-3 w-3"/></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500" onClick={()=>setDel(item)}><Trash2 className="h-3 w-3"/></Button>
            </div>
          </div>
        ))}
      </div>
      <SectionDialog open={open} onClose={()=>setOpen(false)} title={editing?"Edit Skill":"Add Skill"} onSave={save} isLoading={isLoading}>
        <FRow label="Skill Name *"><Input value={form.skillName} onChange={f("skillName")} placeholder="e.g. React" /></FRow>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Proficiency Level *">
            <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={form.proficiencyLevel} onChange={f("proficiencyLevel")}>
              {PROFICIENCY_LEVELS.map(l=><option key={l} value={l}>{PROF_LABELS[l]}</option>)}
            </select>
          </FRow>
          <FRow label="Years of Experience"><Input type="number" min={0} max={50} value={form.yearsOfExperience} onChange={f("yearsOfExperience")} placeholder="3" /></FRow>
        </div>
      </SectionDialog>
      <DeleteConfirm open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} label="skill" isLoading={isLoading} />
    </div>
  )
}

// ── Section: Projects ─────────────────────────────────────────────────────────

const PROJ_DEF = { title:"", description:"", technologies:[], projectUrl:"", sourceCodeUrl:"", startDate:"", endDate:"", isOngoing:false }

function ProjectsSection({ resumeId, data=[], isLoading, dispatch, otherResumes=[] }) {
  const [open,setOpen]=useState(false); const [form,setForm]=useState(PROJ_DEF); const [editing,setEd]=useState(null); const [delItem,setDel]=useState(null)
  const f=(k)=>(e)=>setForm({...form,[k]:e.target.value})
  const openAdd=()=>{setEd(null);setForm(PROJ_DEF);setOpen(true)}
  const openEdit=(item)=>{setEd(item);setForm({...item,startDate:toInput(item.startDate),endDate:toInput(item.endDate),technologies:item.technologies??[]});setOpen(true)}
  const handleCopyFrom=async(src)=>{
    const items=src.projects??[]
    if(!items.length){toast.info(`No projects in "${src.title}"`);return}
    let n=0
    for(const{id:_id,displayOrder:_ord,...data}of items){const r=await dispatch(addProject({resumeId,data}));if(r.meta.requestStatus==="fulfilled")n++}
    if(n>0)toast.success(`Added ${n} project${n!==1?"s":""} from "${src.title}"`)
  }
  const save=()=>{
    const payload={...form,endDate:form.isOngoing?null:form.endDate||null,projectUrl:form.projectUrl||null,sourceCodeUrl:form.sourceCodeUrl||null}
    const thunk=editing?updateProject({resumeId,projectId:editing.id,data:payload}):addProject({resumeId,data:payload})
    dispatch(thunk).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success(editing?"Updated!":"Added!");setOpen(false)}})
  }
  const del=()=>{dispatch(deleteProject({resumeId,projectId:delItem.id})).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success("Deleted");setDel(null)}})}
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CopyFromMenu resumes={otherResumes} onSelect={handleCopyFrom} />
        <AddButton onClick={openAdd} label="Add Project" />
      </div>
      {[...data].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)).map(item=>(
        <SectionCard key={item.id} item={item} onEdit={openEdit} onDelete={setDel}>
          <p className="font-semibold text-slate-900">{item.title}</p>
          {item.description && <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>}
          {item.technologies?.length>0 && <div className="flex flex-wrap gap-1 mt-1">{item.technologies.map(t=><span key={t} className="text-xs bg-slate-100 text-slate-600 rounded px-1.5 py-0.5">{t}</span>)}</div>}
          <div className="flex gap-3 mt-1 text-xs text-brand">{item.projectUrl&&<a href={item.projectUrl} target="_blank" rel="noreferrer">Demo ↗</a>}{item.sourceCodeUrl&&<a href={item.sourceCodeUrl} target="_blank" rel="noreferrer">Source ↗</a>}</div>
        </SectionCard>
      ))}
      <SectionDialog open={open} onClose={()=>setOpen(false)} title={editing?"Edit Project":"Add Project"} onSave={save} isLoading={isLoading}>
        <FRow label="Title *"><Input value={form.title} onChange={f("title")} placeholder="E-Commerce Platform" /></FRow>
        <FRow label="Description"><Textarea value={form.description} onChange={f("description")} rows={3} /></FRow>
        <FRow label="Technologies"><TagInput tags={form.technologies} onChange={v=>setForm({...form,technologies:v})} /></FRow>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Start Date"><Input type="date" value={form.startDate} onChange={f("startDate")} /></FRow>
          <FRow label="End Date"><Input type="date" value={form.endDate} onChange={f("endDate")} disabled={form.isOngoing} /></FRow>
        </div>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isOngoing} onChange={e=>setForm({...form,isOngoing:e.target.checked,endDate:""})} className="rounded" /><span className="text-sm">Ongoing project</span></label>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Live URL"><Input value={form.projectUrl} onChange={f("projectUrl")} placeholder="https://…" /></FRow>
          <FRow label="Source Code URL"><Input value={form.sourceCodeUrl} onChange={f("sourceCodeUrl")} placeholder="https://github.com/…" /></FRow>
        </div>
      </SectionDialog>
      <DeleteConfirm open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} label="project" isLoading={isLoading} />
    </div>
  )
}

// ── Section: Certifications ───────────────────────────────────────────────────

const CERT_DEF = { name:"", issuingOrganization:"", issueDate:"", expiryDate:"", credentialId:"", credentialUrl:"" }

function CertificationsSection({ resumeId, data=[], isLoading, dispatch, otherResumes=[] }) {
  const [open,setOpen]=useState(false); const [form,setForm]=useState(CERT_DEF); const [editing,setEd]=useState(null); const [delItem,setDel]=useState(null)
  const f=(k)=>(e)=>setForm({...form,[k]:e.target.value})
  const openAdd=()=>{setEd(null);setForm(CERT_DEF);setOpen(true)}
  const openEdit=(item)=>{setEd(item);setForm({...item,issueDate:toInput(item.issueDate),expiryDate:toInput(item.expiryDate)});setOpen(true)}
  const handleCopyFrom=async(src)=>{
    const items=src.certifications??[]
    if(!items.length){toast.info(`No certifications in "${src.title}"`);return}
    let n=0
    for(const{id:_id,displayOrder:_ord,...data}of items){const r=await dispatch(addCertification({resumeId,data}));if(r.meta.requestStatus==="fulfilled")n++}
    if(n>0)toast.success(`Added ${n} certification${n!==1?"s":""} from "${src.title}"`)
  }
  const save=()=>{
    const payload={...form,expiryDate:form.expiryDate||null,credentialId:form.credentialId||null,credentialUrl:form.credentialUrl||null}
    const thunk=editing?updateCertification({resumeId,certificationId:editing.id,data:payload}):addCertification({resumeId,data:payload})
    dispatch(thunk).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success(editing?"Updated!":"Added!");setOpen(false)}})
  }
  const del=()=>{dispatch(deleteCertification({resumeId,certificationId:delItem.id})).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success("Deleted");setDel(null)}})}
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CopyFromMenu resumes={otherResumes} onSelect={handleCopyFrom} />
        <AddButton onClick={openAdd} label="Add Certification" />
      </div>
      {[...data].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)).map(item=>(
        <SectionCard key={item.id} item={item} onEdit={openEdit} onDelete={setDel}>
          <p className="font-semibold text-slate-900">{item.name}</p>
          <p className="text-sm text-slate-600">{item.issuingOrganization}</p>
          <p className="text-xs text-slate-400">{fmtDate(item.issueDate)}{item.expiryDate&&` – Exp ${fmtDate(item.expiryDate)}`}</p>
          {item.credentialUrl&&<a href={item.credentialUrl} target="_blank" rel="noreferrer" className="text-xs text-brand">Verify ↗</a>}
        </SectionCard>
      ))}
      <SectionDialog open={open} onClose={()=>setOpen(false)} title={editing?"Edit Certification":"Add Certification"} onSave={save} isLoading={isLoading}>
        <FRow label="Certification Name *"><Input value={form.name} onChange={f("name")} placeholder="AWS Solutions Architect" /></FRow>
        <FRow label="Issuing Organization *"><Input value={form.issuingOrganization} onChange={f("issuingOrganization")} placeholder="Amazon Web Services" /></FRow>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Issue Date *"><Input type="date" value={form.issueDate} onChange={f("issueDate")} /></FRow>
          <FRow label="Expiry Date"><Input type="date" value={form.expiryDate} onChange={f("expiryDate")} /></FRow>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Credential ID"><Input value={form.credentialId} onChange={f("credentialId")} /></FRow>
          <FRow label="Credential URL"><Input value={form.credentialUrl} onChange={f("credentialUrl")} placeholder="https://…" /></FRow>
        </div>
      </SectionDialog>
      <DeleteConfirm open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} label="certification" isLoading={isLoading} />
    </div>
  )
}

// ── Section: Awards ───────────────────────────────────────────────────────────

const AWARD_DEF = { title:"", issuedBy:"", awardDate:"", description:"" }

function AwardsSection({ resumeId, data=[], isLoading, dispatch, otherResumes=[] }) {
  const [open,setOpen]=useState(false); const [form,setForm]=useState(AWARD_DEF); const [editing,setEd]=useState(null); const [delItem,setDel]=useState(null)
  const f=(k)=>(e)=>setForm({...form,[k]:e.target.value})
  const openAdd=()=>{setEd(null);setForm(AWARD_DEF);setOpen(true)}
  const openEdit=(item)=>{setEd(item);setForm({...item,awardDate:toInput(item.awardDate)});setOpen(true)}
  const handleCopyFrom=async(src)=>{
    const items=src.awards??[]
    if(!items.length){toast.info(`No awards in "${src.title}"`);return}
    let n=0
    for(const{id:_id,displayOrder:_ord,...data}of items){const r=await dispatch(addAward({resumeId,data}));if(r.meta.requestStatus==="fulfilled")n++}
    if(n>0)toast.success(`Added ${n} award${n!==1?"s":""} from "${src.title}"`)
  }
  const save=()=>{
    const payload={...form,awardDate:form.awardDate||null,issuedBy:form.issuedBy||null}
    const thunk=editing?updateAward({resumeId,awardId:editing.id,data:payload}):addAward({resumeId,data:payload})
    dispatch(thunk).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success(editing?"Updated!":"Added!");setOpen(false)}})
  }
  const del=()=>{dispatch(deleteAward({resumeId,awardId:delItem.id})).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success("Deleted");setDel(null)}})}
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CopyFromMenu resumes={otherResumes} onSelect={handleCopyFrom} />
        <AddButton onClick={openAdd} label="Add Award" />
      </div>
      {[...data].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)).map(item=>(
        <SectionCard key={item.id} item={item} onEdit={openEdit} onDelete={setDel}>
          <p className="font-semibold text-slate-900">{item.title}</p>
          {item.issuedBy&&<p className="text-sm text-slate-600">by {item.issuedBy}</p>}
          {item.awardDate&&<p className="text-xs text-slate-400">{fmtDate(item.awardDate)}</p>}
          {item.description&&<p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>}
        </SectionCard>
      ))}
      <SectionDialog open={open} onClose={()=>setOpen(false)} title={editing?"Edit Award":"Add Award"} onSave={save} isLoading={isLoading}>
        <FRow label="Award Title *"><Input value={form.title} onChange={f("title")} placeholder="Employee of the Year" /></FRow>
        <div className="grid grid-cols-2 gap-3">
          <FRow label="Issued By"><Input value={form.issuedBy} onChange={f("issuedBy")} placeholder="TechCorp Inc." /></FRow>
          <FRow label="Award Date"><Input type="date" value={form.awardDate} onChange={f("awardDate")} /></FRow>
        </div>
        <FRow label="Description"><Textarea value={form.description} onChange={f("description")} rows={2} /></FRow>
      </SectionDialog>
      <DeleteConfirm open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} label="award" isLoading={isLoading} />
    </div>
  )
}

// ── Section: Languages ────────────────────────────────────────────────────────

const LANG_DEF = { languageName:"", proficiency:"PROFESSIONAL" }

function LanguagesSection({ resumeId, data=[], isLoading, dispatch, otherResumes=[] }) {
  const [open,setOpen]=useState(false); const [form,setForm]=useState(LANG_DEF); const [editing,setEd]=useState(null); const [delItem,setDel]=useState(null)
  const f=(k)=>(e)=>setForm({...form,[k]:e.target.value})
  const openAdd=()=>{setEd(null);setForm(LANG_DEF);setOpen(true)}
  const openEdit=(item)=>{setEd(item);setForm({...item});setOpen(true)}
  const handleCopyFrom=async(src)=>{
    const items=src.languages??[]
    if(!items.length){toast.info(`No languages in "${src.title}"`);return}
    let n=0
    for(const{id:_id,displayOrder:_ord,...data}of items){const r=await dispatch(addLanguage({resumeId,data}));if(r.meta.requestStatus==="fulfilled")n++}
    if(n>0)toast.success(`Added ${n} language${n!==1?"s":""} from "${src.title}"`)
  }
  const save=()=>{
    const thunk=editing?updateLanguage({resumeId,languageId:editing.id,data:form}):addLanguage({resumeId,data:form})
    dispatch(thunk).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success(editing?"Updated!":"Added!");setOpen(false)}})
  }
  const del=()=>{dispatch(deleteLanguage({resumeId,languageId:delItem.id})).then(a=>{if(a.meta.requestStatus==="fulfilled"){toast.success("Deleted");setDel(null)}})}
  const LANG_BG = { BASIC:"bg-slate-100 text-slate-600", CONVERSATIONAL:"bg-blue-50 text-blue-700", PROFESSIONAL:"bg-indigo-50 text-indigo-700", FLUENT:"bg-purple-50 text-purple-700", NATIVE:"bg-green-50 text-green-700" }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CopyFromMenu resumes={otherResumes} onSelect={handleCopyFrom} />
        <AddButton onClick={openAdd} label="Add Language" />
      </div>
      <div className="flex flex-wrap gap-3">
        {[...data].sort((a,b)=>(a.displayOrder??0)-(b.displayOrder??0)).map(item=>(
          <div key={item.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${LANG_BG[item.proficiency]??LANG_BG.PROFESSIONAL}`}>
            <div><p className="text-sm font-semibold">{item.languageName}</p><p className="text-xs opacity-75">{LANG_LABELS[item.proficiency]}</p></div>
            <div className="flex gap-0.5 ml-1">
              <button onClick={()=>openEdit(item)} className="hover:opacity-70"><Pencil className="h-3 w-3"/></button>
              <button onClick={()=>setDel(item)} className="hover:opacity-70"><Trash2 className="h-3 w-3"/></button>
            </div>
          </div>
        ))}
      </div>
      <SectionDialog open={open} onClose={()=>setOpen(false)} title={editing?"Edit Language":"Add Language"} onSave={save} isLoading={isLoading}>
        <FRow label="Language *"><Input value={form.languageName} onChange={f("languageName")} placeholder="English" /></FRow>
        <FRow label="Proficiency *">
          <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm" value={form.proficiency} onChange={f("proficiency")}>
            {LANG_PROFICIENCIES.map(l=><option key={l} value={l}>{LANG_LABELS[l]}</option>)}
          </select>
        </FRow>
      </SectionDialog>
      <DeleteConfirm open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} label="language" isLoading={isLoading} />
    </div>
  )
}

// ── Section: Settings ────────────────────────────────────────────────────────

const VISIBILITY_OPTIONS = [
  { value: "PRIVATE",   label: "Private",   desc: "Only visible when you apply" },
  { value: "PUBLIC",    label: "Public",    desc: "Discoverable by employers" },
  { value: "LINK_ONLY", label: "Link Only", desc: "Share via direct link" },
]

function ResumeSettingsSection({ resumeId, resume, isLoading, dispatch }) {
  const [title, setTitle]           = useState(resume?.title ?? "")
  const [template, setTemplate]     = useState(resume?.template ?? "PROFESSIONAL")
  const [visibility, setVisibility] = useState(resume?.visibility ?? "PRIVATE")

  useEffect(() => {
    if (resume) {
      setTitle(resume.title ?? "")
      setTemplate(resume.template ?? "PROFESSIONAL")
      setVisibility(resume.visibility ?? "PRIVATE")
    }
  }, [resume])

  const handleSave = () => {
    dispatch(updateResume({ resumeId, data: { title, template, visibility } })).then((a) => {
      if (a.meta.requestStatus === "fulfilled") toast.success("Settings saved!")
    })
  }

  return (
    <div className="space-y-6">
      <FRow label="Resume Title">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={150} placeholder="e.g. Backend Engineer Resume" />
        <p className="text-xs text-slate-400 mt-1">{title.length}/150</p>
      </FRow>

      <Separator />

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Template</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TEMPLATES.map((tmpl) => {
            const Prev = tmpl.preview
            const selected = template === tmpl.value
            return (
              <button key={tmpl.value} type="button" onClick={() => setTemplate(tmpl.value)}
                className={`rounded-xl border-2 overflow-hidden text-left transition-all ${
                  selected ? "border-brand shadow-md shadow-blue-100" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="h-28 overflow-hidden bg-slate-50 relative">
                  <div className="absolute inset-0"><Prev /></div>
                  {selected && (
                    <div className="absolute inset-0 bg-brand/10 flex items-center justify-center">
                      <Check className="h-6 w-6 text-brand bg-white rounded-full p-0.5" />
                    </div>
                  )}
                </div>
                <div className="p-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">{tmpl.label}</p>
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">{tmpl.tagline}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Visibility</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => setVisibility(opt.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                visibility === opt.value ? "border-brand bg-blue-50" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <p className={`text-sm font-medium ${visibility === opt.value ? "text-blue-700" : "text-slate-800"}`}>{opt.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={isLoading || !title.trim()} className="w-full bg-brand hover:bg-brand/90">
        <Check className="h-4 w-4 mr-1.5" />{isLoading ? "Saving…" : "Save Settings"}
      </Button>
    </div>
  )
}

// ── Section: AI Review ────────────────────────────────────────────────────────

const PRIORITY_COLOR = {
  HIGH:   "text-red-600 bg-red-50 border-red-200",
  MEDIUM: "text-yellow-600 bg-yellow-50 border-yellow-200",
  LOW:    "text-green-600 bg-green-50 border-green-200",
}

function AiReviewSection({ resume, dispatch }) {
  const { resumeImprovements, isGettingImprovements } = useSelector(s => s.ai)
  const [jobTitle, setJobTitle] = useState("")

  const handleAnalyze = async () => {
    const content = JSON.stringify({
      personalInfo: resume?.personalInfo,
      summary: resume?.summary,
      workExperiences: resume?.workExperiences,
      skills: resume?.skills,
      educations: resume?.educations,
      projects: resume?.projects,
      certifications: resume?.certifications,
    })
    try {
      await dispatch(getResumeImprovements({ resumeContent: content, targetJobTitle: jobTitle || "" })).unwrap()
    } catch (err) {
      toast.error(err || "Failed to get improvement suggestions")
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">Get AI-powered suggestions to improve your resume for a specific role.</p>
      <div className="flex gap-2">
        <Input
          value={jobTitle}
          onChange={e => setJobTitle(e.target.value)}
          placeholder="Target job title (optional)…"
          className="flex-1"
        />
        <Button
          onClick={handleAnalyze}
          disabled={isGettingImprovements}
          className="gap-2 bg-brand hover:bg-brand/90 shrink-0"
        >
          {isGettingImprovements
            ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing…</>
            : <><Sparkles className="h-4 w-4" />Analyze Resume</>}
        </Button>
      </div>

      {resumeImprovements && (
        <div className="space-y-5">
          {/* Score card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="h-16 w-16 rounded-full border-4 border-blue-500 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-brand">{resumeImprovements.overallScore}</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Overall Score</p>
              <p className="text-sm text-slate-500">{resumeImprovements.summary}</p>
            </div>
          </div>

          {/* Strengths */}
          {resumeImprovements.strengths?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Strengths</p>
              <div className="flex flex-wrap gap-2">
                {resumeImprovements.strengths.map((s, i) => (
                  <span key={i} className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-1">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {resumeImprovements.improvements?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Improvements ({resumeImprovements.improvements.length})</p>
              <div className="space-y-2">
                {resumeImprovements.improvements.map((imp, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{imp.section}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[imp.priority] ?? "text-slate-600 bg-slate-50 border-slate-200"}`}>
                        {imp.priority}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800">{imp.issue}</p>
                    <p className="text-sm text-slate-600">{imp.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Section: Parse Resume ─────────────────────────────────────────────────────

function ParseResumeSection({ dispatch }) {
  const { resumeParseResult, isParsingResume } = useSelector(s => s.ai)
  const [rawText, setRawText] = useState("")

  const handleParse = async () => {
    if (!rawText.trim()) { toast.error("Please paste your resume text"); return }
    try {
      await dispatch(parseResumeText({ resumeText: rawText })).unwrap()
      toast.success("Resume parsed successfully!")
    } catch (err) {
      toast.error(err || "Failed to parse resume")
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Paste your raw resume text and AI will extract structured data from it.</p>
      <Textarea
        value={rawText}
        onChange={e => setRawText(e.target.value)}
        rows={8}
        placeholder="Paste your entire resume text here…"
      />
      <Button
        onClick={handleParse}
        disabled={isParsingResume || !rawText.trim()}
        className="gap-2 bg-brand hover:bg-brand/90"
      >
        {isParsingResume
          ? <><Loader2 className="h-4 w-4 animate-spin" />Parsing…</>
          : <><Sparkles className="h-4 w-4" />Parse Resume</>}
      </Button>

      {resumeParseResult && (
        <div className="space-y-4 pt-2">
          <Separator />
          <p className="font-semibold text-slate-900">Parsed Result</p>

          {resumeParseResult.personalInfo && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Personal Info</p>
              <p className="font-medium text-slate-900">{[resumeParseResult.personalInfo.firstName, resumeParseResult.personalInfo.lastName].filter(Boolean).join(" ")}</p>
              {resumeParseResult.personalInfo.email    && <p className="text-sm text-slate-600">{resumeParseResult.personalInfo.email}</p>}
              {resumeParseResult.personalInfo.phone    && <p className="text-sm text-slate-600">{resumeParseResult.personalInfo.phone}</p>}
              {resumeParseResult.personalInfo.headline && <p className="text-sm text-slate-500">{resumeParseResult.personalInfo.headline}</p>}
            </div>
          )}

          {resumeParseResult.summary && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Summary</p>
              <p className="text-sm text-slate-700">{resumeParseResult.summary}</p>
            </div>
          )}

          {resumeParseResult.workExperiences?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Work Experience ({resumeParseResult.workExperiences.length})</p>
              <div className="space-y-2">
                {resumeParseResult.workExperiences.map((e, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-medium text-slate-900">{e.jobTitle}</p>
                    <p className="text-sm text-slate-600">{e.company ?? e.companyName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeParseResult.skills?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Skills ({resumeParseResult.skills.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {resumeParseResult.skills.map((s, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2.5 py-1">
                    {typeof s === "string" ? s : s.skillName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {resumeParseResult.educations?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Education ({resumeParseResult.educations.length})</p>
              <div className="space-y-2">
                {resumeParseResult.educations.map((e, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-medium text-slate-900">{e.degree}{e.fieldOfStudy && ` in ${e.fieldOfStudy}`}</p>
                    <p className="text-sm text-slate-600">{e.institutionName}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ResumeEdit() {
  const { id } = useParams()
  const resumeId = Number(id)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentResume: resume, resumes, isLoading, isActionLoading, error } = useSelector((s) => s.resume)
  const otherResumes = resumes.filter((r) => r.id !== resumeId)

  const [activeSection, setActive] = useState("personal")

  useEffect(() => {
    dispatch(fetchResumeById(resumeId))
    if (resumes.length === 0) dispatch(fetchMyResumes())
  }, [dispatch, resumeId])

  useEffect(() => { if (error) toast.error(error) }, [error])

  // Count filled items per section for sidebar indicators
  const counts = {
    personal:       (resume?.personalInfo?.firstName || resume?.personalInfo?.email) ? 1 : 0,
    summary:        resume?.summary ? 1 : 0,
    experience:     resume?.workExperiences?.length ?? 0,
    education:      resume?.educations?.length ?? 0,
    skills:         resume?.skills?.length ?? 0,
    projects:       resume?.projects?.length ?? 0,
    certifications: resume?.certifications?.length ?? 0,
    awards:         resume?.awards?.length ?? 0,
    languages:      resume?.languages?.length ?? 0,
  }

  const activeSec = SECTIONS.find((s) => s.key === activeSection)

  return (
    <div className="flex h-screen flex-col">
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/resumes")} className="text-slate-500 hover:text-slate-700">
            <ArrowLeft className="h-4 w-4 mr-1" /> Resumes
          </Button>
          <div className="h-4 w-px bg-slate-200" />
          {isLoading ? <Skeleton className="h-5 w-48" /> : (
            <div>
              <h1 className="font-semibold text-slate-900 text-sm">{resume?.title ?? "Loading…"}</h1>
              {resume && <p className="text-xs text-slate-400">{resume.template} template · {resume.completionScore ?? 0}% complete</p>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Progress value={resume?.completionScore ?? 0} className="h-1.5 w-28 hidden sm:block" />
          <Button variant="outline" size="sm" onClick={() => navigate(`/resumes/${resumeId}/view`)}>
            <Eye className="h-4 w-4 mr-1.5" /> Preview
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-white border-r border-slate-200 overflow-y-auto flex flex-col">
          <div className="p-3 space-y-0.5 flex-1">
            {SECTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  activeSection === key
                    ? "bg-brand text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </span>
                {counts[key] > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 font-medium ${activeSection === key ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-700"}`}>
                    {counts[key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {isLoading ? (
            <div className="space-y-3"><Skeleton className="h-8 w-48" />{Array.from({length:4}).map((_,i)=><Skeleton key={i} className="h-16 w-full rounded-xl" />)}</div>
          ) : (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {activeSec && <activeSec.icon className="h-5 w-5 text-brand" />}
                  {activeSec?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSection === "personal"       && <PersonalInfoSection    resumeId={resumeId} resume={resume} isLoading={isActionLoading} dispatch={dispatch} otherResumes={otherResumes} />}
                {activeSection === "summary"        && <SummarySection         resumeId={resumeId} resume={resume} isLoading={isActionLoading} dispatch={dispatch} otherResumes={otherResumes} />}
                {activeSection === "experience"     && <WorkExperienceSection  resumeId={resumeId} data={resume?.workExperiences} isLoading={isActionLoading} dispatch={dispatch} otherResumes={otherResumes} />}
                {activeSection === "education"      && <EducationSection       resumeId={resumeId} data={resume?.educations}      isLoading={isActionLoading} dispatch={dispatch} otherResumes={otherResumes} />}
                {activeSection === "skills"         && <SkillsSection          resumeId={resumeId} data={resume?.skills}          isLoading={isActionLoading} dispatch={dispatch} otherResumes={otherResumes} />}
                {activeSection === "projects"       && <ProjectsSection        resumeId={resumeId} data={resume?.projects}        isLoading={isActionLoading} dispatch={dispatch} otherResumes={otherResumes} />}
                {activeSection === "certifications" && <CertificationsSection  resumeId={resumeId} data={resume?.certifications}  isLoading={isActionLoading} dispatch={dispatch} otherResumes={otherResumes} />}
                {activeSection === "awards"         && <AwardsSection          resumeId={resumeId} data={resume?.awards}          isLoading={isActionLoading} dispatch={dispatch} otherResumes={otherResumes} />}
                {activeSection === "languages"      && <LanguagesSection       resumeId={resumeId} data={resume?.languages}       isLoading={isActionLoading} dispatch={dispatch} otherResumes={otherResumes} />}
                {activeSection === "settings"       && <ResumeSettingsSection  resumeId={resumeId} resume={resume} isLoading={isActionLoading} dispatch={dispatch} />}
                {activeSection === "ai-review"      && <AiReviewSection        resume={resume} dispatch={dispatch} />}
                {activeSection === "parse-resume"   && <ParseResumeSection     dispatch={dispatch} />}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
