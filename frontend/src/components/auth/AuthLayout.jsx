import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Sparkles } from "lucide-react"

const AUTH_IMAGE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop"

export default function AuthLayout({ title, description, children, footerText, footerLink, footerLinkText }) {
  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — image (hidden on mobile) ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden shrink-0">
        <img
          src={AUTH_IMAGE}
          alt="MayurJobs.AI"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/70 via-slate-900/10 to-transparent" />

        {/* Branding overlay — bottom left */}
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-1.5">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white/90 tracking-wide uppercase">
              MayurJobs.AI
            </span>
          </div>
          <h2 className="text-3xl font-bold leading-snug">
            Your next career move <br /> starts here.
          </h2>
          <p className="text-white/70 mt-3 text-sm leading-relaxed max-w-sm">
            AI-powered job matching, smart resume builder, and real-time insights — all in one place.
          </p>

          {/* Trust indicators */}
          <div className="flex items-center gap-5 mt-6">
            {[
              { dot: "bg-emerald-400", text: "100K+ Jobs" },
              { dot: "bg-blue-400", text: "50K+ Companies" },
              { dot: "bg-violet-400", text: "AI-Powered" },
            ].map(({ dot, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                <span className="text-xs text-white/80 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden bg-linear-to-br from-slate-50 via-brand/5 to-slate-50">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-screen p-6 sm:p-10">
          <div className="w-full max-w-md">

            {/* Logo */}
            <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand/20 rounded-lg blur-xl group-hover:bg-brand/30 transition-all" />
                  <div className="relative bg-brand p-2 rounded-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-slate-900">
                  JobPortal<span className="text-brand">.AI</span>
                </h1>
              </Link>
              <p className="text-sm text-slate-600 mt-2">AI-Powered Career Platform</p>
            </div>

            {/* Auth Card */}
            <Card className="border-slate-200/60 shadow-xl backdrop-blur-sm bg-white/80 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="space-y-2 pb-4">
                <CardTitle className="text-2xl font-bold text-center bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {title}
                </CardTitle>
                {description && (
                  <CardDescription className="text-center text-base">
                    {description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-2">{children}</CardContent>
            </Card>

            {/* Footer link */}
            {footerText && (
              <p className="text-center text-sm text-slate-600 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {footerText}{" "}
                <Link
                  to={footerLink}
                  className="font-semibold text-brand hover:text-brand/80 transition-colors underline-offset-4 hover:underline"
                >
                  {footerLinkText}
                </Link>
              </p>
            )}

            {/* Trust indicators (shown on mobile where image is hidden) */}
            <div className="flex lg:hidden items-center justify-center gap-6 mt-8 text-xs text-slate-500 animate-in fade-in duration-1000">
              {[
                { dot: "bg-green-500", text: "Secure" },
                { dot: "bg-blue-500", text: "Fast" },
                { dot: "bg-purple-500", text: "Private" },
              ].map(({ dot, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                  <span>{text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
