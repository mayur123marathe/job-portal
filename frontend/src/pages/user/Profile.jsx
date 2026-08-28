import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { updateProfile } from "@/store/user/userThunk"
import { uploadToCloudinary } from "@/utils/uploadToCloudinary"
import ProfileHeroCard from "@/components/user/profile/ProfileHeroCard"
import PersonalInfoCard from "@/components/user/profile/PersonalInfoCard"
import AccountSecurityCard from "@/components/user/profile/AccountSecurityCard"
import ActivityCard from "@/components/user/profile/ActivityCard"
import QuickLinksCard from "@/components/user/profile/QuickLinksCard"

export default function Profile() {
  const dispatch = useDispatch()
  const { user, profileSaving, profileError } = useSelector((s) => s.auth)

  const [editing,   setEditing]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form,      setForm]      = useState({ fullName: "", phone: "" })

  useEffect(() => {
    if (user) setForm({ fullName: user.fullName ?? "", phone: user.phone ?? "" })
  }, [user, editing])

  useEffect(() => {
    if (profileError) toast.error(profileError)
  }, [profileError])

  const handleAvatarUpload = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB")
      return
    }
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      if (!editing) {
        await dispatch(updateProfile({
          fullName:     user.fullName,
          phone:        user.phone || null,
          profileImage: url,
        })).unwrap()
        toast.success("Profile photo updated!")
      } else {
        setForm((f) => ({ ...f, profileImage: url }))
        toast.success("Photo ready — click Save to apply")
      }
    } catch (err) {
      toast.error(err.message || "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSave = () => {
    dispatch(updateProfile({
      fullName:     form.fullName,
      phone:        form.phone || null,
      profileImage: form.profileImage ?? user?.profileImage ?? null,
    })).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success("Profile updated!")
        setEditing(false)
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <ProfileHeroCard
          user={user}
          editing={editing}
          uploading={uploading}
          profileSaving={profileSaving}
          onFileSelect={handleAvatarUpload}
          onEdit={() => setEditing(true)}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />

        <PersonalInfoCard
          user={user}
          editing={editing}
          form={form}
          onFormChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
        />

        <AccountSecurityCard user={user} />

        <ActivityCard user={user} />

        <QuickLinksCard />
      </div>
    </div>
  )
}
