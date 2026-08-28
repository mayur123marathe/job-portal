import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api"

// ── Plan Config (admin) ───────────────────────────────────────────────────────

export const fetchAllPlans = createAsyncThunk(
  "subscription/fetchAllPlans",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/plans/all")
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch plans")
    }
  }
)

export const fetchActivePlans = createAsyncThunk(
  "subscription/fetchActivePlans",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/plans")
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch plans")
    }
  }
)

export const updatePlanConfig = createAsyncThunk(
  "subscription/updatePlanConfig",
  async ({ id, ...patch }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/plans/${id}`, patch)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update plan")
    }
  }
)

// ── Company Subscription (employer) ──────────────────────────────────────────

export const fetchActiveSubscription = createAsyncThunk(
  "subscription/fetchActive",
  async (companyId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/subscriptions/company/${companyId}/active`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "No active subscription")
    }
  }
)

export const fetchSubscriptionHistory = createAsyncThunk(
  "subscription/fetchHistory",
  async (companyId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/subscriptions/company/${companyId}/history`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch history")
    }
  }
)

export const cancelSubscription = createAsyncThunk(
  "subscription/cancel",
  async ({ subscriptionId, cancellationReason, cancelImmediately = false }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/subscriptions/cancel", {
        subscriptionId,
        cancellationReason,
        cancelImmediately,
      })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to cancel subscription")
    }
  }
)

// ── Payment ───────────────────────────────────────────────────────────────────

export const createPaymentOrder = createAsyncThunk(
  "subscription/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/payments/orders", payload)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create payment order")
    }
  }
)

export const verifyPayment = createAsyncThunk(
  "subscription/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/api/payments/verify", payload)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Payment verification failed")
    }
  }
)

export const fetchCompanyTransactions = createAsyncThunk(
  "subscription/fetchTransactions",
  async (companyId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/payments/transactions/company/${companyId}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch transactions")
    }
  }
)

export const fetchInvoiceByTransaction = createAsyncThunk(
  "subscription/fetchInvoice",
  async (transactionNumber, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/payments/invoices/transaction/${transactionNumber}`)
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch invoice")
    }
  }
)
