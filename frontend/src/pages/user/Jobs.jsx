import { useState, useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import JobCard from "@/components/user/jobs/JobCard"
import JobFilters from "@/components/user/jobs/JobFilters"
import { fetchJobs } from "@/store/job/jobThunk"
import { fetchMyApplications } from "@/store/application/applicationThunk"
import { enhanceSearch } from "@/store/ai/aiThunk"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Sparkles, SlidersHorizontal, Search,
  Briefcase, TrendingUp, X, ChevronLeft, ChevronRight,
  Wand2, Loader2,
} from "lucide-react"

// ── Constants ─────────────────────────────────────────────────────────────────

const JOBS_PER_PAGE = 10

const SORT_OPTIONS = [
  { value: "newest",       label: "Newest first" },
  { value: "salary-high",  label: "Salary: high → low" },
  { value: "salary-low",   label: "Salary: low → high" },
  { value: "most-applied", label: "Most applied" },
]

const DEFAULT_FILTERS = {
  jobTypes:  [],
  workModes: [],
  expLevels: [],
  minSalary: 0,
  maxSalary: 500000,
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sortJobs(jobs, sortBy) {
  const arr = [...jobs]
  if (sortBy === "salary-high")  return arr.sort((a, b) => Number(b.maxSalary ?? 0) - Number(a.maxSalary ?? 0))
  if (sortBy === "salary-low")   return arr.sort((a, b) => Number(a.minSalary ?? 0) - Number(b.minSalary ?? 0))
  if (sortBy === "most-applied") return arr.sort((a, b) => (b.applicationCount ?? 0) - (a.applicationCount ?? 0))
  return arr.sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0))
}

function labelFilter(v) {
  if (!v) return ""
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

function fmtSalary(val) {
  if (!val) return null
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(val)
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────

function JobCardSkeleton() {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Jobs() {
  const dispatch = useDispatch()
  const { jobs, jobsLoading, jobsError } = useSelector((s) => s.job)
  const { isEnhancingSearch } = useSelector((s) => s.ai)

  // ── Search state ───────────────────────────────────────────────────────────
  const [aiQuery, setAiQuery]                   = useState("")
  const [aiFiltersApplied, setAiFiltersApplied] = useState(null) // SearchEnhanceResponse

  // keyword / location are set by the AI enhance result and drive the API fetch
  const [keyword, setKeyword]   = useState("")
  const [location, setLocation] = useState("")

  // ── Client-side filters & UI ───────────────────────────────────────────────
  const [filters, setFilters]       = useState(DEFAULT_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy]           = useState("newest")
  const [page, setPage]               = useState(1)

  useEffect(() => { dispatch(fetchMyApplications()) }, [dispatch])

  // Debounced API fetch when keyword / location changes
  const debounceRef = useRef(null)
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      dispatch(fetchJobs({ keyword: keyword || undefined, location: location || undefined }))
      setPage(1)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [keyword, location, dispatch])

  // ── AI enhance ─────────────────────────────────────────────────────────────
  const handleEnhance = async () => {
    if (!aiQuery.trim()) return
    const result = await dispatch(enhanceSearch(aiQuery.trim()))
    if (result.meta.requestStatus !== "fulfilled") {
      toast.error(result.payload || "Could not analyze your search — please try again")
      return
    }
    const enh = result.payload
    const hasResults =
      enh.keywords?.length || enh.jobTypes?.length ||
      enh.workModes?.length || enh.experienceLevels?.length || enh.minSalary
    if (!hasResults) {
      toast.warning("Couldn't extract filters — showing all results")
      return
    }
    // Apply keyword + location to trigger API fetch
    setKeyword(enh.keywords?.[0] || "")
    setLocation(enh.locations?.[0] || "")
    // Apply structured filters
    const newFilters = { ...DEFAULT_FILTERS }
    if (enh.jobTypes?.length)          newFilters.jobTypes  = enh.jobTypes
    if (enh.workModes?.length)         newFilters.workModes = enh.workModes
    if (enh.experienceLevels?.length)  newFilters.expLevels = enh.experienceLevels
    if (enh.minSalary)                 newFilters.minSalary = enh.minSalary
    setFilters(newFilters)
    setPage(1)
    setAiFiltersApplied(enh)
    toast.success("AI filters applied!")
  }

  // ── Remove individual AI chip ──────────────────────────────────────────────
  const removeAiChip = (type, value) => {
    setFilters((prev) => {
      if (type === "jobType")   return { ...prev, jobTypes:  prev.jobTypes.filter((v) => v !== value) }
      if (type === "workMode")  return { ...prev, workModes: prev.workModes.filter((v) => v !== value) }
      if (type === "expLevel")  return { ...prev, expLevels: prev.expLevels.filter((v) => v !== value) }
      if (type === "minSalary") return { ...prev, minSalary: 0 }
      return prev
    })
  }

  const clearAiFilters = () => {
    setAiFiltersApplied(null)
    setFilters(DEFAULT_FILTERS)
    setKeyword("")
    setLocation("")
  }

  // ── Filter / sort / paginate ───────────────────────────────────────────────
  const filteredSorted = useMemo(() => {
    let result = jobs.filter((job) => {
      if (filters.jobTypes.length  > 0 && !filters.jobTypes.includes(job.jobType))          return false
      if (filters.workModes.length > 0 && !filters.workModes.includes(job.workMode))         return false
      if (filters.expLevels.length > 0 && !filters.expLevels.includes(job.experienceLevel)) return false
      if (filters.minSalary > 0 && job.maxSalary != null && Number(job.maxSalary) < filters.minSalary)    return false
      if (filters.maxSalary < 500000 && job.minSalary != null && Number(job.minSalary) > filters.maxSalary) return false
      return true
    })
    return sortJobs(result, sortBy)
  }, [jobs, filters, sortBy])

  const handleSetFilters = (val) => { setFilters(val); setPage(1) }
  const handleSortBy    = (val) => { setSortBy(val);  setPage(1) }

  const totalPages    = Math.max(1, Math.ceil(filteredSorted.length / JOBS_PER_PAGE))
  const paginatedJobs = filteredSorted.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE)

  const activeFilterCount =
    filters.jobTypes.length + filters.workModes.length + filters.expLevels.length +
    (filters.minSalary > 0 ? 1 : 0) + (filters.maxSalary < 500000 ? 1 : 0)

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    setKeyword("")
    setLocation("")
    setSortBy("newest")
    setPage(1)
    setAiFiltersApplied(null)
    setAiQuery("")
  }

  // Chips derived from currently-active AI-applied filters
  const aiChips = aiFiltersApplied ? [
    ...filters.jobTypes.map((v)  => ({ type: "jobType",   value: v,          label: labelFilter(v) })),
    ...filters.workModes.map((v) => ({ type: "workMode",  value: v,          label: labelFilter(v) })),
    ...filters.expLevels.map((v) => ({ type: "expLevel",  value: v,          label: labelFilter(v) })),
    ...(filters.minSalary > 0    ? [{ type: "minSalary",  value: "minSalary", label: `Min ${fmtSalary(filters.minSalary)}` }] : []),
  ] : []

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-linear-to-br from-primary via-blue-950 to-indigo-950 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Job Search
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-blue-100 mb-8 text-sm sm:text-base">
            Discover thousands of jobs matched to your skills and experience
          </p>

          {/* AI Search card */}
          <div className="bg-white rounded-2xl shadow-xl p-4 space-y-3">
            <div className="relative">
              <Wand2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              <textarea
                rows={2}
                placeholder={"Describe your ideal job in plain English…\ne.g. \"remote senior React developer, full-time, above $80k\""}
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleEnhance()
                }}
                className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">Tip: Ctrl + Enter to search</p>
              <Button
                onClick={handleEnhance}
                disabled={!aiQuery.trim() || isEnhancingSearch}
                className="bg-brand hover:bg-brand/90 rounded-xl px-6"
              >
                {isEnhancingSearch ? (
                  <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Analyzing…</>
                ) : (
                  <><Wand2 className="h-4 w-4 mr-1.5" />Search with AI</>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI filters strip ──────────────────────────────────────────────── */}
      {aiChips.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
              AI filters:
            </div>
            {aiChips.map((chip) => (
              <Badge
                key={`${chip.type}-${chip.value}`}
                variant="outline"
                className="bg-white border-blue-200 text-blue-700 text-xs gap-1 pr-1.5"
              >
                {chip.label}
                <button
                  onClick={() => removeAiChip(chip.type, chip.value)}
                  className="rounded-full hover:bg-blue-100 p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <button
              onClick={clearAiFilters}
              className="text-xs text-blue-500 hover:text-blue-700 underline underline-offset-2 ml-1"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats + Controls row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-brand" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {jobsLoading ? "Loading…" : `${filteredSorted.length} job${filteredSorted.length !== 1 ? "s" : ""} found`}
                </p>
                {(keyword || location) && (
                  <p className="text-xs text-slate-500">
                    {[keyword, location].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
            {activeFilterCount > 0 && (
              <Badge
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                onClick={handleReset}
              >
                <X className="h-3 w-3 mr-1" />
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <Select value={sortBy} onValueChange={handleSortBy}>
                <SelectTrigger className="w-44 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-1.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-brand text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar filters */}
          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <JobFilters
              filters={filters}
              setFilters={handleSetFilters}
              onReset={() => { setFilters(DEFAULT_FILTERS); setPage(1) }}
            />
          </div>

          {/* Job list */}
          <div className="lg:col-span-3 space-y-3">

            {jobsError && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <p className="text-red-700 font-medium mb-2">Failed to load jobs</p>
                  <p className="text-sm text-red-500 mb-4">{jobsError}</p>
                  <Button variant="outline" onClick={() => dispatch(fetchJobs({}))}>
                    Try again
                  </Button>
                </CardContent>
              </Card>
            )}

            {jobsLoading && Array.from({ length: 5 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}

            {!jobsLoading && !jobsError && filteredSorted.length === 0 && (
              <Card className="border-slate-200">
                <CardContent className="p-14 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">No jobs found</h3>
                  <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">
                    Try changing your search terms or clearing some filters to see more results.
                  </p>
                  <Button onClick={handleReset} variant="outline">
                    <X className="h-4 w-4 mr-1.5" />
                    Reset everything
                  </Button>
                </CardContent>
              </Card>
            )}

            {!jobsLoading && paginatedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {/* Pagination */}
            {!jobsLoading && filteredSorted.length > JOBS_PER_PAGE && (
              <div className="flex items-center justify-center gap-1 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…")
                    acc.push(p)
                    return acc
                  }, [])
                  .map((item, idx) =>
                    item === "…" ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-sm">…</span>
                    ) : (
                      <Button
                        key={item}
                        variant={page === item ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(item)}
                        className={`h-8 w-8 p-0 ${page === item ? "bg-brand hover:bg-brand/90 text-white" : ""}`}
                      >
                        {item}
                      </Button>
                    )
                  )}

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                <span className="text-xs text-slate-400 ml-2">
                  Page {page} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
