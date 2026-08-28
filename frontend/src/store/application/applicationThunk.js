import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api"

// ── Employer: fetch all company applications (with optional filters) ──────────
// filters: { jobId?, status?, source?, isRead?, isStarred?, appliedFrom?, appliedTo?,
//            aiShortlistStatus?, minAiScore?, sortBy? }

export const fetchCompanyApplications = createAsyncThunk(
  "application/fetchForCompany",
  async ({ filters = {} }, { rejectWithValue }) => {
    try {
      const params = {}
      if (filters.jobId)              params.jobId              = filters.jobId
      if (filters.status)             params.status             = filters.status
      if (filters.source)             params.source             = filters.source
      if (filters.isRead    != null)  params.isRead             = filters.isRead
      if (filters.isStarred != null)  params.isStarred          = filters.isStarred
      if (filters.appliedFrom)        params.appliedFrom        = filters.appliedFrom
      if (filters.appliedTo)          params.appliedTo          = filters.appliedTo
      if (filters.aiShortlistStatus)  params.aiShortlistStatus  = filters.aiShortlistStatus
      if (filters.minAiScore != null) params.minAiScore         = filters.minAiScore
      if (filters.sortBy)             params.sortBy             = filters.sortBy
      const { data } = await api.get(`/api/applications/company`, { params })
      console.log("aplications -- ",data)
      return data
    } catch (err) {
      console.log("err ",err)
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applications")
    }
  }
)

// ── Fetch applications for a specific job ─────────────────────────────────────

export const fetchJobApplications = createAsyncThunk(
  "application/fetchForJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/applications/job/${jobId}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applications")
    }
  }
)

// ── Fetch full application detail ─────────────────────────────────────────────

export const fetchApplicationById = createAsyncThunk(
  "application/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/applications/${id}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch application")
    }
  }
)

// ── Update application status ─────────────────────────────────────────────────

export const updateApplicationStatus = createAsyncThunk(
  "application/updateStatus",
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/applications/${id}/status`, { status, note })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status")
    }
  }
)

// ── Mark application as read ──────────────────────────────────────────────────

export const markAsRead = createAsyncThunk(
  "application/markRead",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/applications/${id}/read`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark as read")
    }
  }
)

// ── Toggle star ───────────────────────────────────────────────────────────────

export const toggleStar = createAsyncThunk(
  "application/toggleStar",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/applications/${id}/star`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle star")
    }
  }
)

// ── Notes ─────────────────────────────────────────────────────────────────────

export const addNote = createAsyncThunk(
  "application/addNote",
  async ({ applicationId, content }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/applications/${applicationId}/notes`, { content })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add note")
    }
  }
)

export const deleteNote = createAsyncThunk(
  "application/deleteNote",
  async ({ applicationId, noteId }, { rejectWithValue }) => {
    try {
      await api.delete(`/api/applications/${applicationId}/notes/${noteId}`)
      return noteId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete note")
    }
  }
)

// ── Interviews ────────────────────────────────────────────────────────────────

export const scheduleInterview = createAsyncThunk(
  "application/scheduleInterview",
  async ({ applicationId, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/applications/${applicationId}/interviews`, payload)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to schedule interview")
    }
  }
)

export const updateInterview = createAsyncThunk(
  "application/updateInterview",
  async ({ applicationId, interviewId, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/api/applications/${applicationId}/interviews/${interviewId}`,
        payload
      )
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update interview")
    }
  }
)

export const cancelInterview = createAsyncThunk(
  "application/cancelInterview",
  async ({ applicationId, interviewId, reason }, { rejectWithValue }) => {
    try {
      const params = reason ? { reason } : {}
      await api.delete(
        `/api/applications/${applicationId}/interviews/${interviewId}`,
        { params }
      )
      return interviewId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel interview")
    }
  }
)

// ── Candidate: fetch own applications ─────────────────────────────────────────

export const fetchMyApplications = createAsyncThunk(
  "application/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/applications/my")
      console.log("my applications --- ",data)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applications")
    }
  }
)

// ── Candidate: withdraw application ──────────────────────────────────────────

export const withdrawApplication = createAsyncThunk(
  "application/withdraw",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/applications/${id}/withdraw`, { reason })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to withdraw application")
    }
  }
)

// ── Candidate: submit application ─────────────────────────────────────────────

export const submitApplication = createAsyncThunk(
  "application/submit",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/applications", payload)
      return data
    } catch (err) {
      console.log("err",err)
      return rejectWithValue(err.response?.data?.message || "Failed to submit application")
    }
  }
)
