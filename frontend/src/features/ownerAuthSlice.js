import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem('token') || null,  // Load token from localStorage
    isAuthenticated: !!localStorage.getItem('token'),  // Check if token exists
  };

  const ownerAuthSlice = createSlice({
    name: "ownerAuth",
    initialState,
    reducers: {
      ownerLogin: (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", state.token);
      },
      ownerLogout: (state) => {
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      }
    },
  });
  
  export const { ownerLogin, ownerLogout } = ownerAuthSlice.actions;
  export default ownerAuthSlice.reducer;