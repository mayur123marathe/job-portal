import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validations/authSchemas";

import AuthLayout from "../../components/auth/AuthLayout";
import GoogleButton from "../../components/auth/GoogleButton";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { PasswordInput } from "../../components/ui/password-input";
import { Label } from "../../components/ui/label";
import {
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  User,
  Briefcase,
  Users,
  ArrowRight,
} from "lucide-react";
import { registerUser } from "../../store/user/userThunk";
import { resetError } from "../../store/user/userAuth";
import { getRoleBasedRedirect } from "../../utils/roleRedirect";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "ROLE_JOB_SEEKER",
    },
  });

  const selectedRole = watch("role");

  // Redirect based on role if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = getRoleBasedRedirect(user.role);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(resetError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    console.log(data);
    dispatch(registerUser(data));
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Start your AI-powered job search journey"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign in"
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
              <p className="text-sm font-medium text-red-900">
                Registration Failed
              </p>
              <p className="text-sm text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Full Name Field */}
        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="text-sm font-semibold text-slate-700"
          >
            Full name
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors">
              <User className="h-4 w-4" />
            </div>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              {...register("fullName")}
              className={cn(
                "pl-10 h-11 transition-all",
                errors.fullName
                  ? "border-red-300 focus-visible:ring-red-500"
                  : "focus-visible:ring-brand focus-visible:border-brand"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1.5 animate-in slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-semibold text-slate-700"
          >
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
          <Label
            htmlFor="password"
            className="text-sm font-semibold text-slate-700"
          >
            Password
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors pointer-events-none z-10">
              <Lock className="h-4 w-4" />
            </div>
            <PasswordInput
              id="password"
              placeholder="Create a strong password"
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

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-slate-700"
          >
            Confirm password
          </Label>
          <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand transition-colors pointer-events-none z-10">
              <Lock className="h-4 w-4" />
            </div>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={cn(
                "pl-10 h-11 transition-all",
                errors.confirmPassword
                  ? "border-red-300 focus-visible:ring-red-500"
                  : "focus-visible:ring-brand focus-visible:border-brand"
              )}
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1.5 animate-in slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Role Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">I am a</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("role", "ROLE_JOB_SEEKER")}
              className={cn(
                "relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200",
                selectedRole === "ROLE_JOB_SEEKER"
                  ? "border-brand bg-brand/5 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              )}
              disabled={isLoading}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                  selectedRole === "ROLE_JOB_SEEKER"
                    ? "bg-brand/10"
                    : "bg-slate-100"
                )}
              >
                <Users
                  className={cn(
                    "h-6 w-6",
                    selectedRole === "ROLE_JOB_SEEKER"
                      ? "text-brand"
                      : "text-slate-600"
                  )}
                />
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    selectedRole === "ROLE_JOB_SEEKER"
                      ? "text-brand"
                      : "text-slate-700"
                  )}
                >
                  Job Seeker
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Find your dream job
                </p>
              </div>
              {selectedRole === "ROLE_JOB_SEEKER" && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setValue("role", "ROLE_EMPLOYER")}
              className={cn(
                "relative flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200",
                selectedRole === "ROLE_EMPLOYER"
                  ? "border-brand bg-brand/5 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
              )}
              disabled={isLoading}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                  selectedRole === "ROLE_EMPLOYER" ? "bg-brand/10" : "bg-slate-100"
                )}
              >
                <Briefcase
                  className={cn(
                    "h-6 w-6",
                    selectedRole === "ROLE_EMPLOYER"
                      ? "text-brand"
                      : "text-slate-600"
                  )}
                />
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    selectedRole === "ROLE_EMPLOYER"
                      ? "text-brand"
                      : "text-slate-700"
                  )}
                >
                  Employer
                </p>
                <p className="text-xs text-slate-500 mt-0.5">Hire top talent</p>
              </div>
              {selectedRole === "ROLE_EMPLOYER" && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>
          {errors.role && (
            <p className="text-xs text-red-600 flex items-center gap-1.5 mt-1.5 animate-in slide-in-from-top-1">
              <AlertCircle className="h-3 w-3" />
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Create Account Button */}
        <Button
          type="submit"
          className="w-full h-11 bg-brand hover:bg-brand/90 shadow-md hover:shadow-lg transition-all duration-200 group"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
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
            <span className="bg-white px-3 text-slate-500 font-medium">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign Up */}
        <GoogleButton>Sign up with Google</GoogleButton>

        {/* Additional Info */}
        <p className="text-xs text-center text-slate-500 pt-2">
          By creating an account, you agree to our{" "}
          <Link
            to="/terms"
            className="text-brand hover:text-brand/80 underline underline-offset-2"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="text-brand hover:text-brand/80 underline underline-offset-2"
          >
            Privacy Policy
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

// Import cn helper
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
