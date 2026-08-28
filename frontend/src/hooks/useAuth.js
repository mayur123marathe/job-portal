import { useSelector } from "react-redux"

// Custom hook to access auth state
export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  )

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
  }
}
