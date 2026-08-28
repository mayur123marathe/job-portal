import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Zap, Mail, Shield } from "lucide-react"
import GeneralSettings from "@/components/admin/settings/GeneralSettings"
import FeatureToggles from "@/components/admin/settings/FeatureToggles"
import EmailSettings from "@/components/admin/settings/EmailSettings"
import SecuritySettings from "@/components/admin/settings/SecuritySettings"

const tabs = [
  { value: "general", label: "General", icon: Globe, component: GeneralSettings },
  { value: "features", label: "Features", icon: Zap, component: FeatureToggles },
  { value: "email", label: "Email", icon: Mail, component: EmailSettings },
  { value: "security", label: "Security", icon: Shield, component: SecuritySettings },
]

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Configure and manage your job portal platform
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        {/* Tab bar */}
        <TabsList className="bg-white border border-slate-200 p-1 h-auto rounded-xl gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg text-sm px-4 py-2 font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {/* Tab content */}
        {tabs.map((tab) => {
          const Component = tab.component
          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <Component />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
