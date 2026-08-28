import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api"

// ── Public: search + filter all OPEN jobs ────────────────────────────────────
// Params: keyword, location, minSalary, maxSalary, jobType, workMode,
//         experienceLevel, categoryId, companyId, skillIds, tagIds

export const fetchJobs = createAsyncThunk(
  "job/fetchJobs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const clean = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== "")
      )
      const { data } = await api.get("/api/jobs", { params: clean })
      console.log("fetch jobs ",data)
      return data
    } catch (err) {
      console.log("fetch job error ", err)
      return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs")
    }
  }
)

// ── Employer: fetch own jobs ─────────────────────────────────────────────────
// Uses X-User-Id injected by gateway — no ID param needed

export const fetchMyJobs = createAsyncThunk(
  "job/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/jobs/my")
      console.log("fetch my jobs", data)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs")
    }
  }
)

// ── Fetch single job (full detail) ───────────────────────────────────────────

export const fetchJobById = createAsyncThunk(
  "job/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/jobs/${id}`)
      console.log("job id id ", data)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch job")
    }
  }
)

// ── Create job (saves as DRAFT) ──────────────────────────────────────────────

export const createJob = createAsyncThunk(
  "job/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/jobs", payload)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create job")
    }
  }
)

// ── Update job ───────────────────────────────────────────────────────────────

export const updateJob = createAsyncThunk(
  "job/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/jobs/${id}`, payload)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update job")
    }
  }
)

// ── Publish job (DRAFT → OPEN) ───────────────────────────────────────────────

export const publishJob = createAsyncThunk(
  "job/publish",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/jobs/${id}/publish`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to publish job")
    }
  }
)

// ── Close job (OPEN → CLOSED) ────────────────────────────────────────────────

export const closeJob = createAsyncThunk(
  "job/close",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/jobs/${id}/close`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to close job")
    }
  }
)

// ── Admin: fetch all jobs regardless of status ───────────────────────────────

export const fetchAllJobsAdmin = createAsyncThunk(
  "job/fetchAllAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/jobs/admin")
      console.log("jobs",job)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch jobs")
    }
  }
)

// ── Delete job ───────────────────────────────────────────────────────────────

export const deleteJob = createAsyncThunk(
  "job/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/jobs/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete job")
    }
  }
)
