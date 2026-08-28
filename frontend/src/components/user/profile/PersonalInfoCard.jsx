import { User, Mail, Phone, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function PersonalInfoCard({ user, editing, form, onFormChange }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-4 w-4 text-brand" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Full Name</Label>
            {editing ? (
              <Input
                value={form.fullName}
                onChange={(e) => onFormChange({ fullName: e.target.value })}
                placeholder="Your full name"
                className="focus-visible:ring-brand focus-visible:border-brand"
              />
            ) : (
              <p className="text-sm text-slate-900 font-medium py-2">{user?.fullName || "—"}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email Address</Label>
            <div className="flex items-center gap-2 py-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-900">{user?.email || "—"}</span>
              {user?.verified && (
                <Badge className="bg-green-50 text-green-700 text-xs ml-auto border border-green-200">Verified</Badge>
              )}
            </div>
            {editing && <p className="text-xs text-slate-400">Email cannot be changed here</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone Number</Label>
            {editing ? (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={form.phone}
                  onChange={(e) => onFormChange({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="pl-9 focus-visible:ring-brand focus-visible:border-brand"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 py-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-900">{user?.phone || "—"}</span>
              </div>
            )}
          </div>

          {/* Profile photo status */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Profile Photo</Label>
            <div className="flex items-center gap-3 py-2">
              {user?.profileImage ? (
                <>
                  <img
                    src={user.profileImage}
                    alt="avatar preview"
                    className="h-8 w-8 rounded-lg object-cover border border-slate-200"
                  />
                  <span className="text-sm text-green-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Photo set
                  </span>
                </>
              ) : (
                <span className="text-sm text-slate-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-orange-400" />
                  No photo — click avatar to upload
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
