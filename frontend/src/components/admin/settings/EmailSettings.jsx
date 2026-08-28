import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Mail, Send, Save, CheckCircle } from "lucide-react"

const emailTemplates = [
  { id: "welcome", label: "Welcome Email", enabled: true },
  { id: "application_received", label: "Application Received", enabled: true },
  { id: "application_status", label: "Application Status Update", enabled: true },
  { id: "job_match", label: "New Job Match", enabled: true },
  { id: "password_reset", label: "Password Reset", enabled: true },
  { id: "interview_invite", label: "Interview Invitation", enabled: true },
]

export default function EmailSettings() {
  return (
    <div className="space-y-6">
      {/* SMTP Config */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4 text-slate-500" />
            SMTP Configuration
          </CardTitle>
          <CardDescription className="text-sm">
            Configure your email server to send platform notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">SMTP Host</Label>
              <Input
                defaultValue="smtp.gmail.com"
                className="h-9 border-slate-200 focus-visible:ring-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">SMTP Port</Label>
              <Input
                defaultValue="587"
                className="h-9 border-slate-200 focus-visible:ring-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Username / Email</Label>
              <Input
                defaultValue="noreply@jobportal.com"
                className="h-9 border-slate-200 focus-visible:ring-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">App Password</Label>
              <Input
                type="password"
                defaultValue="secret_password"
                className="h-9 border-slate-200 focus-visible:ring-slate-300"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">From Name</Label>
              <Input
                defaultValue="Job Portal Pro"
                className="h-9 border-slate-200 focus-visible:ring-slate-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-slate-900">Enable SSL/TLS</p>
              <p className="text-xs text-slate-500 mt-0.5">Use encrypted connection for SMTP</p>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Test email */}
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-700 font-medium flex-1">
              SMTP connection verified successfully
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-100 h-8 text-xs"
            >
              <Send className="h-3 w-3" />
              Send Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Email Templates</CardTitle>
          <CardDescription className="text-sm">
            Control which automated emails are sent to users
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {emailTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/50 transition-colors"
              >
                <p className="text-sm font-medium text-slate-700">{tmpl.label}</p>
                <div className="flex items-center gap-3">
                  <button className="text-xs text-brand hover:text-brand/80 font-medium">
                    Edit
                  </button>
                  <Switch defaultChecked={tmpl.enabled} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="border-slate-200 text-slate-600">
          Cancel
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 gap-2">
          <Save className="h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </div>
  )
}
