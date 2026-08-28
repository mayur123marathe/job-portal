import { CheckCircle2, Circle } from "lucide-react"

const steps = [
  { id: 1, name: "Resume", description: "Upload or select resume" },
  { id: 2, name: "Cover Letter", description: "Write your cover letter" },
  { id: 3, name: "Details", description: "Salary & availability" },
  { id: 4, name: "Review", description: "Review and submit" },
]

export default function ApplySteps({ currentStep }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center relative">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep > step.id
                    ? "bg-green-600 border-green-600"
                    : currentStep === step.id
                    ? "bg-brand border-brand"
                    : "bg-white border-slate-300"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : currentStep === step.id ? (
                  <span className="text-white font-semibold">{step.id}</span>
                ) : (
                  <span className="text-slate-400 font-semibold">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-slate-500 hidden sm:block mt-1">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  currentStep > step.id ? "bg-green-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
