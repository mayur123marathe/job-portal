import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

/**
 * RoleBasedRoute - Guards routes based on user role
 * Redirects to appropriate dashboard if role doesn't match
 */
export default function RoleBasedRoute({  allowedRoles }) {
  const location = useLocation()
  const { user, isAuthenticated, authStatus } = useSelector((state) => state.auth)

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
  if (!isAuthenticated || authStatus === "unauthenticated" || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user has required role
  const userRole = user.role
  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={getRoleBasedRedirect(userRole)} replace />
  }

  return <Outlet />
}

/**
 * Get redirect path based on user role
 */
function getRoleBasedRedirect(role) {
  switch (role) {
    case "ROLE_JOB_SEEKER":
    case "ROLE_USER":
      return "/jobs"
    case "ROLE_EMPLOYER":
      return "/employer/dashboard"
    case "ROLE_ADMIN":
      return "/admin/dashboard"
    default:
      return "/login"
  }
}
