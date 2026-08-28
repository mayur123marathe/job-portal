import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);

      // Store token in localStorage
      if (response.data.jwt) {
        localStorage.setItem("accessToken", response.data.jwt);
      }
      console.log("Logged in user:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/signup", userData);

      // Store token in localStorage
      if (response.data.jwt) {
        localStorage.setItem("accessToken", response.data.jwt);
      }

      console.log("Registered user:", response.data);

      return response.data;
    } catch (error) {
      console.log("Registration error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }
);

// Fetch Current User Profile
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/users/profile");
      console.log("Fetched user profile:", response.data);
      return response.data;
    } catch (error) {
      console.log("Fetch user profile error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user profile."
      );
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset link."
      );
    }
  }
);

// Update Profile (PUT /api/users/profile)
// Payload: { fullName, phone, profileImage }
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const { data: res } = await api.put("/api/users/profile", data)
      return res
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile")
    }
  }
)

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password."
      );
    }
  }
);
