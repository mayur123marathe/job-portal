import { createSlice } from "@reduxjs/toolkit"
import {
  fetchMyCompany,
  createCompany,
  updateCompany,
  addLocation,
  updateLocation,
  removeLocation,
  setHeadquarter,
  fetchAllCompanies,
  fetchCompanyById,
  verifyCompany,
  deactivateCompany,
  deleteCompany,
} from "./companyThunk"

const initialState = {
  // Employer
  myCompany: null,
  isMyCompanyLoading: false,

  // Admin
  companies: [],
  currentCompany: null,
  isLoading: false,

  // Shared action loading
  isActionLoading: false,
  error: null,
  actionError: null,
}

// Replace a location in myCompany.locations by id
function replaceLocation(state, updatedLoc) {
  if (!state.myCompany) return
  state.myCompany.locations = (state.myCompany.locations || []).map((l) =>
    l.id === updatedLoc.id ? updatedLoc : l
  )
}

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    clearCurrentCompany(state) { state.currentCompany = null },
    clearErrors(state) { state.error = null; state.actionError = null },
  },
  extraReducers: (builder) => {

    // ── fetchMyCompany ────────────────────────────────────────────────────
    builder
      .addCase(fetchMyCompany.pending, (state) => { state.isMyCompanyLoading = true; state.error = null })
      .addCase(fetchMyCompany.fulfilled, (state, { payload }) => { state.isMyCompanyLoading = false; state.myCompany = payload })
      .addCase(fetchMyCompany.rejected, (state, { payload }) => { state.isMyCompanyLoading = false; state.error = payload })

    // ── createCompany ─────────────────────────────────────────────────────
    builder
      .addCase(createCompany.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(createCompany.fulfilled, (state, { payload }) => { state.isActionLoading = false; state.myCompany = payload })
      .addCase(createCompany.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── updateCompany ─────────────────────────────────────────────────────
    builder
      .addCase(updateCompany.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(updateCompany.fulfilled, (state, { payload }) => {
        state.isActionLoading = false
        state.myCompany = payload
        // Sync admin list if present
        const idx = state.companies.findIndex((c) => c.id === payload.id)
        if (idx !== -1) state.companies[idx] = payload
      })
      .addCase(updateCompany.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── addLocation ───────────────────────────────────────────────────────
    builder
      .addCase(addLocation.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(addLocation.fulfilled, (state, { payload }) => {
        state.isActionLoading = false
        if (state.myCompany) {
          state.myCompany.locations = [...(state.myCompany.locations || []), payload]
        }
      })
      .addCase(addLocation.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── updateLocation ────────────────────────────────────────────────────
    builder
      .addCase(updateLocation.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(updateLocation.fulfilled, (state, { payload }) => { state.isActionLoading = false; replaceLocation(state, payload) })
      .addCase(updateLocation.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── removeLocation ────────────────────────────────────────────────────
    builder
      .addCase(removeLocation.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(removeLocation.fulfilled, (state, { payload: locId }) => {
        state.isActionLoading = false
        if (state.myCompany) {
          state.myCompany.locations = (state.myCompany.locations || []).filter((l) => l.id !== locId)
        }
      })
      .addCase(removeLocation.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── setHeadquarter ────────────────────────────────────────────────────
    builder
      .addCase(setHeadquarter.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(setHeadquarter.fulfilled, (state, { payload }) => {
        state.isActionLoading = false
        // Reset all HQ flags, then set the updated one
        if (state.myCompany) {
          state.myCompany.locations = (state.myCompany.locations || []).map((l) => ({
            ...l,
            isHeadquarter: l.id === payload.id ? payload.isHeadquarter : false,
          }))
        }
      })
      .addCase(setHeadquarter.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── fetchAllCompanies ─────────────────────────────────────────────────
    builder
      .addCase(fetchAllCompanies.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchAllCompanies.fulfilled, (state, { payload }) => { state.isLoading = false; state.companies = payload })
      .addCase(fetchAllCompanies.rejected, (state, { payload }) => { state.isLoading = false; state.error = payload })

    // ── fetchCompanyById ──────────────────────────────────────────────────
    builder
      .addCase(fetchCompanyById.pending, (state) => { state.isLoading = true; state.error = null })
      .addCase(fetchCompanyById.fulfilled, (state, { payload }) => { state.isLoading = false; state.currentCompany = payload })
      .addCase(fetchCompanyById.rejected, (state, { payload }) => { state.isLoading = false; state.error = payload })

    // ── verifyCompany ─────────────────────────────────────────────────────
    builder
      .addCase(verifyCompany.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(verifyCompany.fulfilled, (state, { payload }) => {
        state.isActionLoading = false
        const idx = state.companies.findIndex((c) => c.id === payload.id)
        if (idx !== -1) state.companies[idx] = payload
        if (state.currentCompany?.id === payload.id) state.currentCompany = payload
      })
      .addCase(verifyCompany.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── deactivateCompany ─────────────────────────────────────────────────
    builder
      .addCase(deactivateCompany.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(deactivateCompany.fulfilled, (state, { payload }) => {
        state.isActionLoading = false
        const idx = state.companies.findIndex((c) => c.id === payload.id)
        if (idx !== -1) state.companies[idx] = payload
        if (state.currentCompany?.id === payload.id) state.currentCompany = payload
      })
      .addCase(deactivateCompany.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })

    // ── deleteCompany ─────────────────────────────────────────────────────
    builder
      .addCase(deleteCompany.pending, (state) => { state.isActionLoading = true; state.actionError = null })
      .addCase(deleteCompany.fulfilled, (state, { payload: deletedId }) => {
        state.isActionLoading = false
        state.companies = state.companies.filter((c) => c.id !== deletedId)
        if (state.currentCompany?.id === deletedId) state.currentCompany = null
      })
      .addCase(deleteCompany.rejected, (state, { payload }) => { state.isActionLoading = false; state.actionError = payload })
  },
})

export const { clearCurrentCompany, clearErrors } = companySlice.actions
export default companySlice.reducer
