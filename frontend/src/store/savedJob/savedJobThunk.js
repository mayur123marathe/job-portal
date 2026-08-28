import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api"

// ── Fetch current user's saved jobs ──────────────────────────────────────────

export const fetchMySavedJobs = createAsyncThunk(
  "savedJob/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/preferences/saved-jobs")
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch saved jobs")
    }
  }
)

// ── Save a job ────────────────────────────────────────────────────────────────
// Payload: { jobId, companyId, notes? }

export const saveJob = createAsyncThunk(
  "savedJob/save",
  async ({ jobId, companyId, notes }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/preferences/saved-jobs", { jobId, companyId, notes })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to save job")
    }
  }
)

// ── Unsave a job by savedJobId ────────────────────────────────────────────────

export const unsaveJob = createAsyncThunk(
  "savedJob/unsave",
  async (savedJobId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/preferences/saved-jobs/${savedJobId}`)
      return savedJobId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove saved job")
    }
  }
)
