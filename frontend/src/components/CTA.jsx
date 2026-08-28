import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    // Final Call to Action - Centered layout
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Your Career, Powered by AI
          </h2>

          {/* Subtext */}
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and employers who are already using our platform to achieve their goals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-base">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="text-base">
                Explore Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
