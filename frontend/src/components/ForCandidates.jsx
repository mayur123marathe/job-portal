import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { CheckCircle2 } from "lucide-react"

export default function ForCandidates() {
  const benefits = [
    "ATS-friendly resumes that pass automated screening",
    "Faster shortlisting with AI-optimized applications",
    "Career insights and personalized recommendations"
  ]

  return (
    // For Job Seekers section - Left-aligned
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 items-center max-w-6xl mx-auto">
          {/* Left: Content */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 w-fit rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm text-green-700">
              For Job Seekers
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Land Your Dream Job Faster
            </h2>

            <p className="text-lg text-slate-600">
              Our AI-powered platform helps you create standout applications and discover opportunities that match your skills.
            </p>

            {/* Benefits list */}
            <div className="flex flex-col gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link to="/register">
                <Button size="lg">
                  Start Building Resume
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Placeholder */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-green-100 to-blue-100 border border-slate-200 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-slate-500 font-medium">Resume Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
