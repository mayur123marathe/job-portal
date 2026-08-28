import { ShieldCheck, Fingerprint, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ROLE_LABELS, STATUS_CONFIG } from "./profileUtils"

export default function AccountSecurityCard({ user }) {
  const statusCfg = STATUS_CONFIG[user?.status] ?? STATUS_CONFIG.ACTIVE

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4 text-brand" />
          Account & Security
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Role</p>
            <p className="text-sm font-medium text-slate-900">{ROLE_LABELS[user?.role] ?? user?.role ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Account Status</p>
            <Badge className={`${statusCfg.cls} hover:opacity-90`}>{statusCfg.label}</Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Sign-in Method</p>
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-900">
                {user?.authProvider === "GOOGLE" ? "Google OAuth" : "Email & Password"}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Email Verification</p>
            <div className="flex items-center gap-2">
              {user?.verified
                ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                : <AlertCircle className="h-4 w-4 text-orange-500" />}
              <span className="text-sm text-slate-900">{user?.verified ? "Verified" : "Not verified"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
