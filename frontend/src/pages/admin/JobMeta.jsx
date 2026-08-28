import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderTree, Zap, Tag } from "lucide-react"
import { fetchCategories, fetchSkills, fetchTags } from "@/store/jobMeta/jobMetaThunk"
import { clearErrors } from "@/store/jobMeta/jobMetaSlice"
import CategoryTab from "@/components/admin/jobMeta/CategoryTab"
import SkillTab from "@/components/admin/jobMeta/SkillTab"
import TagTab from "@/components/admin/jobMeta/TagTab"

export default function AdminJobMeta() {
  const dispatch = useDispatch()
  const {
    categories, skills, tags,
    isLoadingCategories, isLoadingSkills, isLoadingTags,
    isActionLoading, error, actionError,
  } = useSelector((state) => state.jobMeta)

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchSkills())
    dispatch(fetchTags())
  }, [dispatch])

  // Show errors via toast
  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearErrors()) }
    if (actionError) { toast.error(actionError); dispatch(clearErrors()) }
  }, [error, actionError, dispatch])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Job Metadata</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Manage job categories, skills, and tags used across the platform
        </p>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { icon: FolderTree, label: "Categories", count: categories.length, color: "text-brand bg-blue-50 border-blue-200" },
          { icon: Zap, label: "Skills", count: skills.length, color: "text-violet-600 bg-violet-50 border-violet-200" },
          { icon: Tag, label: "Tags", count: tags.length, color: "text-amber-600 bg-amber-50 border-amber-200" },
        ].map(({ icon: Icon, label, count, color }) => (
          <div
            key={label}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${color}`}
          >
            <Icon className="h-4 w-4" />
            <span>{count}</span>
            <span className="font-normal opacity-70">{label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-auto gap-1">
          <TabsTrigger
            value="categories"
            className="gap-2 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-500"
          >
            <FolderTree className="h-4 w-4" />
            Categories
            <span className="ml-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 leading-none">
              {categories.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="gap-2 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-500"
          >
            <Zap className="h-4 w-4" />
            Skills
            <span className="ml-1 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold px-1.5 py-0.5 leading-none">
              {skills.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="tags"
            className="gap-2 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 text-slate-500"
          >
            <Tag className="h-4 w-4" />
            Tags
            <span className="ml-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 leading-none">
              {tags.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-0">
          <CategoryTab
            categories={categories}
            isLoading={isLoadingCategories}
            isActionLoading={isActionLoading}
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-0">
          <SkillTab
            skills={skills}
            isLoading={isLoadingSkills}
            isActionLoading={isActionLoading}
          />
        </TabsContent>

        <TabsContent value="tags" className="mt-0">
          <TagTab
            tags={tags}
            isLoading={isLoadingTags}
            isActionLoading={isActionLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
