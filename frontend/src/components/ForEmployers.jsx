import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { CheckCircle2, Briefcase } from "lucide-react"

export default function ForEmployers() {
  const benefits = [
    "Better candidate matching with AI-powered screening",
    "Reduced hiring noise and irrelevant applications",
    "Faster hiring process with qualified candidates"
  ]

  return (
    // For Employers section - Right-aligned
    <section id="employers" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2 items-center max-w-6xl mx-auto">
          {/* Left: Placeholder */}
          <div className="flex items-center justify-center order-2 md:order-1">
            <div className="w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 border border-slate-200 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-purple-600" />
                </div>
                <p className="text-slate-500 font-medium">Employer Dashboard</p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-6 order-1 md:order-2">
            <div className="inline-flex items-center gap-2 w-fit rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-700">
              For Employers
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Find the Right Talent, Faster
            </h2>

            <p className="text-lg text-slate-600">
              Connect with pre-qualified candidates who match your requirements through our intelligent matching system.
            </p>

            {/* Benefits list */}
            <div className="flex flex-col gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link to="/register">
                <Button size="lg" variant="default">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
