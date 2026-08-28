/**
 * Get the default redirect path based on user role
 * @param {string} role - User role (ROLE_JOB_SEEKER, ROLE_EMPLOYER, ROLE_ADMIN)
 * @returns {string} - Redirect path
 */
export function getRoleBasedRedirect(role) {
  switch (role) {
    case "ROLE_JOB_SEEKER":
      return "/jobs"
    case "ROLE_EMPLOYER":
      return "/employer/dashboard"
    case "ROLE_ADMIN":
      return "/admin/dashboard"
    default:
      return "/login"
  }
}
