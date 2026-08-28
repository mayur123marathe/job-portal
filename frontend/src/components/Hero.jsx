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

        {/* Right: Placeholder for illustration/mockup */}
        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-lg">
            {/* Placeholder for feature illustration */}
            <div className="aspect-square rounded-2xl bg-linear-to-br from-brand/10 to-slate-100 border border-slate-200 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-brand" />
                </div>
                <p className="text-slate-500 font-medium">Feature Illustration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
