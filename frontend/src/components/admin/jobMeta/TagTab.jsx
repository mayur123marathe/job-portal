import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search, Pencil, Trash2, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import TagFormDialog from "./TagFormDialog"
import MetaDeleteConfirmDialog from "./MetaDeleteConfirmDialog"
import { createTag, updateTag, deleteTag } from "@/store/jobMeta/jobMetaThunk"

const tagColors = [
  "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
  "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
  "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
  "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
]

function TagPill({ tag, colorClass, onEdit, onDelete, disabled }) {
  return (
    <div
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
        colorClass
      )}
    >
      <span>{tag.name}</span>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
        <button
          onClick={() => onEdit(tag)}
          disabled={disabled}
          className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
          title="Edit"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={() => onDelete(tag)}
          disabled={disabled}
          className="rounded-full p-0.5 hover:bg-red-200 transition-colors text-red-600"
          title="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function SkeletonPills() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton key={i} className="h-8 rounded-full" style={{ width: `${60 + (i % 4) * 20}px` }} />
      ))}
    </div>
  )
}

export default function TagTab({ tags, isLoading, isActionLoading }) {
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return tags
    const q = search.toLowerCase()
    return tags.filter((t) => t.name?.toLowerCase().includes(q) || t.slug?.toLowerCase().includes(q))
  }, [tags, search])

  const handleSubmit = (payload) => {
    const action = editTarget
      ? dispatch(updateTag({ id: editTarget.id, ...payload }))
      : dispatch(createTag(payload))

    action.unwrap()
      .then(() => { toast.success(editTarget ? "Tag updated" : "Tag created"); setFormOpen(false); setEditTarget(null) })
      .catch((err) => toast.error(err))
  }

  const handleDeleteConfirm = () => {
    dispatch(deleteTag(deleteTarget.id))
      .unwrap()
      .then(() => { toast.success("Tag deleted"); setDeleteTarget(null) })
      .catch((err) => toast.error(err))
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 border-slate-200 text-sm rounded-lg bg-white"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400">{filtered.length} / {tags.length} tags</span>
          <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800" onClick={() => { setEditTarget(null); setFormOpen(true) }}>
            <Plus className="h-3.5 w-3.5" /> Add Tag
          </Button>
        </div>
      </div>

      {/* Tags card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        {isLoading ? (
          <SkeletonPills />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-slate-400">
            <Tag className="h-10 w-10 opacity-30" />
            <p className="text-sm">No tags found</p>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-slate-200 text-slate-600"
              onClick={() => { setEditTarget(null); setFormOpen(true) }}
            >
              <Plus className="h-3.5 w-3.5" /> Create first tag
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filtered.map((tag, idx) => (
              <TagPill
                key={tag.id}
                tag={tag}
                colorClass={tagColors[idx % tagColors.length]}
                onEdit={(t) => { setEditTarget(t); setFormOpen(true) }}
                onDelete={setDeleteTarget}
                disabled={isActionLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Slug reference — shows slug codes */}
      {!isLoading && filtered.length > 0 && (
        <p className="text-xs text-slate-400 px-1">
          Hover a tag to see edit/delete actions. Slugs are auto-generated from names.
        </p>
      )}

      <TagFormDialog
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
        label="Tag"
        name={deleteTarget?.name}
      />
    </div>
  )
}
