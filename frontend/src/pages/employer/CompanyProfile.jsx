import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchMyCompany } from "@/store/company/companyThunk"
import ProfileHeader from "@/components/employer/company/ProfileHeader"
import ProfileSkeleton from "@/components/employer/company/ProfileSkeleton"
import CreateCompanyForm from "@/components/employer/company/CreateCompanyForm"
import CompanyProfileTabs from "@/components/employer/company/CompanyProfileTabs"

function PageHeading() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Company Profile</h1>
      <p className="text-sm text-slate-500 mt-1">Manage your company information and branding</p>
    </div>
  )
}

export default function CompanyProfile() {
  const dispatch = useDispatch()
  const { myCompany, isMyCompanyLoading, isActionLoading } = useSelector(s => s.company)

  useEffect(() => {
    dispatch(fetchMyCompany())
  }, [dispatch])

  if (isMyCompanyLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-52 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <ProfileSkeleton />
      </div>
    )
  }

  if (!myCompany) {
    return (
      <div className="space-y-4">
        <PageHeading />
        <CreateCompanyForm isActionLoading={isActionLoading} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeading />
      <ProfileHeader company={myCompany} />
      <CompanyProfileTabs company={myCompany} isActionLoading={isActionLoading} />
    </div>
  )
}
