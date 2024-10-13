// src/features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,  // Load user from localStorage
  token: localStorage.getItem('token') || null,  // Load token from localStorage
  isAuthenticated: !!localStorage.getItem('token'),  // Check if token exists
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;  // user data from action
      state.token = action.payload.token;  // token from action
      state.isAuthenticated = true;

      // Store in localStorage
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
