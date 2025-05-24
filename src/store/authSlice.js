import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role") || null, // Get role from localStorage too
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user || null;
      state.token = action.payload.token;
      state.role = action.payload.role || null;
      state.isAuthenticated = true;
      // Also sync localStorage here to keep in sync
      localStorage.setItem("token", action.payload.token);
      if (action.payload.role) {
        localStorage.setItem("role", action.payload.role);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
  },
});

export const { login, logout, setUser, setRole } = authSlice.actions;
export default authSlice.reducer;
