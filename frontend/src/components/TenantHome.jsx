import React from 'react';
import { Typography } from '@mui/material';
import TenantLayout from './TenantLayout';

const TenantHome = () => {
  return (
    <TenantLayout>
      <Typography variant="h3" gutterBottom>Office Management System</Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome! Please use the sidebar to navigate through your dashboard.
      </Typography>
    </TenantLayout>
  );
};

export default TenantHome;