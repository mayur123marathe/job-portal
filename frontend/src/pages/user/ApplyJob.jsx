import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { fetchJobById } from "@/store/job/jobThunk"
import { submitApplication } from "@/store/application/applicationThunk"
import ApplySteps from "@/components/user/apply/ApplySteps"
import SelectResume from "@/components/user/apply/SelectResume"
import CoverLetterEditor from "@/components/user/apply/CoverLetterEditor"
import AdditionalDetails from "@/components/user/apply/QuestionForm"
import ReviewSubmit from "@/components/user/apply/ReviewSubmit"
import SuccessScreen from "@/components/user/apply/SuccessScreen"
import JobInfoCard from "@/components/user/apply/JobInfoCard"
import ApplyJobSkeleton from "@/components/user/apply/ApplyJobSkeleton"

export default function ApplyJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { currentJob: job, isLoading: jobLoading } = useSelector(s => s.job)
  const { isActionLoading } = useSelector(s => s.application)
  const { resumes } = useSelector(s => s.resume)



  const [currentStep, setCurrentStep] = useState(1)
  const [selectedResume, setSelectedResume] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [expectedSalary, setExpectedSalary] = useState("")
  const [availableFrom, setAvailableFrom] = useState(null)

  console.log("resumes ", resumes)
  useEffect(() => {
    dispatch(fetchJobById(id))
  }, [dispatch, id])

  const handleNext = () => {
    if (currentStep === 1 && !selectedResume) {
      toast.error("Please select or upload a resume")
      return
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = async () => {
    try {
      await dispatch(submitApplication({
        jobId: Number(id),
        resumeId: Number(selectedResume) || null,
        coverLetter: coverLetter.trim() || null,
        expectedSalary: expectedSalary ? parseFloat(expectedSalary) : null,
        expectedSalaryCurrency: expectedSalary ? "INR" : null,
        availableFrom: availableFrom ? availableFrom.toISOString().split("T")[0] : null,
        source: "DIRECT",
      })).unwrap()

      setCurrentStep(5)
      toast.success("Application submitted successfully!")
    } catch (err) {
      toast.error(err || "Failed to submit application")
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <SelectResume selectedResume={selectedResume} setSelectedResume={setSelectedResume} />
      case 2: return <CoverLetterEditor coverLetter={coverLetter} setCoverLetter={setCoverLetter} selectedResumeId={selectedResume} />
      case 3: return <AdditionalDetails expectedSalary={expectedSalary} setExpectedSalary={setExpectedSalary} availableFrom={availableFrom} setAvailableFrom={setAvailableFrom} />
      case 4: return <ReviewSubmit resume={selectedResume} resumes={resumes} coverLetter={coverLetter} expectedSalary={expectedSalary} availableFrom={availableFrom} job={job} />
      case 5: return <SuccessScreen job={job} />
      default: return null
    }
  }

  if (currentStep === 5) {
    return <div className="min-h-screen bg-slate-50 py-12">{renderStep()}</div>
  }

  if (jobLoading || !job) {
    return <ApplyJobSkeleton />
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" onClick={() => navigate(`/jobs/${id}`)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Job
      </Button>

      <JobInfoCard job={job} />

      <ApplySteps currentStep={currentStep} />

      <div className="my-8">{renderStep()}</div>

      <div className="flex items-center justify-between mt-8">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button onClick={handleNext}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isActionLoading}>
            {isActionLoading
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
              : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  )
}
