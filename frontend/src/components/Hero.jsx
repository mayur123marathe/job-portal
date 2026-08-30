import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Sparkles } from "lucide-react"

export default function Hero() {
  return (
    // Hero section with left-aligned content and right placeholder
    <section className="container mx-auto px-4 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        {/* Left: Text + CTAs */}
        <div className="flex flex-col gap-6">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 w-fit rounded-full border border-brand/30 bg-brand/5 px-3 py-1 text-sm text-brand">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Job Matching</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
            Get Hired Faster with AI
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-600 max-w-xl">
            Build job-ready resumes, discover relevant jobs, and apply smarter — all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link to="/register">
              <Button size="lg" className="text-base">
                Get Started Free
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="text-base">
                Post a Job
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 text-sm text-slate-500 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>No credit card required</span>
            </div>
          </div>
        </div>

        {/* Right: AI Dashboard Mockup Illustration */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-lg group">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-xl group-hover:opacity-30 transition duration-500"></div>
            
            {/* Image Container */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-2xl shadow-slate-200/50">
              <img
                src="/hero-illustration.jpg"
                alt="AI-Powered Job Portal Dashboard Mockup"
                className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
