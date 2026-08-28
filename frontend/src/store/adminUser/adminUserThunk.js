import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api"

export const fetchAllUsers = createAsyncThunk(
  "adminUser/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/users")
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users."
      )
    }
  }
)

export const suspendUser = createAsyncThunk(
  "adminUser/suspend",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/users/${id}/suspend`)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to suspend user."
      )
    }
  }
)

export const activateUser = createAsyncThunk(
  "adminUser/activate",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/users/${id}/activate`)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to activate user."
      )
    }
  }
)

export const deleteUser = createAsyncThunk(
  "adminUser/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/api/users/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user."
      )
    }
  }
)

export const changeUserRole = createAsyncThunk(
  "adminUser/changeRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/users/${id}/role`, null, {
        params: { role },
      })
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change user role."
      )
    }
  }
)
