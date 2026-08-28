import { Building2, Link2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BasicInfoForm from "@/components/employer/company/BasicInfoForm"
import SocialLinksForm from "@/components/employer/company/SocialLinksForm"

export default function CompanyProfileTabs({ company, isActionLoading }) {
  return (
    <Tabs defaultValue="basic" className="space-y-5">
      <TabsList className="bg-slate-100 p-1">
        <TabsTrigger value="basic" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <Building2 className="h-4 w-4" /> Basic Info
        </TabsTrigger>

        <TabsTrigger value="social" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">
          <Link2 className="h-4 w-4" /> Social Links
          {company.socialLinks?.length > 0 && (
            <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-700">
              {company.socialLinks.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800 mb-5">Basic Information</h3>
          <BasicInfoForm company={company} isActionLoading={isActionLoading} />
        </div>
      </TabsContent>

      <TabsContent value="social">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-800 mb-5">Social Media & Links</h3>
          <SocialLinksForm company={company} isActionLoading={isActionLoading} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
