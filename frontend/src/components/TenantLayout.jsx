import React from 'react';
import TenantSidebar from './TenantSidebar';
import { Box } from '@mui/material';

const TenantLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <TenantSidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          padding: 3,
          backgroundColor: '#f0f2f5',
          overflowY: 'auto',
          ml: '240px', // Matches sidebar width
          zIndex: 1, // Ensure content is above any potential sidebar overflow
          minWidth: 0, // Prevent flex overflow issues
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default TenantLayout;