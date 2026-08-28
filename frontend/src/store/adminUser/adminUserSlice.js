import { createSlice } from "@reduxjs/toolkit"
import {
  fetchAllUsers,
  suspendUser,
  activateUser,
  deleteUser,
  changeUserRole,
} from "./adminUserThunk"

const initialState = {
  users: [],
  isLoading: false,
  isActionLoading: false,
  error: null,
  actionError: null,
}

// Helper: replace a user in the list by id
function replaceUser(users, updated) {
  return users.map((u) => (u.id === updated.id ? updated : u))
}

const adminUserSlice = createSlice({
  name: "adminUser",
  initialState,
  reducers: {
    clearErrors(state) {
      state.error = null
      state.actionError = null
    },
  },
  extraReducers: (builder) => {
    // ── fetchAllUsers ────────────────────────────────────────────────────────
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.users = payload
      })
      .addCase(fetchAllUsers.rejected, (state, { payload }) => {
        state.isLoading = false
        state.error = payload
      })

    // ── suspendUser ──────────────────────────────────────────────────────────
    builder
      .addCase(suspendUser.pending, (state) => {
        state.isActionLoading = true
        state.actionError = null
      })
      .addCase(suspendUser.fulfilled, (state, { payload }) => {
        state.isActionLoading = false
        state.users = replaceUser(state.users, payload)
      })
      .addCase(suspendUser.rejected, (state, { payload }) => {
        state.isActionLoading = false
        state.actionError = payload
      })

    // ── activateUser ─────────────────────────────────────────────────────────
    builder
      .addCase(activateUser.pending, (state) => {
        state.isActionLoading = true
        state.actionError = null
      })
      .addCase(activateUser.fulfilled, (state, { payload }) => {
        state.isActionLoading = false
        state.users = replaceUser(state.users, payload)
      })
      .addCase(activateUser.rejected, (state, { payload }) => {
        state.isActionLoading = false
        state.actionError = payload
      })

    // ── deleteUser ───────────────────────────────────────────────────────────
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isActionLoading = true
        state.actionError = null
      })
      .addCase(deleteUser.fulfilled, (state, { payload }) => {
        state.isActionLoading = false
        // Mark as deleted in place (status = DELETED) instead of removing from list
        state.users = replaceUser(state.users, payload)
      })
      .addCase(deleteUser.rejected, (state, { payload }) => {
        state.isActionLoading = false
        state.actionError = payload
      })

    // ── changeUserRole ───────────────────────────────────────────────────────
    builder
      .addCase(changeUserRole.pending, (state) => {
        state.isActionLoading = true
        state.actionError = null
      })
      .addCase(changeUserRole.fulfilled, (state, { payload }) => {
        state.isActionLoading = false
        state.users = replaceUser(state.users, payload)
      })
      .addCase(changeUserRole.rejected, (state, { payload }) => {
        state.isActionLoading = false
        state.actionError = payload
      })
  },
})

export const { clearErrors } = adminUserSlice.actions
export default adminUserSlice.reducer
