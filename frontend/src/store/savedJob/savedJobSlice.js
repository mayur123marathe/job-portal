import { createSlice } from "@reduxjs/toolkit"
import { fetchMySavedJobs, saveJob, unsaveJob } from "./savedJobThunk"

// savedJobMap: { [jobId]: savedJobId } — lets JobCard/JobDetails do O(1) lookups

const savedJobSlice = createSlice({
  name: "savedJob",
  initialState: {
    savedJobs: [],          // SavedJobResponse[]
    savedJobMap: {},        // jobId -> savedJobId (for quick isSaved checks)
    isLoading: false,
    isActionLoading: false,
    error: null,
    actionError: null,
  },
  reducers: {
    clearErrors(state) { state.error = null; state.actionError = null },
  },
  extraReducers: builder => {

    // ── fetchMySavedJobs ──────────────────────────────────────────────────────
    builder
      .addCase(fetchMySavedJobs.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchMySavedJobs.fulfilled, (s, { payload }) => {
        s.isLoading = false
        s.savedJobs = payload
        s.savedJobMap = {}
        for (const sj of payload) {
          s.savedJobMap[sj.jobId] = sj.id
        }
      })
      .addCase(fetchMySavedJobs.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── saveJob ───────────────────────────────────────────────────────────────
    builder
      .addCase(saveJob.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(saveJob.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        s.savedJobs.unshift(payload)
        s.savedJobMap[payload.jobId] = payload.id
      })
      .addCase(saveJob.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── unsaveJob ─────────────────────────────────────────────────────────────
    builder
      .addCase(unsaveJob.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(unsaveJob.fulfilled, (s, { payload: deletedId }) => {
        s.isActionLoading = false
        const removed = s.savedJobs.find(sj => sj.id === deletedId)
        if (removed) delete s.savedJobMap[removed.jobId]
        s.savedJobs = s.savedJobs.filter(sj => sj.id !== deletedId)
      })
      .addCase(unsaveJob.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })
  },
})

export const { clearErrors } = savedJobSlice.actions
export default savedJobSlice.reducer
