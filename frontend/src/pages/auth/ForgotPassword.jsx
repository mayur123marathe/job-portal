import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { forgotPasswordSchema } from "../../validations/authSchemas"


import AuthLayout from "../../components/auth/AuthLayout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { ArrowLeft, CheckCircle2, Mail, AlertCircle, Loader2, Send } from "lucide-react"
import { forgotPassword } from "../../store/user/userThunk"
import { resetError, resetForgotPasswordSuccess } from "../../store/user/userAuth"

export default function ForgotPassword() {
  const dispatch = useDispatch()
  const { isLoading, error, forgotPasswordSuccess } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const email = watch("email")

  // Clear error and success state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetError())
      dispatch(resetForgotPasswordSuccess())
    }
  }, [dispatch])

  const onSubmit = async (data) => {
    dispatch(forgotPassword(data.email))
  }

  const handleTryAnother = () => {
    dispatch(resetForgotPasswordSuccess())
    dispatch(resetError())
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="We'll send you instructions to reset it"
      footerText="Remember your password?"
      footerLink="/login"
      footerLinkText="Back to login"
    >
      {!forgotPasswordSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Helper Text */}
          <div className="flex items-start gap-3 p-4 bg-brand/5 border border-brand/20 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                <Mail className="h-5 w-5 text-brand" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-brand">Check your email</p>
              <p className="text-sm text-brand/70 mt-0.5">
                Enter your email and we'll send you a password reset link.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
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

          {/* Send Reset Link Button */}
          <Button
            type="submit"
            className="w-full h-11 bg-brand hover:bg-brand/90 shadow-md hover:shadow-lg transition-all duration-200 group"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send reset link
              </>
            )}
          </Button>

          {/* Back to Login Link */}
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to login
          </Link>
        </form>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Success Message */}
          <div className="flex flex-col items-center text-center space-y-4 py-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400/20 rounded-full blur-2xl"></div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-200 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Check your email</h3>
              <div className="space-y-1">
                <p className="text-sm text-slate-600">We've sent a password reset link to</p>
                <p className="text-sm font-semibold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-md inline-block">
                  {email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-lg">
              <Mail className="h-3.5 w-3.5" />
              <span>Didn't receive it? Check your spam folder</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 border-slate-300 hover:bg-slate-50"
              onClick={handleTryAnother}
            >
              Try another email
            </Button>
            <Link to="/login">
              <Button type="button" className="w-full h-11 bg-brand hover:bg-brand/90">
                Back to login
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <p className="text-xs text-center text-slate-500 pt-4">
            Need help?{" "}
            <Link to="/contact" className="text-brand hover:text-brand/80 underline underline-offset-2 font-medium">
              Contact support
            </Link>
          </p>
        </div>
      )}
    </AuthLayout>
  )
}

// Import cn helper
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ")
}
