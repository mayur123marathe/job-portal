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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, FolderTree, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import CategoryFormDialog from "./CategoryFormDialog"
import MetaDeleteConfirmDialog from "./MetaDeleteConfirmDialog"
import { createCategory, updateCategory, deleteCategory } from "@/store/jobMeta/jobMetaThunk"

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i} className="border-slate-100">
      <TableCell className="pl-6"><Skeleton className="h-4 w-4" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell />
    </TableRow>
  ))
}

export default function CategoryTab({ categories, isLoading, isActionLoading }) {
  const dispatch = useDispatch()
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Root categories for parent selector
  const rootCategories = useMemo(
    () => categories.filter((c) => !c.parentId),
    [categories]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return categories
    const q = search.toLowerCase()
    return categories.filter(
      (c) => c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q)
    )
  }, [categories, search])

  const handleSubmit = (payload) => {
    const action = editTarget
      ? dispatch(updateCategory({ id: editTarget.id, ...payload }))
      : dispatch(createCategory(payload))

    action
      .unwrap()
      .then(() => {
        toast.success(editTarget ? "Category updated" : "Category created")
        setFormOpen(false)
        setEditTarget(null)
      })
      .catch((err) => toast.error(err))
  }

  const handleDeleteConfirm = () => {
    dispatch(deleteCategory(deleteTarget.id))
      .unwrap()
      .then(() => {
        toast.success("Category deleted")
        setDeleteTarget(null)
      })
      .catch((err) => toast.error(err))
  }

  const openEdit = (cat) => {
    setEditTarget(cat)
    setFormOpen(true)
  }

  const openAdd = () => {
    setEditTarget(null)
    setFormOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 border-slate-200 text-sm rounded-lg bg-white"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-400">
            {filtered.length} / {categories.length}
          </span>
          <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800" onClick={openAdd}>
            <Plus className="h-3.5 w-3.5" /> Add Category
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-200">
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-10 pl-6">#</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Slug</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Parent</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sub-cats</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <SkeletonRows />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <FolderTree className="h-8 w-8 opacity-40" />
                    <p className="text-sm">No categories found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((cat, idx) => (
                <TableRow key={cat.id} className="group hover:bg-slate-50/50 border-slate-100">
                  <TableCell className="text-sm text-slate-400 font-medium pl-6">{idx + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {cat.parentId && (
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-slate-400 truncate max-w-[220px]">{cat.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {cat.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    {cat.parentName ? (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        {cat.parentName}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {cat.subCategories?.length > 0 ? (
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                        {cat.subCategories.length}
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        cat.active === false
                          ? "bg-slate-100 text-slate-500"
                          : "bg-emerald-50 text-emerald-700"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          cat.active === false ? "bg-slate-400" : "bg-emerald-500"
                        )}
                      />
                      {cat.active === false ? "Inactive" : "Active"}
                    </span>
                  </TableCell>
                  <TableCell className="pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={isActionLoading}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => openEdit(cat)}>
                          <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => setDeleteTarget(cat)}
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

      {/* Form Dialog */}
      <CategoryFormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        onSubmit={handleSubmit}
        isLoading={isActionLoading}
        initialData={editTarget}
        rootCategories={rootCategories}
      />

      {/* Delete Dialog */}
      <MetaDeleteConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isActionLoading}
        label="Category"
        name={deleteTarget?.name}
      />
    </div>
  )
}
