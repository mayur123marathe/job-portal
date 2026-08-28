import { Edit2, Save, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AvatarUpload from "./AvatarUpload"
import {
  completion, completionColor, completionBarColor,
  ROLE_LABELS, STATUS_CONFIG,
} from "./profileUtils"

export default function ProfileHeroCard({
  user,
  editing,
  uploading,
  profileSaving,
  onFileSelect,
  onEdit,
  onSave,
  onCancel,
}) {
  const pct       = completion(user)
  const statusCfg = STATUS_CONFIG[user?.status] ?? STATUS_CONFIG.ACTIVE
  const missingItems = [
    !user?.phone && "phone number",
    !user?.profileImage && "profile photo",
  ].filter(Boolean)

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <div
        className="h-28 bg-brand relative overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-brand/80 via-brand to-brand/60" />
      </div>

      <CardContent className="px-6 pb-6 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 mb-5">
          <AvatarUpload
            currentImage={user?.profileImage}
            userName={user?.fullName}
            uploading={uploading}
            onFileSelect={onFileSelect}
          />

          <div className="flex-1 pb-1 z-10 bg-brand p-2 rounded-md">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-slate-100">{user?.fullName || "—"}</h1>
              {user?.verified && <CheckCircle2 className="h-5 w-5 text-brand" title="Verified" />}
            </div>
            <p className="text-sm text-slate-100 mb-2.5">{user?.email}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{ROLE_LABELS[user?.role] ?? user?.role}</Badge>
              <Badge className={`${statusCfg.cls} hover:opacity-90`}>{statusCfg.label}</Badge>
              {user?.authProvider === "GOOGLE" && (
                <Badge variant="outline" className="text-slate-600">via Google</Badge>
              )}
            </div>
          </div>

          {!editing ? (
            <Button onClick={onEdit} className="shrink-0">
              <Edit2 className="h-4 w-4 mr-1.5" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" onClick={onCancel} disabled={profileSaving}>
                <X className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
              <Button onClick={onSave} disabled={profileSaving}>
                {profileSaving
                  ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Saving…</>
                  : <><Save className="h-4 w-4 mr-1.5" />Save</>}
              </Button>
            </div>
          )}
        </div>

        {/* Completion bar */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700">Profile Completion</span>
            <span className={`text-sm font-bold ${completionColor(pct)}`}>{pct}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${completionBarColor(pct)}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {missingItems.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {missingItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full"
                >
                  <AlertCircle className="h-3 w-3" />
                  Add {item}
                </span>
              ))}
            </div>
          )}
          {pct === 100 && (
            <p className="flex items-center gap-1.5 text-xs text-green-700 mt-2">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Your profile is complete — great visibility to employers!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
