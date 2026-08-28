import { createSlice } from "@reduxjs/toolkit"
import {
  fetchJobs, fetchAllJobsAdmin,
  fetchMyJobs, fetchJobById,
  createJob, updateJob,
  publishJob, closeJob, deleteJob,
} from "./jobThunk"

function replaceInList(list, updated) {
  const idx = list.findIndex(j => j.id === updated.id)
  if (idx !== -1) list[idx] = updated
}

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    jobsLoading: false,
    jobsError: null,
    adminJobs: [],
    adminJobsLoading: false,
    myJobs: [],
    currentJob: null,
    isLoading: false,
    isActionLoading: false,
    error: null,
    actionError: null,
  },
  reducers: {
    clearCurrentJob(state) { state.currentJob = null },
    clearErrors(state) { state.error = null; state.actionError = null },
  },
  extraReducers: builder => {

    // ── fetchJobs (public list) ────────────────────────────────────────────────
    builder
      .addCase(fetchJobs.pending,   s => { s.jobsLoading = true; s.jobsError = null })
      .addCase(fetchJobs.fulfilled, (s, { payload }) => { s.jobsLoading = false; s.jobs = payload })
      .addCase(fetchJobs.rejected,  (s, { payload }) => { s.jobsLoading = false; s.jobsError = payload })

    // ── fetchAllJobsAdmin ─────────────────────────────────────────────────────
    builder
      .addCase(fetchAllJobsAdmin.pending,   s => { s.adminJobsLoading = true; s.jobsError = null })
      .addCase(fetchAllJobsAdmin.fulfilled, (s, { payload }) => { s.adminJobsLoading = false; s.adminJobs = payload })
      .addCase(fetchAllJobsAdmin.rejected,  (s, { payload }) => { s.adminJobsLoading = false; s.jobsError = payload })

    // ── fetchMyJobs ───────────────────────────────────────────────────────────
    builder
      .addCase(fetchMyJobs.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchMyJobs.fulfilled, (s, { payload }) => { s.isLoading = false; s.myJobs = payload })
      .addCase(fetchMyJobs.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── fetchJobById ──────────────────────────────────────────────────────────
    builder
      .addCase(fetchJobById.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchJobById.fulfilled, (s, { payload }) => { s.isLoading = false; s.currentJob = payload })
      .addCase(fetchJobById.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── createJob ─────────────────────────────────────────────────────────────
    builder
      .addCase(createJob.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(createJob.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        s.myJobs.unshift(payload)
        s.currentJob = payload
      })
      .addCase(createJob.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── updateJob ─────────────────────────────────────────────────────────────
    builder
      .addCase(updateJob.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(updateJob.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        s.currentJob = payload
        replaceInList(s.myJobs, payload)
      })
      .addCase(updateJob.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── publishJob ────────────────────────────────────────────────────────────
    builder
      .addCase(publishJob.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(publishJob.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        replaceInList(s.myJobs, payload)
        if (s.currentJob?.id === payload.id) s.currentJob = payload
      })
      .addCase(publishJob.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── closeJob ──────────────────────────────────────────────────────────────
    builder
      .addCase(closeJob.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(closeJob.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        replaceInList(s.myJobs, payload)
        if (s.currentJob?.id === payload.id) s.currentJob = payload
      })
      .addCase(closeJob.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── deleteJob ─────────────────────────────────────────────────────────────
    builder
      .addCase(deleteJob.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(deleteJob.fulfilled, (s, { payload: deletedId }) => {
        s.isActionLoading = false
        s.myJobs = s.myJobs.filter(j => j.id !== deletedId)
        if (s.currentJob?.id === deletedId) s.currentJob = null
      })
      .addCase(deleteJob.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })
  },
})

export const { clearCurrentJob, clearErrors } = jobSlice.actions
export default jobSlice.reducer
