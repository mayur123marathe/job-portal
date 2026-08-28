import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import SkillFormDialog from "./SkillFormDialog"
import MetaDeleteConfirmDialog from "./MetaDeleteConfirmDialog"
import { createSkill, updateSkill, deleteSkill } from "@/store/jobMeta/jobMetaThunk"

const SKILL_CATEGORIES = [
  "PROGRAMMING_LANGUAGE", "FRAMEWORK", "DATABASE", "CLOUD_PLATFORM",
  "DEVOPS", "DESIGN", "SOFT_SKILL", "TOOL", "LANGUAGE", "OTHER",
]

const categoryColors = {
  PROGRAMMING_LANGUAGE: "bg-blue-50 text-blue-700 border-blue-200",
  FRAMEWORK: "bg-violet-50 text-violet-700 border-violet-200",
  DATABASE: "bg-orange-50 text-orange-700 border-orange-200",
  CLOUD_PLATFORM: "bg-sky-50 text-sky-700 border-sky-200",
  DEVOPS: "bg-amber-50 text-amber-700 border-amber-200",
  DESIGN: "bg-pink-50 text-pink-700 border-pink-200",
  SOFT_SKILL: "bg-emerald-50 text-emerald-700 border-emerald-200",
  TOOL: "bg-slate-100 text-slate-700 border-slate-200",
  LANGUAGE: "bg-teal-50 text-teal-700 border-teal-200",
  OTHER: "bg-gray-100 text-gray-600 border-gray-200",
}

function formatEnum(val) {
  return val.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

function SkeletonRows() {
  return Array.from({ length: 6 }).map((_, i) => (
    <TableRow key={i} className="border-slate-100">
      <TableCell className="pl-6"><Skeleton className="h-4 w-4" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-5 w-28 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
      <TableCell />
    </TableRow>
  ))
}

export default function SkillTab({ skills, isLoading, isActionLoading }) {
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    let list = [...skills]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((s) => s.name?.toLowerCase().includes(q) || s.slug?.toLowerCase().includes(q))
    }
    if (catFilter !== "all") list = list.filter((s) => s.category === catFilter)
    return list
  }, [skills, search, catFilter])

  const handleSubmit = (payload) => {
    const action = editTarget
      ? dispatch(updateSkill({ id: editTarget.id, ...payload }))
      : dispatch(createSkill(payload))

    action.unwrap()
      .then(() => { toast.success(editTarget ? "Skill updated" : "Skill created"); setFormOpen(false); setEditTarget(null) })
      .catch((err) => toast.error(err))
  }

  const handleDeleteConfirm = () => {
    dispatch(deleteSkill(deleteTarget.id))
      .unwrap()
      .then(() => { toast.success("Skill deleted"); setDeleteTarget(null) })
      .catch((err) => toast.error(err))
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 border-slate-200 text-sm rounded-lg bg-white"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400">{filtered.length} / {skills.length}</span>
          <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800" onClick={() => { setEditTarget(null); setFormOpen(true) }}>
            <Plus className="h-3.5 w-3.5" /> Add Skill
          </Button>
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setCatFilter("all")}
          className={cn(
            "text-xs font-semibold px-3 py-1 rounded-full border transition-colors",
            catFilter === "all"
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          )}
        >
          All
        </button>
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat === catFilter ? "all" : cat)}
            className={cn(
              "text-xs font-semibold px-3 py-1 rounded-full border transition-colors",
              catFilter === cat
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            )}
          >
            {formatEnum(cat)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-200">
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-10 pl-6">#</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Slug</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonRows />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Zap className="h-8 w-8 opacity-40" />
                    <p className="text-sm">No skills found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((skill, idx) => (
                <TableRow key={skill.id} className="group hover:bg-slate-50/50 border-slate-100">
                  <TableCell className="text-sm text-slate-400 font-medium pl-6">{idx + 1}</TableCell>
                  <TableCell className="text-sm font-semibold text-slate-900">{skill.name}</TableCell>
                  <TableCell>
                    <code className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{skill.slug}</code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-semibold border", categoryColors[skill.category] || categoryColors.OTHER)}
                    >
                      {formatEnum(skill.category || "OTHER")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      skill.active === false ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"
                    )}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", skill.active === false ? "bg-slate-400" : "bg-emerald-500")} />
                      {skill.active === false ? "Inactive" : "Active"}
                    </span>
                  </TableCell>
                  <TableCell className="pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" disabled={isActionLoading}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => { setEditTarget(skill); setFormOpen(true) }}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => setDeleteTarget(skill)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SkillFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSubmit={handleSubmit}
        isLoading={isActionLoading}
        initialData={editTarget}
      />

      <MetaDeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isActionLoading}
        label="Skill"
        name={deleteTarget?.name}
      />
    </div>
  )
}
