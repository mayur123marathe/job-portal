import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Globe, AlertTriangle, Save } from "lucide-react"

export default function GeneralSettings() {
  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4 text-slate-500" />
            Platform Information
          </CardTitle>
          <CardDescription className="text-sm">
            Basic details about your job portal platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Platform Name</Label>
              <Input
                defaultValue="Job Portal Pro"
                className="h-9 border-slate-200 focus-visible:ring-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Support Email</Label>
              <Input
                defaultValue="support@jobportal.com"
                className="h-9 border-slate-200 focus-visible:ring-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Primary Contact</Label>
              <Input
                defaultValue="+1 (555) 000-0000"
                className="h-9 border-slate-200 focus-visible:ring-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Website URL</Label>
              <Input
                defaultValue="https://jobportal.com"
                className="h-9 border-slate-200 focus-visible:ring-slate-300"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700">Platform Description</Label>
            <Textarea
              defaultValue="An AI-powered job portal connecting top employers with qualified job seekers worldwide."
              className="resize-none h-20 text-sm border-slate-200 focus-visible:ring-slate-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card className="border-0 shadow-sm border-l-4 border-l-amber-400">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            Maintenance Mode
          </CardTitle>
          <CardDescription className="text-sm">
            When enabled, the platform will show a maintenance page to regular users. Only admins
            can access the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-slate-900">Enable Maintenance Mode</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Redirects all non-admin traffic to a maintenance page
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Regional */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Regional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Default Timezone</Label>
              <Input
                defaultValue="UTC+0 (Coordinated Universal Time)"
                className="h-9 border-slate-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Default Currency</Label>
              <Input defaultValue="USD ($)" className="h-9 border-slate-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="border-slate-200 text-slate-600">
          Reset
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
