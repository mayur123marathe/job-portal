import { createSlice } from "@reduxjs/toolkit"
import {
  fetchAllPlans, fetchActivePlans, updatePlanConfig,
  fetchActiveSubscription, fetchSubscriptionHistory, cancelSubscription,
  createPaymentOrder, verifyPayment, fetchCompanyTransactions,
} from "./subscriptionThunk"

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    plans: [],              // all plans including inactive (admin)
    activePlans: [],        // active plans only (employer pricing page)
    activeSubscription: null,
    subscriptionHistory: [],
    paymentOrder: null,     // current in-progress payment order
    transactions: [],
    isLoading: false,
    isActionLoading: false,
    error: null,
    actionError: null,
  },
  reducers: {
    clearPaymentOrder(state) { state.paymentOrder = null },
    clearErrors(state) { state.error = null; state.actionError = null },
  },
  extraReducers: builder => {

    // ── fetchAllPlans (admin) ─────────────────────────────────────────────────
    builder
      .addCase(fetchAllPlans.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchAllPlans.fulfilled, (s, { payload }) => { s.isLoading = false; s.plans = payload })
      .addCase(fetchAllPlans.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── fetchActivePlans (employer) ───────────────────────────────────────────
    builder
      .addCase(fetchActivePlans.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchActivePlans.fulfilled, (s, { payload }) => { s.isLoading = false; s.activePlans = payload })
      .addCase(fetchActivePlans.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── updatePlanConfig (admin) ──────────────────────────────────────────────
    builder
      .addCase(updatePlanConfig.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(updatePlanConfig.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        const idx = s.plans.findIndex(p => p.id === payload.id)
        if (idx !== -1) s.plans[idx] = payload
      })
      .addCase(updatePlanConfig.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── fetchActiveSubscription ───────────────────────────────────────────────
    builder
      .addCase(fetchActiveSubscription.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchActiveSubscription.fulfilled, (s, { payload }) => { s.isLoading = false; s.activeSubscription = payload })
      .addCase(fetchActiveSubscription.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── fetchSubscriptionHistory ──────────────────────────────────────────────
    builder
      .addCase(fetchSubscriptionHistory.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchSubscriptionHistory.fulfilled, (s, { payload }) => { s.isLoading = false; s.subscriptionHistory = payload })
      .addCase(fetchSubscriptionHistory.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })

    // ── cancelSubscription ────────────────────────────────────────────────────
    builder
      .addCase(cancelSubscription.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(cancelSubscription.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        s.activeSubscription = payload
        const idx = s.subscriptionHistory.findIndex(h => h.id === payload.id)
        if (idx !== -1) s.subscriptionHistory[idx] = payload
      })
      .addCase(cancelSubscription.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── createPaymentOrder ────────────────────────────────────────────────────
    builder
      .addCase(createPaymentOrder.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(createPaymentOrder.fulfilled, (s, { payload }) => { s.isActionLoading = false; s.paymentOrder = payload })
      .addCase(createPaymentOrder.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── verifyPayment ─────────────────────────────────────────────────────────
    builder
      .addCase(verifyPayment.pending,   s => { s.isActionLoading = true; s.actionError = null })
      .addCase(verifyPayment.fulfilled, (s, { payload }) => {
        s.isActionLoading = false
        s.paymentOrder = null
        // Re-fetch subscription after successful payment is handled in component
      })
      .addCase(verifyPayment.rejected,  (s, { payload }) => { s.isActionLoading = false; s.actionError = payload })

    // ── fetchCompanyTransactions ──────────────────────────────────────────────
    builder
      .addCase(fetchCompanyTransactions.pending,   s => { s.isLoading = true; s.error = null })
      .addCase(fetchCompanyTransactions.fulfilled, (s, { payload }) => { s.isLoading = false; s.transactions = payload })
      .addCase(fetchCompanyTransactions.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })
  },
})

export const { clearPaymentOrder, clearErrors } = subscriptionSlice.actions
export default subscriptionSlice.reducer
