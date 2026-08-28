import { CheckCircle2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const NEXT_STEPS = [
  "Your application is being reviewed by the employer",
  "You'll receive an email confirmation shortly",
  "Track your application status in your dashboard",
]

export default function SuccessScreen({ job }) {
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Card>
        <CardContent className="p-12 text-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Application Submitted!</h1>
          <p className="text-lg text-slate-600 mb-8">
            Your application for{" "}
            <span className="font-semibold">{job?.title}</span> has been successfully submitted.
          </p>
          <div className="space-y-4 text-left max-w-md mx-auto mb-8">
            {NEXT_STEPS.map((msg, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{msg}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate("/applications")}>View My Applications</Button>
            <Button variant="outline" onClick={() => navigate("/jobs")}>Browse More Jobs</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
