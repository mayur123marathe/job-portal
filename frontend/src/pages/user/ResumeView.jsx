import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft, Pencil, Printer,
  Mail, Phone, MapPin, Globe,
} from "lucide-react"
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons"
import { fetchResumeById } from "@/store/resume/resumeThunk"
import { toast } from "sonner"

// ── Formatting helpers ─────────────────────────────────────────────────────────

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""

const fmtRange = (start, end, isCurrent) => {
  const s = fmt(start)
  const e = isCurrent ? "Present" : fmt(end)
  if (!s && !e) return ""
  if (!e) return s
  return `${s} – ${e}`
}

const fullName = (pi) =>
  [pi?.firstName, pi?.lastName].filter(Boolean).join(" ") || "Your Name"

const loc = (city, country) => [city, country].filter(Boolean).join(", ")

const PROF_PCT = {
  BEGINNER: 20, ELEMENTARY: 40, INTERMEDIATE: 60, ADVANCED: 80, EXPERT: 100,
}
const LANG_LBL = {
  BASIC: "Basic", CONVERSATIONAL: "Conversational", PROFESSIONAL: "Professional",
  FLUENT: "Fluent", NATIVE: "Native",
}

// ── PROFESSIONAL Template ──────────────────────────────────────────────────────

function ProSectionTitle({ title }) {
  return (
    <div className="flex items-center gap-3 mt-5 mb-2">
      <span className="text-[10px] font-bold tracking-widest uppercase text-[#1e3a5f]">{title}</span>
      <div className="flex-1 h-px bg-[#1e3a5f]" />
    </div>
  )
}

function ProfessionalTemplate({ resume }) {
  const pi = resume.personalInfo ?? {}
  return (
    <div className="font-sans text-[13px] text-slate-800 px-12 py-10 min-h-[1056px] bg-white">
      {/* Header */}
      <div className="text-center mb-1">
        {pi.profileImage && (
          <div className="flex justify-center mb-3">
            <img src={pi.profileImage} alt={fullName(pi)} className="h-20 w-20 rounded-full object-cover border-2 border-[#1e3a5f]" />
          </div>
        )}
        <h1 className="text-[26px] font-bold tracking-widest uppercase text-[#1e3a5f]">{fullName(pi)}</h1>
        {pi.headline && <p className="text-slate-500 text-sm mt-1">{pi.headline}</p>}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-2 text-[11px] text-slate-600">
          {pi.email        && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{pi.email}</span>}
          {pi.phone        && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{pi.phone}</span>}
          {(pi.city||pi.country) && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{loc(pi.city, pi.country)}</span>}
          {pi.linkedinUrl  && <a href={pi.linkedinUrl}  target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-700 hover:underline"><LinkedInLogoIcon className="h-3 w-3" />LinkedIn</a>}
          {pi.githubUrl    && <a href={pi.githubUrl}    target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-700 hover:underline"><GitHubLogoIcon className="h-3 w-3" />GitHub</a>}
          {pi.portfolioUrl && <a href={pi.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-700 hover:underline"><Globe className="h-3 w-3" />Portfolio</a>}
        </div>
      </div>

      {resume.summary && (<>
        <ProSectionTitle title="Professional Summary" />
        <p className="text-slate-700 leading-relaxed">{resume.summary}</p>
      </>)}

      {resume.workExperiences?.length > 0 && (<>
        <ProSectionTitle title="Work Experience" />
        <div className="space-y-4">
          {resume.workExperiences.map((w) => (
            <div key={w.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">{w.jobTitle}</span>
                <span className="text-[11px] text-slate-500">{fmtRange(w.startDate, w.endDate, w.isCurrentJob)}</span>
              </div>
              <div className="text-slate-600 text-[11px]">
                {w.companyName}{loc(w.city, w.country) ? ` · ${loc(w.city, w.country)}` : ""}
              </div>
              {w.description && <p className="text-slate-700 mt-1 leading-relaxed">{w.description}</p>}
              {w.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {w.technologies.map((t) => (
                    <span key={t} className="text-[10px] border border-[#1e3a5f] text-[#1e3a5f] rounded px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </>)}

      {resume.educations?.length > 0 && (<>
        <ProSectionTitle title="Education" />
        <div className="space-y-3">
          {resume.educations.map((e) => (
            <div key={e.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">{e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}</span>
                <span className="text-[11px] text-slate-500">{fmtRange(e.startDate, e.endDate, e.isCurrentlyStudying)}</span>
              </div>
              <div className="text-slate-600 text-[11px]">
                {e.institutionName}{loc(e.city, e.country) ? ` · ${loc(e.city, e.country)}` : ""}{e.gpa ? ` · GPA: ${e.gpa}` : ""}
              </div>
              {e.description && <p className="text-slate-700 mt-0.5 text-[12px]">{e.description}</p>}
            </div>
          ))}
        </div>
      </>)}

      {resume.skills?.length > 0 && (<>
        <ProSectionTitle title="Skills" />
        <div className="flex flex-wrap gap-1.5">
          {resume.skills.map((s) => (
            <span key={s.id} className="text-[11px] border border-[#1e3a5f] text-[#1e3a5f] rounded px-2 py-0.5">
              {s.skillName}{s.proficiencyLevel ? ` · ${s.proficiencyLevel.charAt(0) + s.proficiencyLevel.slice(1).toLowerCase()}` : ""}
            </span>
          ))}
        </div>
      </>)}

      {resume.projects?.length > 0 && (<>
        <ProSectionTitle title="Projects" />
        <div className="space-y-3">
          {resume.projects.map((p) => (
            <div key={p.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">
                  {p.projectName}
                  {p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="ml-1 text-brand"><Globe className="inline h-3 w-3" /></a>}
                </span>
                <span className="text-[11px] text-slate-500">{fmtRange(p.startDate, p.endDate, p.isOngoing)}</span>
              </div>
              {p.description && <p className="text-slate-700 mt-0.5 leading-relaxed">{p.description}</p>}
              {p.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.technologies.map((t) => (
                    <span key={t} className="text-[10px] border border-[#1e3a5f] text-[#1e3a5f] rounded px-1.5 py-0.5">{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </>)}

      {resume.certifications?.length > 0 && (<>
        <ProSectionTitle title="Certifications" />
        <div className="space-y-2">
          {resume.certifications.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">{c.certificationName}</span>
                <span className="text-[11px] text-slate-500">{fmt(c.issueDate)}{c.expirationDate ? ` – ${fmt(c.expirationDate)}` : ""}</span>
              </div>
              <div className="text-slate-600 text-[11px]">
                {c.issuingOrganization}{c.credentialId ? ` · ID: ${c.credentialId}` : ""}
                {c.credentialUrl && <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="ml-1 text-brand hover:underline">View credential</a>}
              </div>
            </div>
          ))}
        </div>
      </>)}

      {resume.awards?.length > 0 && (<>
        <ProSectionTitle title="Awards" />
        <div className="space-y-2">
          {resume.awards.map((a) => (
            <div key={a.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">{a.awardTitle}</span>
                <span className="text-[11px] text-slate-500">{fmt(a.awardDate)}</span>
              </div>
              <div className="text-slate-600 text-[11px]">{a.awardingOrganization}</div>
              {a.description && <p className="text-slate-700 mt-0.5 text-[12px]">{a.description}</p>}
            </div>
          ))}
        </div>
      </>)}

      {resume.languages?.length > 0 && (<>
        <ProSectionTitle title="Languages" />
        <div className="flex flex-wrap gap-3">
          {resume.languages.map((l) => (
            <span key={l.id} className="text-[12px]">
              <span className="font-medium">{l.languageName}</span>
              {l.proficiencyLevel && <span className="text-slate-500"> ({LANG_LBL[l.proficiencyLevel]})</span>}
            </span>
          ))}
        </div>
      </>)}
    </div>
  )
}

// ── CLASSIC Template ───────────────────────────────────────────────────────────

function ClassicSection({ title }) {
  return (
    <div className="font-bold text-[11px] uppercase tracking-widest text-[#1f2937] border-b-2 border-[#1f2937] mb-2 mt-5 pb-0.5">
      {title}
    </div>
  )
}

function ClassicTemplate({ resume }) {
  const pi = resume.personalInfo ?? {}
  return (
    <div className="font-serif text-[13px] text-slate-800 min-h-[1056px] bg-[#fdfaf5]">
      {/* Dark header */}
      <div className="bg-[#1f2937] text-white px-12 py-8 text-center">
        {pi.profileImage && (
          <div className="flex justify-center mb-3">
            <img src={pi.profileImage} alt={fullName(pi)} className="h-20 w-20 rounded-full object-cover border-2 border-white/30" />
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-wide">{fullName(pi)}</h1>
        {pi.headline && <p className="text-slate-300 mt-1 text-sm">{pi.headline}</p>}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 mt-3 text-[11px] text-slate-300">
          {pi.email        && <span>{pi.email}</span>}
          {pi.phone        && <span>{pi.phone}</span>}
          {(pi.city||pi.country) && <span>{loc(pi.city, pi.country)}</span>}
          {pi.linkedinUrl  && <a href={pi.linkedinUrl}  target="_blank" rel="noreferrer" className="hover:text-white underline">LinkedIn</a>}
          {pi.githubUrl    && <a href={pi.githubUrl}    target="_blank" rel="noreferrer" className="hover:text-white underline">GitHub</a>}
          {pi.portfolioUrl && <a href={pi.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-white underline">Portfolio</a>}
        </div>
      </div>

      <div className="px-12 py-6">
        {resume.summary && (<>
          <ClassicSection title="Professional Summary" />
          <p className="text-slate-700 leading-relaxed">{resume.summary}</p>
        </>)}

        {resume.workExperiences?.length > 0 && (<>
          <ClassicSection title="Professional Experience" />
          <div className="space-y-4">
            {resume.workExperiences.map((w) => (
              <div key={w.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{w.jobTitle} — {w.companyName}</span>
                  <span className="text-slate-500 text-xs italic">{fmtRange(w.startDate, w.endDate, w.isCurrentJob)}</span>
                </div>
                {loc(w.city, w.country) && <div className="text-slate-500 text-xs italic">{loc(w.city, w.country)}</div>}
                {w.description && <p className="text-slate-700 mt-1 leading-relaxed">{w.description}</p>}
                {w.technologies?.length > 0 && (
                  <p className="text-slate-600 text-xs mt-1 italic">Technologies: {w.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </>)}

        {resume.educations?.length > 0 && (<>
          <ClassicSection title="Education" />
          <div className="space-y-3">
            {resume.educations.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}</span>
                  <span className="text-slate-500 text-xs italic">{fmtRange(e.startDate, e.endDate, e.isCurrentlyStudying)}</span>
                </div>
                <div className="italic text-slate-600 text-xs">
                  {e.institutionName}{loc(e.city, e.country) ? ` · ${loc(e.city, e.country)}` : ""}{e.gpa ? ` · GPA: ${e.gpa}` : ""}
                </div>
                {e.description && <p className="text-slate-700 text-xs mt-0.5">{e.description}</p>}
              </div>
            ))}
          </div>
        </>)}

        {resume.skills?.length > 0 && (<>
          <ClassicSection title="Skills" />
          <p className="text-slate-700 leading-relaxed">{resume.skills.map((s) => s.skillName).join(" · ")}</p>
        </>)}

        {resume.projects?.length > 0 && (<>
          <ClassicSection title="Projects" />
          <div className="space-y-3">
            {resume.projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{p.projectName}</span>
                  <span className="text-slate-500 text-xs italic">{fmtRange(p.startDate, p.endDate, p.isOngoing)}</span>
                </div>
                {p.description && <p className="text-slate-700 mt-0.5 leading-relaxed">{p.description}</p>}
                {p.technologies?.length > 0 && (
                  <p className="text-slate-600 text-xs italic mt-0.5">Technologies: {p.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </>)}

        {resume.certifications?.length > 0 && (<>
          <ClassicSection title="Certifications" />
          <div className="space-y-2">
            {resume.certifications.map((c) => (
              <div key={c.id} className="flex justify-between items-baseline">
                <span className="font-bold">{c.certificationName} — {c.issuingOrganization}</span>
                <span className="text-slate-500 text-xs italic">{fmt(c.issueDate)}</span>
              </div>
            ))}
          </div>
        </>)}

        {resume.awards?.length > 0 && (<>
          <ClassicSection title="Awards &amp; Honours" />
          <div className="space-y-2">
            {resume.awards.map((a) => (
              <div key={a.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">{a.awardTitle} — {a.awardingOrganization}</span>
                  <span className="text-slate-500 text-xs italic">{fmt(a.awardDate)}</span>
                </div>
                {a.description && <p className="text-slate-700 text-xs mt-0.5">{a.description}</p>}
              </div>
            ))}
          </div>
        </>)}

        {resume.languages?.length > 0 && (<>
          <ClassicSection title="Languages" />
          <p className="text-slate-700">
            {resume.languages.map((l) =>
              `${l.languageName}${l.proficiencyLevel ? ` (${LANG_LBL[l.proficiencyLevel]})` : ""}`
            ).join(" · ")}
          </p>
        </>)}
      </div>
    </div>
  )
}

// ── MODERN Template ────────────────────────────────────────────────────────────

function ModernSectionTitle({ title, light = false }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-4">
      <div className={`h-2 w-2 rounded-full shrink-0 ${light ? "bg-blue-300" : "bg-[#1e40af]"}`} />
      <span className={`text-[10px] font-bold uppercase tracking-wider ${light ? "text-blue-200" : "text-[#1e40af]"}`}>
        {title}
      </span>
      <div className={`flex-1 h-px ${light ? "bg-blue-500/40" : "bg-[#bfdbfe]"}`} />
    </div>
  )
}

function ModernTemplate({ resume }) {
  const pi = resume.personalInfo ?? {}
  const initials = [(pi.firstName?.[0] ?? ""), (pi.lastName?.[0] ?? "")].join("")
  return (
    <div className="font-sans text-[12px] text-slate-800 min-h-[1056px] flex">
      {/* Sidebar */}
      <div className="w-[34%] bg-[#1e3a8a] text-white p-7 flex flex-col">
        {/* Avatar */}
        <div className="h-20 w-20 rounded-full bg-blue-300/20 border-2 border-blue-300 flex items-center justify-center mx-auto mb-4 text-xl font-bold text-blue-100 overflow-hidden">
          {pi.profileImage
            ? <img src={pi.profileImage} alt={fullName(pi)} className="h-full w-full object-cover" />
            : (initials || "?")}
        </div>
        <h1 className="text-[15px] font-bold text-center leading-tight">{fullName(pi)}</h1>
        {pi.headline && <p className="text-blue-300 text-[11px] text-center mt-1">{pi.headline}</p>}

        {/* Contact */}
        <ModernSectionTitle title="Contact" light />
        <div className="space-y-1.5 text-[11px] text-blue-100">
          {pi.email        && <div className="flex items-start gap-1.5"><Mail className="h-3 w-3 mt-0.5 shrink-0" /><span className="break-all">{pi.email}</span></div>}
          {pi.phone        && <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" />{pi.phone}</div>}
          {(pi.city||pi.country) && <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0" />{loc(pi.city, pi.country)}</div>}
          {pi.linkedinUrl  && <div className="flex items-center gap-1.5"><LinkedInLogoIcon className="h-3 w-3 shrink-0" /><a href={pi.linkedinUrl}  target="_blank" rel="noreferrer" className="hover:text-white break-all">LinkedIn</a></div>}
          {pi.githubUrl    && <div className="flex items-center gap-1.5"><GitHubLogoIcon className="h-3 w-3 shrink-0" /><a href={pi.githubUrl}    target="_blank" rel="noreferrer" className="hover:text-white break-all">GitHub</a></div>}
          {pi.portfolioUrl && <div className="flex items-center gap-1.5"><Globe className="h-3 w-3 shrink-0" /><a href={pi.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-white break-all">Portfolio</a></div>}
        </div>

        {/* Skills */}
        {resume.skills?.length > 0 && (<>
          <ModernSectionTitle title="Skills" light />
          <div className="space-y-1.5">
            {resume.skills.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-[10px] text-blue-100 mb-0.5">
                  <span>{s.skillName}</span>
                  {s.proficiencyLevel && (
                    <span className="text-blue-300">
                      {s.proficiencyLevel.charAt(0) + s.proficiencyLevel.slice(1).toLowerCase()}
                    </span>
                  )}
                </div>
                <div className="h-1.5 bg-blue-900/50 rounded-full">
                  <div
                    className="h-full bg-blue-300 rounded-full"
                    style={{ width: `${PROF_PCT[s.proficiencyLevel] ?? 50}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>)}

        {/* Languages */}
        {resume.languages?.length > 0 && (<>
          <ModernSectionTitle title="Languages" light />
          <div className="space-y-1 text-[11px]">
            {resume.languages.map((l) => (
              <div key={l.id} className="flex justify-between text-blue-100">
                <span>{l.languageName}</span>
                {l.proficiencyLevel && <span className="text-blue-300">{LANG_LBL[l.proficiencyLevel]}</span>}
              </div>
            ))}
          </div>
        </>)}

        {/* Certifications */}
        {resume.certifications?.length > 0 && (<>
          <ModernSectionTitle title="Certifications" light />
          <div className="space-y-2 text-[11px] text-blue-100">
            {resume.certifications.map((c) => (
              <div key={c.id}>
                <div className="font-medium">{c.certificationName}</div>
                <div className="text-blue-300">{c.issuingOrganization}{c.issueDate ? ` · ${fmt(c.issueDate)}` : ""}</div>
              </div>
            ))}
          </div>
        </>)}

        {/* Awards */}
        {resume.awards?.length > 0 && (<>
          <ModernSectionTitle title="Awards" light />
          <div className="space-y-2 text-[11px] text-blue-100">
            {resume.awards.map((a) => (
              <div key={a.id}>
                <div className="font-medium">{a.awardTitle}</div>
                <div className="text-blue-300">{a.awardingOrganization}{a.awardDate ? ` · ${fmt(a.awardDate)}` : ""}</div>
              </div>
            ))}
          </div>
        </>)}
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        {resume.summary && (<>
          <ModernSectionTitle title="Profile" />
          <p className="text-slate-700 leading-relaxed text-[13px]">{resume.summary}</p>
        </>)}

        {resume.workExperiences?.length > 0 && (<>
          <ModernSectionTitle title="Work Experience" />
          <div className="space-y-4">
            {resume.workExperiences.map((w) => (
              <div key={w.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{w.jobTitle}</span>
                  <span className="text-[11px] text-slate-500">{fmtRange(w.startDate, w.endDate, w.isCurrentJob)}</span>
                </div>
                <div className="text-[#1e40af] text-[11px] font-medium">
                  {w.companyName}{loc(w.city, w.country) ? ` · ${loc(w.city, w.country)}` : ""}
                </div>
                {w.description && <p className="text-slate-700 mt-1 leading-relaxed">{w.description}</p>}
                {w.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {w.technologies.map((t) => (
                      <span key={t} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}

        {resume.educations?.length > 0 && (<>
          <ModernSectionTitle title="Education" />
          <div className="space-y-3">
            {resume.educations.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}</span>
                  <span className="text-[11px] text-slate-500">{fmtRange(e.startDate, e.endDate, e.isCurrentlyStudying)}</span>
                </div>
                <div className="text-[#1e40af] text-[11px] font-medium">
                  {e.institutionName}{loc(e.city, e.country) ? ` · ${loc(e.city, e.country)}` : ""}{e.gpa ? ` · GPA: ${e.gpa}` : ""}
                </div>
                {e.description && <p className="text-slate-700 mt-0.5 text-xs">{e.description}</p>}
              </div>
            ))}
          </div>
        </>)}

        {resume.projects?.length > 0 && (<>
          <ModernSectionTitle title="Projects" />
          <div className="space-y-3">
            {resume.projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">
                    {p.projectName}
                    {p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="ml-1 text-[#1e40af]"><Globe className="inline h-3 w-3" /></a>}
                  </span>
                  <span className="text-[11px] text-slate-500">{fmtRange(p.startDate, p.endDate, p.isOngoing)}</span>
                </div>
                {p.description && <p className="text-slate-700 mt-0.5 leading-relaxed">{p.description}</p>}
                {p.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.technologies.map((t) => (
                      <span key={t} className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}
      </div>
    </div>
  )
}

// ── MINIMAL Template ───────────────────────────────────────────────────────────

function MinSection({ title }) {
  return (
    <div className="mt-6 mb-2">
      <div className="text-[9px] uppercase tracking-[0.25em] text-slate-400 mb-1">{title}</div>
      <div className="h-px bg-slate-200" />
    </div>
  )
}

function MinimalTemplate({ resume }) {
  const pi = resume.personalInfo ?? {}
  return (
    <div className="font-sans text-[13px] text-slate-800 px-14 py-12 min-h-[1056px] bg-white">
      {/* Header */}
      <div className="mb-1 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-slate-900">{fullName(pi)}</h1>
          {pi.headline && <p className="text-slate-500 mt-1 text-sm">{pi.headline}</p>}
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[11px] text-slate-400">
            {pi.email        && <span>{pi.email}</span>}
            {pi.phone        && <span>{pi.phone}</span>}
            {(pi.city||pi.country) && <span>{loc(pi.city, pi.country)}</span>}
            {pi.linkedinUrl  && <a href={pi.linkedinUrl}  target="_blank" rel="noreferrer" className="hover:text-slate-700">LinkedIn</a>}
            {pi.githubUrl    && <a href={pi.githubUrl}    target="_blank" rel="noreferrer" className="hover:text-slate-700">GitHub</a>}
            {pi.portfolioUrl && <a href={pi.portfolioUrl} target="_blank" rel="noreferrer" className="hover:text-slate-700">Portfolio</a>}
          </div>
        </div>
        {pi.profileImage && (
          <img src={pi.profileImage} alt={fullName(pi)} className="h-20 w-20 rounded-full object-cover border border-slate-200 shrink-0" />
        )}
      </div>

      {resume.summary && (<>
        <MinSection title="About" />
        <p className="text-slate-600 leading-relaxed">{resume.summary}</p>
      </>)}

      {resume.workExperiences?.length > 0 && (<>
        <MinSection title="Experience" />
        <div className="space-y-5">
          {resume.workExperiences.map((w) => (
            <div key={w.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">{w.jobTitle} · {w.companyName}</span>
                <span className="text-[11px] text-slate-400">{fmtRange(w.startDate, w.endDate, w.isCurrentJob)}</span>
              </div>
              {loc(w.city, w.country) && <div className="text-slate-400 text-[11px]">{loc(w.city, w.country)}</div>}
              {w.description && <p className="text-slate-600 mt-1.5 leading-relaxed">{w.description}</p>}
              {w.technologies?.length > 0 && (
                <p className="text-[11px] text-slate-400 mt-1">{w.technologies.join(" · ")}</p>
              )}
            </div>
          ))}
        </div>
      </>)}

      {resume.educations?.length > 0 && (<>
        <MinSection title="Education" />
        <div className="space-y-3">
          {resume.educations.map((e) => (
            <div key={e.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">
                  {e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""} · {e.institutionName}
                </span>
                <span className="text-[11px] text-slate-400">{fmtRange(e.startDate, e.endDate, e.isCurrentlyStudying)}</span>
              </div>
              {e.gpa && <div className="text-slate-400 text-[11px]">GPA: {e.gpa}</div>}
              {e.description && <p className="text-slate-600 text-[12px] mt-0.5">{e.description}</p>}
            </div>
          ))}
        </div>
      </>)}

      {resume.skills?.length > 0 && (<>
        <MinSection title="Skills" />
        <p className="text-slate-600">{resume.skills.map((s) => s.skillName).join(" · ")}</p>
      </>)}

      {resume.projects?.length > 0 && (<>
        <MinSection title="Projects" />
        <div className="space-y-3">
          {resume.projects.map((p) => (
            <div key={p.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900">
                  {p.projectName}
                  {p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="ml-1 text-slate-400 hover:text-slate-700"><Globe className="inline h-3 w-3" /></a>}
                </span>
                <span className="text-[11px] text-slate-400">{fmtRange(p.startDate, p.endDate, p.isOngoing)}</span>
              </div>
              {p.description && <p className="text-slate-600 mt-0.5 leading-relaxed">{p.description}</p>}
              {p.technologies?.length > 0 && (
                <p className="text-[11px] text-slate-400 mt-0.5">{p.technologies.join(" · ")}</p>
              )}
            </div>
          ))}
        </div>
      </>)}

      {resume.certifications?.length > 0 && (<>
        <MinSection title="Certifications" />
        <div className="space-y-2">
          {resume.certifications.map((c) => (
            <div key={c.id} className="flex justify-between items-baseline">
              <span className="text-slate-700">{c.certificationName} · {c.issuingOrganization}</span>
              <span className="text-[11px] text-slate-400">{fmt(c.issueDate)}</span>
            </div>
          ))}
        </div>
      </>)}

      {resume.awards?.length > 0 && (<>
        <MinSection title="Awards" />
        <div className="space-y-2">
          {resume.awards.map((a) => (
            <div key={a.id} className="flex justify-between items-baseline">
              <span className="text-slate-700">{a.awardTitle} · {a.awardingOrganization}</span>
              <span className="text-[11px] text-slate-400">{fmt(a.awardDate)}</span>
            </div>
          ))}
        </div>
      </>)}

      {resume.languages?.length > 0 && (<>
        <MinSection title="Languages" />
        <p className="text-slate-600">
          {resume.languages.map((l) =>
            `${l.languageName}${l.proficiencyLevel ? ` (${LANG_LBL[l.proficiencyLevel]})` : ""}`
          ).join(" · ")}
        </p>
      </>)}
    </div>
  )
}

// ── CREATIVE Template ──────────────────────────────────────────────────────────

function CrtSection({ title }) {
  return (
    <div className="flex items-center gap-2 mt-5 mb-2">
      <div className="h-3.5 w-1 rounded-full bg-[#7c3aed]" />
      <span className="font-bold text-[#7c3aed] text-[10px] uppercase tracking-wider">{title}</span>
    </div>
  )
}

function CreativeTemplate({ resume }) {
  const pi = resume.personalInfo ?? {}
  return (
    <div className="font-sans text-[13px] text-slate-800 min-h-[1056px] bg-[#f5f3ff]">
      {/* Purple gradient header */}
      <div className="bg-linear-to-br from-[#7c3aed] to-[#4f46e5] text-white px-12 py-10 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/5" />
        <div className="relative flex items-start justify-between gap-6">
          <div>
          <h1 className="text-3xl font-bold">{fullName(pi)}</h1>
          {pi.headline && <p className="text-purple-200 mt-1 text-base">{pi.headline}</p>}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-sm text-purple-200">
            {pi.email        && <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 shrink-0" />{pi.email}</span>}
            {pi.phone        && <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 shrink-0" />{pi.phone}</span>}
            {(pi.city||pi.country) && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 shrink-0" />{loc(pi.city, pi.country)}</span>}
            {pi.linkedinUrl  && <a href={pi.linkedinUrl}  target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white"><LinkedInLogoIcon className="h-3.5 w-3.5 shrink-0" />LinkedIn</a>}
            {pi.githubUrl    && <a href={pi.githubUrl}    target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white"><GitHubLogoIcon className="h-3.5 w-3.5 shrink-0" />GitHub</a>}
            {pi.portfolioUrl && <a href={pi.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white"><Globe className="h-3.5 w-3.5 shrink-0" />Portfolio</a>}
          </div>
          </div>
          {pi.profileImage && (
            <img src={pi.profileImage} alt={fullName(pi)} className="h-24 w-24 rounded-full object-cover border-4 border-white/30 shrink-0" />
          )}
        </div>
      </div>

      <div className="px-12 py-6">
        {/* Summary highlight */}
        {resume.summary && (
          <div className="bg-violet-100 border-l-4 border-[#7c3aed] rounded-r-lg p-4 mt-2">
            <p className="font-semibold text-[#7c3aed] text-[10px] uppercase tracking-wider mb-1">Profile</p>
            <p className="text-slate-700 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {resume.workExperiences?.length > 0 && (<>
          <CrtSection title="Experience" />
          <div className="space-y-4">
            {resume.workExperiences.map((w) => (
              <div key={w.id} className="border-l-2 border-purple-200 pl-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{w.jobTitle}</span>
                  <span className="text-[11px] text-purple-500 font-medium">{fmtRange(w.startDate, w.endDate, w.isCurrentJob)}</span>
                </div>
                <div className="text-[#7c3aed] font-medium text-[11px]">
                  {w.companyName}{loc(w.city, w.country) ? ` · ${loc(w.city, w.country)}` : ""}
                </div>
                {w.description && <p className="text-slate-700 mt-1 leading-relaxed">{w.description}</p>}
                {w.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {w.technologies.map((t) => (
                      <span key={t} className="text-[10px] bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}

        {resume.educations?.length > 0 && (<>
          <CrtSection title="Education" />
          <div className="space-y-3">
            {resume.educations.map((e) => (
              <div key={e.id} className="border-l-2 border-purple-200 pl-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{e.degree}{e.fieldOfStudy ? `, ${e.fieldOfStudy}` : ""}</span>
                  <span className="text-[11px] text-purple-500 font-medium">{fmtRange(e.startDate, e.endDate, e.isCurrentlyStudying)}</span>
                </div>
                <div className="text-[#7c3aed] font-medium text-[11px]">
                  {e.institutionName}{loc(e.city, e.country) ? ` · ${loc(e.city, e.country)}` : ""}{e.gpa ? ` · GPA: ${e.gpa}` : ""}
                </div>
                {e.description && <p className="text-slate-700 text-xs mt-0.5">{e.description}</p>}
              </div>
            ))}
          </div>
        </>)}

        {resume.skills?.length > 0 && (<>
          <CrtSection title="Skills" />
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s) => (
              <span key={s.id} className="text-xs bg-violet-200 text-violet-800 rounded-full px-3 py-1 font-medium">
                {s.skillName}
              </span>
            ))}
          </div>
        </>)}

        {resume.projects?.length > 0 && (<>
          <CrtSection title="Projects" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {resume.projects.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-purple-100 p-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-slate-900">
                    {p.projectName}
                    {p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="ml-1 text-[#7c3aed]"><Globe className="inline h-3 w-3" /></a>}
                  </span>
                  <span className="text-[10px] text-purple-500">{fmtRange(p.startDate, p.endDate, p.isOngoing)}</span>
                </div>
                {p.description && <p className="text-slate-700 text-xs leading-relaxed">{p.description}</p>}
                {p.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {p.technologies.map((t) => (
                      <span key={t} className="text-[10px] bg-violet-100 text-violet-700 rounded-full px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}

        {/* Bottom row: Certs + Awards + Languages */}
        {(resume.certifications?.length > 0 || resume.awards?.length > 0 || resume.languages?.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
            {resume.certifications?.length > 0 && (
              <div>
                <CrtSection title="Certifications" />
                <div className="space-y-2">
                  {resume.certifications.map((c) => (
                    <div key={c.id} className="bg-white rounded-lg border border-purple-100 p-3">
                      <div className="font-medium text-slate-900 text-xs">{c.certificationName}</div>
                      <div className="text-purple-600 text-[11px]">{c.issuingOrganization}</div>
                      {c.issueDate && <div className="text-slate-400 text-[10px]">{fmt(c.issueDate)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {resume.awards?.length > 0 && (
              <div>
                <CrtSection title="Awards" />
                <div className="space-y-2">
                  {resume.awards.map((a) => (
                    <div key={a.id} className="bg-white rounded-lg border border-purple-100 p-3">
                      <div className="font-medium text-slate-900 text-xs">{a.awardTitle}</div>
                      <div className="text-purple-600 text-[11px]">{a.awardingOrganization}</div>
                      {a.awardDate && <div className="text-slate-400 text-[10px]">{fmt(a.awardDate)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {resume.languages?.length > 0 && (
              <div>
                <CrtSection title="Languages" />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {resume.languages.map((l) => (
                    <span key={l.id} className="text-[11px] bg-violet-200 text-violet-800 rounded-full px-2.5 py-1">
                      {l.languageName}{l.proficiencyLevel ? ` · ${LANG_LBL[l.proficiencyLevel]}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Template map ───────────────────────────────────────────────────────────────

const TEMPLATE_MAP = {
  PROFESSIONAL: ProfessionalTemplate,
  CLASSIC:      ClassicTemplate,
  MODERN:       ModernTemplate,
  MINIMAL:      MinimalTemplate,
  CREATIVE:     CreativeTemplate,
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ResumeView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentResume: resume, isLoading, error } = useSelector((s) => s.resume)

  useEffect(() => {
    dispatch(fetchResumeById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (error) toast.error(error)
  }, [error])

  if (isLoading || !resume) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col">
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/resumes")}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />My Resumes
          </Button>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <div className="max-w-4xl w-full mx-auto my-8 bg-white shadow-xl rounded-lg p-12 space-y-6">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  const TemplateComp = TEMPLATE_MAP[resume.template] ?? ProfessionalTemplate

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* Action bar — hidden when printing */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 print:hidden">
        <Button variant="ghost" size="sm" onClick={() => navigate("/resumes")}>
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          My Resumes
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-medium hidden sm:block truncate max-w-xs">{resume.title}</span>
          <Button variant="outline" size="sm" onClick={() => navigate(`/resumes/${id}/edit`)}>
            <Pencil className="h-4 w-4 mr-1.5" />
            Edit
          </Button>
          <Button size="sm" className="bg-brand hover:bg-brand/90" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1.5" />
            Print / Download
          </Button>
        </div>
      </div>

      {/* Resume paper */}
      <div className="max-w-4xl mx-auto my-8 shadow-2xl rounded-lg overflow-hidden print:shadow-none print:my-0 print:max-w-full print:rounded-none">
        <TemplateComp resume={resume} />
      </div>
    </div>
  )
}
