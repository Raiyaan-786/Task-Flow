import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

const ProfilePage = () => {
  const navigate = useNavigate();
  
  // Sample tenant data (in a real app, this would come from API/context)
  const tenant = {
    plan: {
      tier: "pro",
      price: 49.99,
      billingCycle: "monthly",
      startsAt: "2025-04-01T00:00:00.000Z",
      renewsAt: "2025-05-01T00:00:00.000Z",
      status: "active",
      isAutoRenew: true
    },
    billing: {
      billingAddress: {
        line1: "123 Main St",
        city: "City",
        state: "State",
        postalCode: "123456",
        country: "Country"
      },
      paymentMethodId: "pm_abc123",
      lastPayment: "2025-04-01T00:00:00.000Z",
      nextBillingDate: "2025-05-01T00:00:00.000Z",
      invoiceEmail: "billing@example.com"
    },
    features: {
      canExport: true,
      apiAccess: true,
      prioritySupport: false,
      customDomain: false
    },
    _id: "6804e63dd6085c66da7fbb29",
    companyName: "Acme Corp",
    email: "Suhail@gmail.com",
    subscriptionPlan: "Free",
    createdAt: "2025-04-20T12:19:09.320Z",
    updatedAt: "2025-04-20T13:03:48.924Z",
    companyLogo: "https://example.com/logo.png",
    isActive: true,
    name: "Suhail Akhtar",
    notes: "VIP client",
    phone: "+1234567890",
    referralSource: "LinkedIn",
    trialEndsAt: "2025-04-30T00:00:00.000Z"
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar would be here if using the same layout */}
      
      {/* Main Content */}
      <div style={{ padding: '20px', flex: 1, background: '#f0f2f5' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginBottom: '20px'
          }}
        >
          <FaArrowLeft /> Back
        </button>
        
        <div style={{ 
          background: 'white', 
          borderRadius: '8px', 
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2>Profile Information</h2>
            <button 
              onClick={() => navigate('/office/profile/edit')}
              style={{
                background: '#2e3b4e',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <FaEdit /> Edit
            </button>
          </div>

          <div style={{ display: 'flex', gap: '30px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px', color: '#555' }}>Basic Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px' }}>
                  <div style={{ fontWeight: 'bold' }}>Name:</div>
                  <div>{tenant.name}</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Email:</div>
                  <div>{tenant.email}</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Phone:</div>
                  <div>{tenant.phone}</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Company:</div>
                  <div>{tenant.companyName}</div>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px', color: '#555' }}>Subscription</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px' }}>
                  <div style={{ fontWeight: 'bold' }}>Plan:</div>
                  <div>{tenant.plan.tier} (${tenant.plan.price}/{tenant.plan.billingCycle})</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Status:</div>
                  <div style={{ 
                    color: tenant.plan.status === 'active' ? 'green' : 'red',
                    textTransform: 'capitalize'
                  }}>
                    {tenant.plan.status}
                  </div>
                  
                  <div style={{ fontWeight: 'bold' }}>Renewal:</div>
                  <div>{formatDate(tenant.plan.renewsAt)}</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Trial Ends:</div>
                  <div>{formatDate(tenant.trialEndsAt)}</div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '10px', color: '#555' }}>Billing Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px' }}>
                  <div style={{ fontWeight: 'bold' }}>Billing Address:</div>
                  <div>
                    {tenant.billing.billingAddress.line1}<br />
                    {tenant.billing.billingAddress.city}, {tenant.billing.billingAddress.state}<br />
                    {tenant.billing.billingAddress.postalCode}<br />
                    {tenant.billing.billingAddress.country}
                  </div>
                  
                  <div style={{ fontWeight: 'bold' }}>Invoice Email:</div>
                  <div>{tenant.billing.invoiceEmail}</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Last Payment:</div>
                  <div>{formatDate(tenant.billing.lastPayment)}</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Next Billing:</div>
                  <div>{formatDate(tenant.billing.nextBillingDate)}</div>
                </div>
              </div>

              <div>
                <h3 style={{ marginBottom: '10px', color: '#555' }}>Features</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px' }}>
                  <div style={{ fontWeight: 'bold' }}>API Access:</div>
                  <div>{tenant.features.apiAccess ? '✅ Enabled' : '❌ Disabled'}</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Data Export:</div>
                  <div>{tenant.features.canExport ? '✅ Enabled' : '❌ Disabled'}</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Priority Support:</div>
                  <div>{tenant.features.prioritySupport ? '✅ Enabled' : '❌ Disabled'}</div>
                  
                  <div style={{ fontWeight: 'bold' }}>Custom Domain:</div>
                  <div>{tenant.features.customDomain ? '✅ Enabled' : '❌ Disabled'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;