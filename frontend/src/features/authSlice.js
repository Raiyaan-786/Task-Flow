// src/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,  // Load user from localStorage
  token: localStorage.getItem('token') || null,  // Load token from localStorage
  isAuthenticated: !!localStorage.getItem('token'),  // Check if token exists
  selectedUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
    },
    setSelectedUser: (state,action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { login, logout ,setSelectedUser } = authSlice.actions;
export default authSlice.reducer;