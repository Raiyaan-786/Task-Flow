import React from 'react';
import { Typography } from '@mui/material';
import TenantLayout from './TenantLayout';
import OwnerLayout from './OwnerLayout';

const OwnerHome = () => {
  return (
    <OwnerLayout>
      <Typography variant="h3" gutterBottom>Office Management System</Typography>
      <Typography variant="body1" color="text.secondary">
        Welcome! Please use the sidebar to navigate through your dashboard.
      </Typography>
    </OwnerLayout>
  );
};

export default OwnerHome;