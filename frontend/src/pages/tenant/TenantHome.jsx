import React from "react";
import { Box, Typography } from "@mui/material";
import TenantLayout from "./TenantLayout";

const TenantHome = () => {
  return (
    <Box
    display="flex"
    flexDirection="column"
    
    >
      <Typography variant="h3" gutterBottom>
        Office Management System
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome! Please use the sidebar to navigate through your dashboard.
      </Typography>
    </Box>
  );
};

export default TenantHome;
