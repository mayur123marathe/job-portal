// ── Shared mini helpers ───────────────────────────────────────────────────────

export function FakeLines({ count = 2, light = false }) {
  return (
    <div className="space-y-0.5 mt-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded ${light ? "bg-blue-300 opacity-60" : "bg-slate-200"}`}
          style={{ width: `${70 + (i % 2) * 15}%` }}
        />
      ))}
    </div>
  )
}

export function SectionBlock({ title, color }) {
  return (
    <div className="flex items-center gap-1 mb-0.5">
      <span className="font-bold" style={{ color }}>{title}</span>
      <div className="flex-1 h-px" style={{ backgroundColor: color }} />
    </div>
  )
}

function ClassicSection({ title }) {
  return (
    <div className="font-bold text-[7px] uppercase tracking-wide text-[#1f2937] border-b border-[#1f2937] mb-0.5 mt-1">
      {title}
    </div>
  )
}

function ModernSection({ title }) {
  return (
    <div className="flex items-center gap-1 mb-0.5">
      <div className="h-1.5 w-1.5 rounded-full bg-[#1e40af]" />
      <span className="font-bold text-[#1e40af]">{title}</span>
      <div className="flex-1 h-px bg-[#bfdbfe]" />
    </div>
  )
}

function CreativeSection({ title }) {
  return (
    <div className="font-bold text-[#7c3aed] mt-1 mb-0.5 flex items-center gap-0.5">
      <div className="h-1 w-1 rounded-full bg-[#7c3aed]" />
      {title}
    </div>
  )
}

// ── Template Previews ─────────────────────────────────────────────────────────

export function TemplateProfessional() {
  return (
    <div className="w-full h-full bg-white p-2.5 font-sans text-[6px] leading-tight select-none">
      <div className="border-b-2 border-[#1e3a5f] pb-1.5 mb-1.5">
        <div className="font-bold text-[9px] text-[#1e3a5f]">JOHN DOE</div>
        <div className="text-[#475569]">Software Engineer</div>
        <div className="flex gap-2 text-[#64748b] mt-0.5">
          <span>john@email.com</span>
          <span>+1 555-0100</span>
        </div>
      </div>
      <SectionBlock title="EXPERIENCE" color="#1e3a5f" />
      <div className="space-y-1 mb-1.5">
        <div className="font-semibold">Senior Engineer · TechCorp</div>
        <div className="text-[#64748b]">2021 – Present</div>
        <FakeLines count={2} />
      </div>
      <SectionBlock title="EDUCATION" color="#1e3a5f" />
      <FakeLines count={2} />
      <SectionBlock title="SKILLS" color="#1e3a5f" />
      <div className="flex flex-wrap gap-1 mt-0.5">
        {["React", "Node.js", "AWS", "Docker"].map((s) => (
          <span key={s} className="border border-[#1e3a5f] text-[#1e3a5f] rounded px-0.5">{s}</span>
        ))}
      </div>
    </div>
  )
}

export function TemplateClassic() {
  return (
    <div className="w-full h-full bg-[#fdfaf5] font-serif text-[6px] leading-tight select-none">
      <div className="bg-[#1f2937] text-white px-2.5 py-2 mb-1.5">
        <div className="font-bold text-[10px] text-center">JOHN DOE</div>
        <div className="text-[#d1d5db] text-center">john@email.com · +1 555-0100</div>
      </div>
      <div className="px-2.5">
        <ClassicSection title="PROFESSIONAL EXPERIENCE" />
        <div className="space-y-0.5 mb-1.5">
          <div className="font-bold">Senior Engineer — TechCorp</div>
          <div className="italic text-[#6b7280]">2021 – Present · San Francisco</div>
          <FakeLines count={2} />
        </div>
        <ClassicSection title="EDUCATION" />
        <div className="font-bold">B.S. Computer Science</div>
        <div className="italic text-[#6b7280]">UC Berkeley · 2019</div>
        <ClassicSection title="SKILLS & INTERESTS" />
        <FakeLines count={1} />
      </div>
    </div>
  )
}

export function TemplateModern() {
  return (
    <div className="w-full h-full flex text-[6px] leading-tight select-none font-sans">
      {/* Sidebar */}
      <div className="bg-[#1e40af] text-white w-[38%] p-2 flex flex-col gap-1.5">
        <div className="h-8 w-8 rounded-full bg-blue-300 mx-auto mb-0.5" />
        <div className="font-bold text-[8px] text-center leading-tight">John Doe</div>
        <div className="text-blue-200 text-center">Engineer</div>
        <div className="border-t border-blue-400 pt-1 mt-0.5">
          <div className="font-semibold text-blue-200 mb-0.5">CONTACT</div>
          <FakeLines count={3} light />
        </div>
        <div className="border-t border-blue-400 pt-1 mt-0.5">
          <div className="font-semibold text-blue-200 mb-0.5">SKILLS</div>
          {["React", "Node.js", "AWS"].map((s) => (
            <div key={s} className="flex items-center gap-1 mb-0.5">
              <div className="flex-1 bg-blue-700 rounded h-1">
                <div className="bg-white rounded h-1 w-3/4" />
              </div>
              <span className="text-blue-100 w-8 truncate">{s}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 p-2">
        <ModernSection title="EXPERIENCE" />
        <div className="mb-1.5">
          <div className="font-bold">Senior Engineer</div>
          <div className="text-[#6b7280]">TechCorp · 2021–Now</div>
          <FakeLines count={2} />
        </div>
        <ModernSection title="EDUCATION" />
        <div className="font-bold">B.S. Computer Science</div>
        <div className="text-[#6b7280]">UC Berkeley · 2019</div>
        <ModernSection title="PROJECTS" />
        <FakeLines count={2} />
      </div>
    </div>
  )
}

export function TemplateMinimal() {
  return (
    <div className="w-full h-full bg-white px-3 py-2.5 font-sans text-[6px] leading-tight select-none">
      <div className="mb-2">
        <div className="text-[11px] font-bold tracking-tight text-slate-900">John Doe</div>
        <div className="text-slate-500 mt-0.5">Software Engineer · San Francisco</div>
        <div className="flex gap-3 text-slate-400 mt-0.5">
          <span>john@email.com</span>
          <span>linkedin.com/in/johndoe</span>
        </div>
      </div>
      <div className="h-px bg-slate-200 mb-1.5" />
      <div className="mb-1.5">
        <div className="text-[7px] uppercase tracking-widest text-slate-400 mb-0.5">Experience</div>
        <div className="font-medium text-slate-900">Senior Engineer · TechCorp</div>
        <div className="text-slate-400">2021 – Present</div>
        <FakeLines count={1} />
      </div>
      <div className="h-px bg-slate-200 mb-1.5" />
      <div className="mb-1.5">
        <div className="text-[7px] uppercase tracking-widest text-slate-400 mb-0.5">Education</div>
        <div className="font-medium text-slate-900">B.S. Computer Science · UC Berkeley</div>
        <FakeLines count={1} />
      </div>
      <div className="h-px bg-slate-200 mb-1.5" />
      <div>
        <div className="text-[7px] uppercase tracking-widest text-slate-400 mb-0.5">Skills</div>
        <div className="text-slate-600">React, TypeScript, Node.js, PostgreSQL, AWS</div>
      </div>
    </div>
  )
}

export function TemplateCreative() {
  return (
    <div className="w-full h-full bg-[#f5f3ff] font-sans text-[6px] leading-tight select-none overflow-hidden">
      <div className="bg-linear-to-br from-[#7c3aed] to-[#4f46e5] text-white px-2.5 py-2 relative">
        <div className="absolute -top-2 -right-2 h-12 w-12 rounded-full bg-white opacity-10" />
        <div className="font-bold text-[10px]">John Doe</div>
        <div className="text-purple-200 text-[7px] mt-0.5">Creative Designer & Developer</div>
        <div className="flex gap-2 text-purple-300 mt-0.5">
          <span>john@email.com</span>
          <span>+1 555-0100</span>
        </div>
      </div>
      <div className="px-2.5 py-1.5">
        <div className="bg-violet-100 rounded p-1 mb-1.5 border-l-2 border-[#7c3aed]">
          <div className="font-semibold text-[#7c3aed]">Profile</div>
          <FakeLines count={1} />
        </div>
        <CreativeSection title="EXPERIENCE" />
        <div className="font-bold">UI Lead · DesignStudio</div>
        <div className="text-[#7c3aed]">2021 – Present</div>
        <FakeLines count={1} />
        <CreativeSection title="SKILLS" />
        <div className="flex flex-wrap gap-0.5 mt-0.5">
          {["Figma", "CSS", "React", "Branding"].map((s) => (
            <span key={s} className="bg-violet-200 text-violet-800 rounded-full px-1 py-0.5">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Template registry ─────────────────────────────────────────────────────────

export const TEMPLATES = [
  {
    value: "PROFESSIONAL",
    label: "Professional",
    tagline: "ATS-optimised, clean structure",
    bestFor: "Corporate, Finance, Engineering",
    accentColor: "#1e3a5f",
    preview: TemplateProfessional,
  },
  {
    value: "CLASSIC",
    label: "Classic",
    tagline: "Traditional single-column layout",
    bestFor: "Law, Academia, Government",
    accentColor: "#374151",
    preview: TemplateClassic,
  },
  {
    value: "MODERN",
    label: "Modern",
    tagline: "Two-column with accent sidebar",
    bestFor: "Tech, Product, Startups",
    accentColor: "#2563eb",
    preview: TemplateModern,
  },
  {
    value: "MINIMAL",
    label: "Minimal",
    tagline: "Clean whitespace, no decorations",
    bestFor: "Design, UX, Consultancy",
    accentColor: "#6b7280",
    preview: TemplateMinimal,
  },
  {
    value: "CREATIVE",
    label: "Creative",
    tagline: "Bold & graphic-heavy layout",
    bestFor: "Marketing, Media, Creative Arts",
    accentColor: "#7c3aed",
    preview: TemplateCreative,
  },
]

export const TEMPLATE_BADGE_COLORS = {
  PROFESSIONAL: "bg-slate-800 text-white",
  CLASSIC:      "bg-amber-800 text-white",
  MODERN:       "bg-brand text-white",
  MINIMAL:      "bg-gray-500 text-white",
  CREATIVE:     "bg-violet-600 text-white",
}
