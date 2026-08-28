import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "../../validations/authSchemas"

import AuthLayout from "../../components/auth/AuthLayout"
import GoogleButton from "../../components/auth/GoogleButton"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { PasswordInput } from "../../components/ui/password-input"
import { Label } from "../../components/ui/label"
import { AlertCircle, Loader2, Mail, Lock, ArrowRight } from "lucide-react"
import { resetError } from "../../store/user/userAuth"
import { loginUser } from "../../store/user/userThunk"
import { getRoleBasedRedirect } from "../../utils/roleRedirect"

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated, user } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Redirect based on role if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRoleBasedRedirect(user.role)
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(resetError())
    }
  }, [dispatch])

  const onSubmit = async (data) => {
    dispatch(loginUser(data))
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue your job search journey"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Create account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Authentication Failed</p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Email address
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={cn(
                "pl-10 h-11 transition-all",
                errors.email
                  ? "border-red-300 focus-visible:ring-red-500"
                  : "focus-visible:ring-brand focus-visible:border-brand"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1.5 animate-in slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
              Password
            </Label>
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-brand hover:text-brand/80 transition-colors hover:underline underline-offset-2"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors pointer-events-none z-10">
              <Lock className="h-4 w-4" />
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              {...register("password")}
              className={cn(
                "pl-10 h-11 transition-all",
                errors.password
                  ? "border-red-300 focus-visible:ring-red-500"
                  : "focus-visible:ring-brand focus-visible:border-brand"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1.5 animate-in slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-brand hover:bg-brand/90 shadow-md hover:shadow-lg transition-all duration-200 group"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-500 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <GoogleButton />

        {/* Additional Info */}
        <p className="text-xs text-center text-slate-500 pt-2">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-brand hover:text-brand/80 underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-brand hover:text-brand/80 underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

// Import cn helper
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ")
}
