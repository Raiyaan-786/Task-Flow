import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tenant: JSON.parse(localStorage.getItem('tenant')) || null,  // Load user from localStorage
    tenanttoken: localStorage.getItem('tenanttoken') || null,  // Load token from localStorage
    isAuthenticated: !!localStorage.getItem('tenanttoken'),  // Check if token exists
    selectedTenant: null,
  };


  const tenantAuthSlice = createSlice({
    name: "tenantAuth",
    initialState,
    reducers: {
      tenantLogin: (state, action) => {
        state.tenant = action.payload.tenant;
        state.tenanttoken = action.payload.tenanttoken;
        state.isAuthenticated = true;
        localStorage.setItem("tenanttoken", state.tenanttoken);
        localStorage.setItem("tenant", JSON.stringify(state.tenant));
      },
      tenantLogout: (state) => {
        state.tenant = null;
        state.tenanttoken = null;
        state.isAuthenticated = false;
        localStorage.removeItem("tenanttoken");
        localStorage.removeItem("tenant");
      },
      setSelectedTenant: (state,action) => {
        state.selectedTenant = action.payload;
      },
    },
  });
  
  export const { tenantLogin, tenantLogout ,setSelectedTenant} = tenantAuthSlice.actions;
  export default tenantAuthSlice.reducer;