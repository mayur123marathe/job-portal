import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileText, Plus, Star } from "lucide-react"
import { toast } from "sonner"
import { fetchMyResumes, fetchResumeById, createResume, setDefaultResume, deleteResume } from "@/store/resume/resumeThunk"
import ResumeCard from "@/components/user/resumes/ResumeCard"
import CreateResumeDialog from "@/components/user/resumes/CreateResumeDialog"
import CareerFeedbackDialog from "@/components/user/resumes/CareerFeedbackDialog"
import { TEMPLATES } from "@/components/user/resumes/ResumeTemplates"

export default function Resumes() {
  const dispatch = useDispatch()
  const { resumes, isLoading, isActionLoading, error } = useSelector((s) => s.resume)

  const [showCreate, setShowCreate]           = useState(false)
  const [deleteTarget, setDeleteTarget]       = useState(null)
  const [feedbackResume, setFeedbackResume]   = useState(null)
  const [showFeedback, setShowFeedback]       = useState(false)

  useEffect(() => { dispatch(fetchMyResumes()) }, [dispatch])
  useEffect(() => { if (error) toast.error(error) }, [error])

  const handleCreate = (payload) => {
    dispatch(createResume(payload)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success("Resume created!")
        setShowCreate(false)
      }
    })
  }

  const handleSetDefault = (resumeId) => {
    dispatch(setDefaultResume(resumeId)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") toast.success("Default resume updated")
    })
  }

  const handleFeedback = (resumeSummary) => {
    // Fetch full resume data (with sections) so the AI has complete content
    dispatch(fetchResumeById(resumeSummary.id)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        setFeedbackResume(action.payload.data ?? action.payload)
        setShowFeedback(true)
      }
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    dispatch(deleteResume(deleteTarget.id)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success(`"${deleteTarget.title}" deleted`)
        setDeleteTarget(null)
      }
    })
  }

  const defaultResume = resumes.find((r) => r.isDefault)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-brand" />
              My Resumes
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Create and manage multiple resume versions using our built-in templates
            </p>
          </div>
          <Button onClick={() => setShowCreate(true)} className="bg-brand hover:bg-brand/90 shrink-0">
            <Plus className="h-4 w-4 mr-1.5" />
            New Resume
          </Button>
        </div>

        {/* Default resume callout */}
        {defaultResume && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Star className="h-5 w-5 text-yellow-500 fill-current shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Default Resume</p>
              <p className="text-xs text-yellow-700">
                <span className="font-medium">"{defaultResume.title}"</span> will be used when you apply without choosing a version.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-slate-200">
                <Skeleton className="h-36 w-full rounded-none" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-2 w-full" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-7 flex-1" />
                    <Skeleton className="h-7 w-9" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && resumes.length === 0 && (
          <div className="text-center py-20">
            <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-brand" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No resumes yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              Create your first resume using one of our 5 professionally designed templates.
            </p>
            <Button onClick={() => setShowCreate(true)} className="bg-brand hover:bg-brand/90">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Your First Resume
            </Button>
          </div>
        )}

        {/* Resume Grid */}
        {!isLoading && resumes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onSetDefault={handleSetDefault}
                onDelete={setDeleteTarget}
                onFeedback={handleFeedback}
                isActionLoading={isActionLoading}
              />
            ))}

            {/* Add new card */}
            <button
              onClick={() => setShowCreate(true)}
              className="border-2 border-dashed border-slate-300 rounded-xl h-[260px] flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="h-10 w-10 rounded-xl border-2 border-current flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">New Resume</p>
                <p className="text-xs">Pick a template to get started</p>
              </div>
            </button>
          </div>
        )}

        {/* Template info section */}
        {!isLoading && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">About Our Templates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {TEMPLATES.map((tmpl) => {
                const Prev = tmpl.preview
                return (
                  <div key={tmpl.value} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                    <div className="h-24 bg-slate-50 overflow-hidden">
                      <Prev />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-slate-800">{tmpl.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tmpl.tagline}</p>
                      <p className="text-[11px] text-slate-400 mt-1">Best for: {tmpl.bestFor}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Career Feedback Dialog */}
      <CareerFeedbackDialog
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        resume={feedbackResume}
      />

      {/* Dialogs */}
      <CreateResumeDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        isLoading={isActionLoading}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">"{deleteTarget?.title}"</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isActionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isActionLoading ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
