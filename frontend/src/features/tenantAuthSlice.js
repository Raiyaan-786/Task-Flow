import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tenant: JSON.parse(localStorage.getItem('tenant')) || null,  // Load user from localStorage
    token: localStorage.getItem('token') || null,  // Load token from localStorage
    isAuthenticated: !!localStorage.getItem('token'),  // Check if token exists
    selectedTenant: null,
  };


  const tenantAuthSlice = createSlice({
    name: "tenantAuth",
    initialState,
    reducers: {
      tenantLogin: (state, action) => {
        state.tenant = action.payload.tenant;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("token", state.token);
        localStorage.setItem("tenant", JSON.stringify(state.tenant));
      },
      tenantLogout: (state) => {
        state.tenant = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("tenant");
      },
      setSelectedTenant: (state,action) => {
        state.selectedTenant = action.payload;
      },
    },
  });
  
  export const { tenantLogin, tenantLogout ,setSelectedTenant} = tenantAuthSlice.actions;
  export default tenantAuthSlice.reducer;