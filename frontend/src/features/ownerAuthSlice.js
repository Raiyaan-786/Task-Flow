import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ownertoken: localStorage.getItem('ownertoken') || null,  // Load token from localStorage
    isAuthenticated: !!localStorage.getItem('onwertoken'),  // Check if token exists
  };

  const ownerAuthSlice = createSlice({
    name: "ownerAuth",
    initialState,
    reducers: {
      ownerLogin: (state, action) => {
        state.ownertoken = action.payload.ownertoken;
        state.isAuthenticated = true;
        localStorage.setItem("ownertoken", state.ownertoken);
      },
      ownerLogout: (state) => {
        state.ownertoken = null;
        state.isAuthenticated = false;
        localStorage.removeItem("ownertoken");
      }
    },
  });
  
  export const { ownerLogin, ownerLogout } = ownerAuthSlice.actions;
  export default ownerAuthSlice.reducer;