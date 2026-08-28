import { createSlice } from "@reduxjs/toolkit"
import {
  fetchCompanyApplications, fetchJobApplications, fetchApplicationById,
  fetchMyApplications, submitApplication, withdrawApplication,
  updateApplicationStatus, markAsRead, toggleStar,
  addNote, deleteNote,
  scheduleInterview, updateInterview, cancelInterview,
} from "./applicationThunk"

// ── Helpers ───────────────────────────────────────────────────────────────────

function replaceInList(list, updated) {
  const idx = list.findIndex(a => a.id === updated.id)
  if (idx !== -1) list[idx] = { ...list[idx], ...updated }
}

function replaceInterview(state, updated) {
  if (!state.currentApplication) return
  state.currentApplication.interviews = (state.currentApplication.interviews || []).map(
    iv => iv.id === updated.id ? updated : iv
  )
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applications: [],           // ApplicationSummaryResponse[] (employer view)
    myApplications: [],         // ApplicationSummaryResponse[] (candidate view)
    currentApplication: null,   // ApplicationResponse (full)
    isLoading: false,
    isActionLoading: false,
    error: null,
    actionError: null,
  },
  reducers: {
    clearCurrentApplication(state) { state.currentApplication = null },
    clearErrors(state) { state.error = null; state.actionError = null },
  },
  extraReducers: builder => {

    // ── fetchCompanyApplications ───────────────────────────────────────────────
    builder
      .addCase(fetchCompanyApplications.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchCompanyApplications.fulfilled, (s, { payload }) => { s.isLoading = false; s.applications = payload })
      .addCase(fetchCompanyApplications.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── fetchJobApplications ──────────────────────────────────────────────────
    builder
      .addCase(fetchJobApplications.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchJobApplications.fulfilled, (s, { payload }) => { s.isLoading = false; s.applications = payload })
      .addCase(fetchJobApplications.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── fetchApplicationById ──────────────────────────────────────────────────
    builder
      .addCase(fetchApplicationById.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchApplicationById.fulfilled, (s, { payload }) => { s.isLoading = false; s.currentApplication = payload })
      .addCase(fetchApplicationById.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── updateApplicationStatus ───────────────────────────────────────────────
    builder
      .addCase(updateApplicationStatus.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(updateApplicationStatus.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        s.currentApplication = payload
        replaceInList(s.applications, payload)
      })
      .addCase(updateApplicationStatus.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── markAsRead ────────────────────────────────────────────────────────────
    builder
      .addCase(markAsRead.pending,   s => { s.isActionLoading = true })
      .addCase(markAsRead.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        replaceInList(s.applications, payload)
        if (s.currentApplication?.id === payload.id) s.currentApplication = payload
      })
      .addCase(markAsRead.rejected,  s => { s.isActionLoading = false })

    // ── toggleStar ────────────────────────────────────────────────────────────
    builder
      .addCase(toggleStar.pending,   s => { s.isActionLoading = true })
      .addCase(toggleStar.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        replaceInList(s.applications, payload)
        if (s.currentApplication?.id === payload.id) s.currentApplication = payload
      })
      .addCase(toggleStar.rejected,  s => { s.isActionLoading = false })

    // ── addNote ───────────────────────────────────────────────────────────────
    builder
      .addCase(addNote.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(addNote.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        if (s.currentApplication) {
          s.currentApplication.notes = [payload, ...(s.currentApplication.notes || [])]
        }
      })
      .addCase(addNote.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── deleteNote ────────────────────────────────────────────────────────────
    builder
      .addCase(deleteNote.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(deleteNote.fulfilled, (s, { payload: noteId }) => {
        s.isActionLoading = false
        if (s.currentApplication) {
          s.currentApplication.notes = (s.currentApplication.notes || []).filter(n => n.id !== noteId)
        }
      })
      .addCase(deleteNote.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── scheduleInterview ─────────────────────────────────────────────────────
    builder
      .addCase(scheduleInterview.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(scheduleInterview.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        if (s.currentApplication) {
          s.currentApplication.interviews = [...(s.currentApplication.interviews || []), payload]
        }
      })
      .addCase(scheduleInterview.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── updateInterview ───────────────────────────────────────────────────────
    builder
      .addCase(updateInterview.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(updateInterview.fulfilled, (s, { payload }) => { s.isActionLoading = false; replaceInterview(s, payload) })
      .addCase(updateInterview.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── cancelInterview ───────────────────────────────────────────────────────
    builder
      .addCase(cancelInterview.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(cancelInterview.fulfilled, (s, { payload: ivId }) => {
        s.isActionLoading = false
        if (s.currentApplication) {
          s.currentApplication.interviews = (s.currentApplication.interviews || []).map(
            iv => iv.id === ivId ? { ...iv, status: "CANCELLED" } : iv
          )
        }
      })
      .addCase(cancelInterview.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── fetchMyApplications (candidate) ──────────────────────────────────────
    builder
      .addCase(fetchMyApplications.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchMyApplications.fulfilled, (s, { payload }) => { s.isLoading = false; s.myApplications = payload })
      .addCase(fetchMyApplications.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── submitApplication ─────────────────────────────────────────────────────
    builder
      .addCase(submitApplication.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(submitApplication.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        s.myApplications.unshift(payload)
      })
      .addCase(submitApplication.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── withdrawApplication ───────────────────────────────────────────────────
    builder
      .addCase(withdrawApplication.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(withdrawApplication.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        replaceInList(s.myApplications, payload)
        if (s.currentApplication?.id === payload.id) s.currentApplication = payload
      })
      .addCase(withdrawApplication.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })
  },
})

export const { clearCurrentApplication, clearErrors } = applicationSlice.actions
export default applicationSlice.reducer
