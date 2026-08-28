import { useState, useMemo } from "react"
import { Check, ChevronsUpDown, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

/**
 * Multi-select component with search.
 *
 * Props:
 *   options      — array of { id: number, name: string }
 *   selectedIds  — array of selected ids (numbers)
 *   onChange     — (newIds: number[]) => void
 *   placeholder  — string shown when nothing selected
 *   maxBadges    — max badges shown in trigger before "+N more" (default 3)
 */
export default function MultiSelect({
  options = [],
  selectedIds = [],
  onChange,
  placeholder = "Select...",
  maxBadges = 3,
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    if (!search.trim()) return options
    const q = search.toLowerCase()
    return options.filter(o => o.name.toLowerCase().includes(q))
  }, [options, search])

  const selectedSet = new Set(selectedIds)

  const toggle = (id) => {
    if (selectedSet.has(id)) {
      onChange(selectedIds.filter(sid => sid !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  const remove = (e, id) => {
    e.stopPropagation()
    onChange(selectedIds.filter(sid => sid !== id))
  }

  const selectedOptions = options.filter(o => selectedSet.has(o.id))
  const visibleBadges = selectedOptions.slice(0, maxBadges)
  const hiddenCount = selectedOptions.length - visibleBadges.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors",
            "hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1",
            open && "border-blue-500 ring-2 ring-blue-500 ring-offset-1"
          )}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-slate-400 py-0.5">{placeholder}</span>
          ) : (
            <>
              {visibleBadges.map(o => (
                <Badge
                  key={o.id}
                  variant="secondary"
                  className="gap-1 px-1.5 py-0 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200"
                >
                  {o.name}
                  <span
                    role="button"
                    tabIndex={-1}
                    className="cursor-pointer hover:text-blue-900"
                    onMouseDown={e => remove(e, o.id)}
                  >
                    <X className="h-2.5 w-2.5" />
                  </span>
                </Badge>
              ))}
              {hiddenCount > 0 && (
                <Badge variant="outline" className="text-xs text-slate-500">
                  +{hiddenCount} more
                </Badge>
              )}
            </>
          )}
          <ChevronsUpDown className="ml-auto h-3.5 w-3.5 text-slate-400 shrink-0" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="start">
        {/* Search */}
        <div className="flex items-center border-b border-slate-100 px-3 py-2 gap-2">
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            className="flex-1 text-sm outline-none placeholder:text-slate-400"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Options list */}
        <div className="max-h-52 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-400">No results</div>
          ) : (
            filtered.map(o => {
              const isSelected = selectedSet.has(o.id)
              return (
                <button
                  key={o.id}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 transition-colors",
                    isSelected && "bg-blue-50"
                  )}
                  onClick={() => toggle(o.id)}
                >
                  <div className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    isSelected ? "border-brand bg-brand" : "border-slate-300"
                  )}>
                    {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  <span className={cn("truncate", isSelected && "font-medium text-blue-700")}>
                    {o.name}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {/* Footer */}
        {selectedIds.length > 0 && (
          <div className="border-t border-slate-100 px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-slate-500">{selectedIds.length} selected</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
              onClick={() => onChange([])}
            >
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
