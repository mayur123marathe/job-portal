import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shield, Lock, RefreshCw, AlertTriangle, KeyRound, Save } from "lucide-react"

export default function SecuritySettings() {
  return (
    <div className="space-y-6">
      {/* Auth Policies */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-500" />
            Authentication Policies
          </CardTitle>
          <CardDescription className="text-sm">
            Configure login and account security policies
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {[
              {
                id: "2fa",
                label: "Two-Factor Authentication",
                desc: "Require 2FA for all admin accounts",
                enabled: true,
              },
              {
                id: "rate_limit",
                label: "Login Rate Limiting",
                desc: "Lock accounts after too many failed attempts",
                enabled: true,
              },
              {
                id: "email_verify",
                label: "Email Verification Required",
                desc: "New users must verify email before accessing the platform",
                enabled: true,
              },
              {
                id: "strong_pwd",
                label: "Strong Password Policy",
                desc: "Require minimum 8 chars with uppercase, number, and symbol",
                enabled: true,
              },
              {
                id: "session_single",
                label: "Single Session Per User",
                desc: "Invalidate previous sessions on new login",
                enabled: false,
              },
            ].map((policy) => (
              <div
                key={policy.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex-1 pr-8">
                  <p className="text-sm font-semibold text-slate-900">{policy.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{policy.desc}</p>
                </div>
                <Switch defaultChecked={policy.enabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Token & Session */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-500" />
            Token & Session Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">JWT Expiry (hours)</Label>
              <Input defaultValue="24" type="number" className="h-9 border-slate-200" min={1} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Max Login Attempts</Label>
              <Input defaultValue="5" type="number" className="h-9 border-slate-200" min={3} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-700">Lockout Duration (min)</Label>
              <Input defaultValue="30" type="number" className="h-9 border-slate-200" min={5} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 shadow-sm border-l-4 border-l-red-400">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-sm text-red-600/80">
            These actions are irreversible. Proceed with extreme caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="text-sm font-semibold text-red-900">Invalidate All Sessions</p>
              <p className="text-xs text-red-600 mt-0.5">
                Force all users to re-authenticate immediately
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100 gap-1.5 shrink-0 h-8 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Force Logout All
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div>
              <p className="text-sm font-semibold text-red-900">Rotate JWT Secret</p>
              <p className="text-xs text-red-600 mt-0.5">
                All existing tokens will be invalidated instantly
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-700 hover:bg-red-100 gap-1.5 shrink-0 h-8 text-xs"
            >
              <KeyRound className="h-3.5 w-3.5" />
              Rotate Secret
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="border-slate-200 text-slate-600">
          Cancel
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
