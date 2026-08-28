import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useDispatch } from "react-redux"
import UserNavbar from "./UserNavbar"
import Footer from "./Footer"
import { fetchMySavedJobs } from "@/store/savedJob/savedJobThunk"

export default function UserLayout() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchMySavedJobs())
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <UserNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
