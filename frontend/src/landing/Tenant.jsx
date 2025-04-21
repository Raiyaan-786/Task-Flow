import React from 'react';
import TenantHome from '../components/TenantHome';
import TenantLayout from '../components/TenantLayout';

const Tenant = () => {
  return (
    <TenantLayout>
      <TenantHome />
    </TenantLayout>
  );
};

export default Tenant;