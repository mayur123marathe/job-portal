import { Card, CardContent } from "./ui/card"
import { UserCircle, Search, Send } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: UserCircle,
      title: "Create your profile",
      description: "Build an AI-optimized resume in minutes with our smart builder."
    },
    {
      icon: Search,
      title: "Discover relevant jobs",
      description: "Get matched with opportunities that fit your skills and experience."
    },
    {
      icon: Send,
      title: "Apply & track applications",
      description: "Apply with one click and track all your applications in one place."
    }
  ]

  return (
    // How It Works section
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden">
              {/* Step number badge */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-100 text-brand flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>

              <CardContent className="pt-8 pb-6 px-6">
                {/* Icon */}
                <div className="mb-4 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-brand" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
