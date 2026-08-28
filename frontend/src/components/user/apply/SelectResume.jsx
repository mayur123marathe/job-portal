import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Eye } from "lucide-react"
import { fetchMyResumes } from "@/store/resume/resumeThunk"

const TEMPLATE_COLORS = {
  PROFESSIONAL: "bg-slate-800 text-white",
  CLASSIC:      "bg-amber-800 text-white",
  MODERN:       "bg-blue-600 text-white",
  MINIMAL:      "bg-gray-500 text-white",
  CREATIVE:     "bg-violet-600 text-white",
}

export default function SelectResume({ selectedResume, setSelectedResume }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { resumes, isLoading } = useSelector((s) => s.resume)

  useEffect(() => {
    dispatch(fetchMyResumes())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Resume</h2>
        <p className="text-slate-600">Choose a resume from your saved resumes</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <FileText className="h-10 w-10 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No resumes found</p>
          <p className="text-sm mt-1">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => navigate("/resumes")}
            >
              Create a resume
            </button>{" "}
            before applying.
          </p>
        </div>
      ) : (
        <RadioGroup
          value={selectedResume}
          onValueChange={setSelectedResume}
        >
          <div className="space-y-3">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                className={`cursor-pointer transition-colors ${
                  selectedResume === resume.id.toString()
                    ? "border-brand bg-blue-50"
                    : "hover:border-slate-400"
                }`}
                onClick={() => setSelectedResume(resume.id.toString())}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={resume.id.toString()} id={`resume-${resume.id}`} />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <FileText className="h-6 w-6 text-brand" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`resume-${resume.id}`}
                          className="font-medium text-slate-900 cursor-pointer block truncate"
                        >
                          {resume.title}
                        </Label>
                        <span
                          className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                            TEMPLATE_COLORS[resume.template] ?? "bg-slate-600 text-white"
                          }`}
                        >
                          {resume.template}
                        </span>
                        {resume.isDefault && (
                          <span className="ml-2 text-xs text-green-600 font-medium">Default</span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/resumes/${resume.id}/view`)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RadioGroup>
      )}
    </div>
  )
}
