import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

/**
 * ProtectedRoute - Guards routes that require authentication
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, authStatus } = useSelector((state) => state.auth)

  // Show loading state while checking authentication
  if (authStatus === "loading" || authStatus === "idle") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || authStatus === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
