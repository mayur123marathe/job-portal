import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCurrentUser } from "@/store/user/userThunk"

/**
 * AppBootstrap - Initializes authentication on app load
 * Checks for accessToken and fetches current user if exists
 */
export default function AppBootstrap({ children }) {
  const dispatch = useDispatch()
  const { authStatus } = useSelector((state) => state.auth)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken")

      if (token) {
        // Token exists, fetch current user
        await dispatch(fetchCurrentUser())
      }

      // Mark initialization as complete
      setIsInitialized(true)
    }

    // Only initialize once
    if (!isInitialized) {
      initializeAuth()
    }
  }, [dispatch, isInitialized])

  // Show loading screen only while initializing
  if (!isInitialized || authStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand mx-auto mb-4"></div>
          <p className="text-lg font-medium text-slate-900 mb-2">Loading Job Portal</p>
          <p className="text-sm text-slate-600">Please wait...</p>
        </div>
      </div>
    )
  }

  return children
}
