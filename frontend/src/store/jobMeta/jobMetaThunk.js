import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api"

// ── Categories ───────────────────────────────────────────────────────────────

export const fetchCategories = createAsyncThunk(
  "jobMeta/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/job-categories")
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch categories.")
    }
  }
)

export const createCategory = createAsyncThunk(
  "jobMeta/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/job-categories", payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create category.")
    }
  }
)

export const updateCategory = createAsyncThunk(
  "jobMeta/updateCategory",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/job-categories/${id}`, payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category.")
    }
  }
)

export const deleteCategory = createAsyncThunk(
  "jobMeta/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/job-categories/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete category.")
    }
  }
)

// ── Skills ───────────────────────────────────────────────────────────────────

export const fetchSkills = createAsyncThunk(
  "jobMeta/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/job-skills")
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch skills.")
    }
  }
)

export const createSkill = createAsyncThunk(
  "jobMeta/createSkill",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/job-skills", payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create skill.")
    }
  }
)

export const updateSkill = createAsyncThunk(
  "jobMeta/updateSkill",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/job-skills/${id}`, payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update skill.")
    }
  }
)

export const deleteSkill = createAsyncThunk(
  "jobMeta/deleteSkill",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/job-skills/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete skill.")
    }
  }
)

// ── Tags ─────────────────────────────────────────────────────────────────────

export const fetchTags = createAsyncThunk(
  "jobMeta/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/job-tags")
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch tags.")
    }
  }
)

export const createTag = createAsyncThunk(
  "jobMeta/createTag",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/job-tags", payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create tag.")
    }
  }
)

export const updateTag = createAsyncThunk(
  "jobMeta/updateTag",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/job-tags/${id}`, payload)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update tag.")
    }
  }
)

export const deleteTag = createAsyncThunk(
  "jobMeta/deleteTag",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/job-tags/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete tag.")
    }
  }
)
