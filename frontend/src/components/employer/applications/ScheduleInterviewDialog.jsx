import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { scheduleInterview } from "@/store/application/applicationThunk"
import { generateInterviewQuestions } from "@/store/ai/aiThunk"
import { clearInterviewQuestions as clearQuestionsState } from "@/store/ai/aiSlice"

const INTERVIEW_TYPES = [
  "PHONE_SCREENING", "VIDEO_CALL", "IN_PERSON", "TECHNICAL", "HR", "PANEL",
]

const DURATIONS = [15, 30, 45, 60, 90, 120, 180]

function fmt(val) {
  return val.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

const EMPTY = {
  interviewType: "", scheduledAt: "", durationMinutes: "60",
  location: "", meetingLink: "", roundNumber: "1",
  interviewerIds: "", candidateInstructions: "",
}

const DIFFICULTY_COLOR = {
  Easy:   "bg-green-100 text-green-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard:   "bg-red-100 text-red-600",
}

export default function ScheduleInterviewDialog({ open, onClose, applicationId, jobTitle = "" }) {
  const dispatch = useDispatch()
  const isActionLoading = useSelector(s => s.application.isActionLoading)
  const { interviewQuestions, isGeneratingQuestions } = useSelector(s => s.ai)
  const userId = useSelector(s => s.auth.user?.id)

  const [form, setForm] = useState(EMPTY)
  const [showQuestions, setShowQuestions] = useState(false)

  const set    = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))
  const setVal = (f) => (v) => setForm(p => ({ ...p, [f]: v }))

  const needsLink     = form.interviewType === "VIDEO_CALL"
  const needsLocation = form.interviewType === "IN_PERSON"

  const handleGenerateQuestions = () => {
    if (!form.interviewType) return
    dispatch(clearQuestionsState())
    setShowQuestions(true)
    dispatch(generateInterviewQuestions({
      jobTitle:       jobTitle || "Software Developer",
      interviewType:  form.interviewType,
      experienceLevel: "",
      jobDescription: "",
    })).unwrap().catch(err => toast.error(err || "Failed to generate questions"))
  }

  const handleSubmit = () => {
    if (!form.interviewType || !form.scheduledAt) return

    const rawIds = form.interviewerIds.trim()
    const interviewerIds = rawIds
      ? rawIds.split(",").map(s => Number(s.trim())).filter(Boolean)
      : [userId]

    const payload = {
      applicationId,
      interviewType:         form.interviewType,
      scheduledAt:           form.scheduledAt,
      durationMinutes:       Number(form.durationMinutes) || 60,
      roundNumber:           Number(form.roundNumber) || 1,
      interviewerIds,
      location:              form.location.trim() || undefined,
      meetingLink:           form.meetingLink.trim() || undefined,
      candidateInstructions: form.candidateInstructions.trim() || undefined,
    }

    dispatch(scheduleInterview(payload))
      .unwrap()
      .then(() => {
        toast.success("Interview scheduled")
        dispatch(clearQuestionsState())
        setForm(EMPTY)
        setShowQuestions(false)
        onClose()
      })
      .catch(err => toast.error(err))
  }

  const canSubmit = form.interviewType && form.scheduledAt

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) { dispatch(clearQuestionsState()); setShowQuestions(false); onClose() } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900">Schedule Interview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-1 max-h-[75vh] overflow-y-auto pr-1">

          {/* Interview type + round */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                Interview Type <span className="text-red-500">*</span>
              </Label>
              <Select value={form.interviewType} onValueChange={setVal("interviewType")}>
                <SelectTrigger className="border-slate-200 text-sm">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {INTERVIEW_TYPES.map(t => (
                    <SelectItem key={t} value={t}>{fmt(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Round #</Label>
              <Input
                type="number"
                min={1}
                value={form.roundNumber}
                onChange={set("roundNumber")}
                className="border-slate-200"
              />
            </div>
          </div>

          {/* AI Questions — shown once a type is selected */}
          {form.interviewType && (
            <div className="rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand" />
                  <span className="text-sm font-semibold text-slate-800">AI Interview Questions</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={handleGenerateQuestions}
                  disabled={isGeneratingQuestions}
                >
                  {isGeneratingQuestions
                    ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Generating...</>
                    : <><Sparkles className="h-3 w-3 mr-1" />Generate</>}
                </Button>
              </div>

              {/* Questions list */}
              {interviewQuestions?.questions?.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowQuestions(v => !v)}
                    className="flex items-center gap-1 text-xs text-blue-700 font-medium hover:underline"
                  >
                    {showQuestions ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {showQuestions ? "Hide" : "Show"} {interviewQuestions.questions.length} questions
                  </button>

                  {showQuestions && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {interviewQuestions.questions.map((q, i) => (
                        <div key={i} className="bg-white/80 rounded-lg p-3 border border-blue-100 space-y-1">
                          <div className="flex items-center gap-2">
                            {q.category && (
                              <Badge variant="outline" className="text-[10px] border-blue-200 text-blue-700">
                                {q.category}
                              </Badge>
                            )}
                            {q.difficulty && (
                              <Badge className={`text-[10px] ${DIFFICULTY_COLOR[q.difficulty] ?? "bg-slate-100 text-slate-600"}`}>
                                {q.difficulty}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-800">{q.question}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Date / Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">
                Date & Time <span className="text-red-500">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={set("scheduledAt")}
                className="border-slate-200 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Duration</Label>
              <Select value={String(form.durationMinutes)} onValueChange={setVal("durationMinutes")}>
                <SelectTrigger className="border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map(d => (
                    <SelectItem key={d} value={String(d)}>
                      {d < 60 ? `${d} min` : `${d / 60} hr${d > 60 ? "s" : ""}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location / Link */}
          {needsLink && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Meeting Link</Label>
              <Input
                value={form.meetingLink}
                onChange={set("meetingLink")}
                placeholder="https://meet.google.com/..."
                className="border-slate-200"
              />
            </div>
          )}

          {needsLocation && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Location</Label>
              <Input
                value={form.location}
                onChange={set("location")}
                placeholder="123 Office St, Suite 400"
                className="border-slate-200"
              />
            </div>
          )}

          {!needsLink && !needsLocation && form.interviewType && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Location / Platform</Label>
              <Input
                value={form.location}
                onChange={set("location")}
                placeholder="Phone number or meeting details"
                className="border-slate-200"
              />
            </div>
          )}

          {/* Interviewers */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">
              Interviewer IDs
              <span className="ml-1 font-normal text-slate-400">(comma-separated, defaults to you)</span>
            </Label>
            <Input
              value={form.interviewerIds}
              onChange={set("interviewerIds")}
              placeholder={`e.g. ${userId || "1"}, 5, 12`}
              className="border-slate-200"
            />
          </div>

          {/* Candidate instructions */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-600">Instructions for Candidate</Label>
            <Textarea
              value={form.candidateInstructions}
              onChange={set("candidateInstructions")}
              placeholder="Please bring your ID, prepare a 5-minute presentation..."
              rows={3}
              className="border-slate-200 resize-none text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1 border-slate-200" onClick={onClose} disabled={isActionLoading}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-brand hover:bg-brand/90"
              onClick={handleSubmit}
              disabled={isActionLoading || !canSubmit}
            >
              {isActionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
