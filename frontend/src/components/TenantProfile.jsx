import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { tenantLogout } from '../features/tenantAuthSlice';
import API from '../api/api';
import { Avatar, Button, TextField, Typography, Paper, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaArrowLeft, FaEdit, FaSave } from 'react-icons/fa';
import TenantLayout from '../components/TenantLayout';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f9fbfd 100%)',
}));

const TenantProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tenant } = useSelector((state) => state.tenantAuth);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTenant, setEditedTenant] = useState({ ...tenant });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(tenant?.companyLogo || '');

  useEffect(() => {
    if (tenant) {
      setEditedTenant({ ...tenant });
      setImagePreview(tenant.companyLogo || '');
    }
  }, [tenant]);

  const handleLogout = () => {
    dispatch(tenantLogout());
    navigate('/tenantlogin');
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editedTenant.name);
      formData.append('phone', editedTenant.phone);
      if (profileImage) {
        formData.append('companyLogo', profileImage);
      }

      const response = await API.put(`/tenant/update/${tenant._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (response.data && response.data.tenant) {
        const updatedTenant = response.data.tenant;
        dispatch({ type: 'tenantAuth/updateTenant', payload: updatedTenant });
        setEditedTenant(updatedTenant);
        setImagePreview(updatedTenant.companyLogo || '');
        setIsEditing(false);
        setProfileImage(null);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
      setEditedTenant({ ...tenant });
      setImagePreview(tenant.companyLogo || '');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTenant((prev) => ({ ...prev, [name]: value }));
  };

  if (!tenant) {
    return <div>Loading tenant data...</div>;
  }

  return (
    <TenantLayout>
      <Box>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: '#2e3b4e', '&:hover': { color: '#1a252f' } }}
          aria-label="back"
        >
          <FaArrowLeft /> <Typography variant="body1" sx={{ ml: 1, fontWeight: 500 }}>Back</Typography>
        </IconButton>

        <StyledPaper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" color="text.primary" fontWeight="bold">
              Profile Information
            </Typography>
            {isEditing ? (
              <Button
                variant="contained"
                startIcon={<FaSave />}
                onClick={handleSave}
                sx={{
                  backgroundColor: '#2e3b4e',
                  '&:hover': { backgroundColor: '#1a252f' },
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                }}
              >
                <Typography variant="button">Save</Typography>
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<FaEdit />}
                onClick={handleEdit}
                sx={{
                  backgroundColor: '#2e3b4e',
                  '&:hover': { backgroundColor: '#1a252f' },
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                }}
              >
                <Typography variant="button">Edit</Typography>
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="bold">
                Basic Information
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Avatar
                  src={imagePreview || 'https://via.placeholder.com/150'}
                  alt="Company Logo"
                  sx={{ width: 150, height: 150, border: '4px solid #fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                />
              </Box>
              {isEditing && (
                <Box sx={{ mb: 3, textAlign: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="company-logo-input"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="company-logo-input">
                    <Button
                      variant="contained"
                      component="span"
                      sx={{
                        backgroundColor: '#4a90e2',
                        '&:hover': { backgroundColor: '#357abd' },
                        borderRadius: '8px',
                        px: 2,
                        py: 1,
                      }}
                    >
                      <Typography variant="button">Change Logo</Typography>
                    </Button>
                  </label>
                </Box>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                    Name:
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    value={editedTenant.name || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      sx: { borderRadius: '8px', backgroundColor: isEditing ? '#fff' : '#f5f5f5' },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                    Email:
                  </Typography>
                  <Typography>{editedTenant.email || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                    Phone:
                  </Typography>
                  <TextField
                    fullWidth
                    name="phone"
                    value={editedTenant.phone || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      sx: { borderRadius: '8px', backgroundColor: isEditing ? '#fff' : '#f5f5f5' },
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                    Company:
                  </Typography>
                  <Typography>{editedTenant.companyName || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                    Company Logo URL:
                  </Typography>
                  <Typography sx={{ wordBreak: 'break-word' }}>
                    {editedTenant.companyLogo ? (
                      <a href={editedTenant.companyLogo} target="_blank" rel="noopener noreferrer" style={{ color: '#4a90e2' }}>
                        View Logo
                      </a>
                    ) : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              {editedTenant.plan && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="bold">
                    Subscription
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Tier:
                      </Typography>
                      <Typography>{editedTenant.plan.tier || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Price:
                      </Typography>
                      <Typography>${editedTenant.plan.price || '0'}/{editedTenant.plan.billingCycle || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Starts At:
                      </Typography>
                      <Typography>{formatDate(editedTenant.plan.startsAt)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Renews At:
                      </Typography>
                      <Typography>{formatDate(editedTenant.plan.renewsAt)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Status:
                      </Typography>
                      <Typography
                        color={editedTenant.plan.status === 'active' ? 'green' : 'red'}
                        textTransform="capitalize"
                      >
                        {editedTenant.plan.status || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Auto Renew:
                      </Typography>
                      <Typography>{editedTenant.plan.isAutoRenew ? '✅ Yes' : '❌ No'}</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              {editedTenant.billing && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="bold">
                    Billing Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Payment Method ID:
                      </Typography>
                      <Typography>{editedTenant.billing.paymentMethodId || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Last Payment:
                      </Typography>
                      <Typography>{formatDate(editedTenant.billing.lastPayment)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Next Billing Date:
                      </Typography>
                      <Typography>{formatDate(editedTenant.billing.nextBillingDate)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Tax ID:
                      </Typography>
                      <Typography>{editedTenant.billing.taxId || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Invoice Email:
                      </Typography>
                      <Typography>{editedTenant.billing.invoiceEmail || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Billing Address:
                      </Typography>
                      <Typography>
                        {editedTenant.billing.billingAddress?.line1 || 'N/A'}<br />
                        {editedTenant.billing.billingAddress?.line2 || 'N/A'}<br />
                        {editedTenant.billing.billingAddress?.city || 'N/A'}, {editedTenant.billing.billingAddress?.state || 'N/A'}<br />
                        {editedTenant.billing.billingAddress?.postalCode || 'N/A'}<br />
                        {editedTenant.billing.billingAddress?.country || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              {editedTenant.features && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="bold">
                    Features
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Can Export:
                      </Typography>
                      <Typography>{editedTenant.features.canExport ? '✅ Enabled' : '❌ Disabled'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        API Access:
                      </Typography>
                      <Typography>{editedTenant.features.apiAccess ? '✅ Enabled' : '❌ Disabled'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Priority Support:
                      </Typography>
                      <Typography>{editedTenant.features.prioritySupport ? '✅ Enabled' : '❌ Disabled'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                        Custom Domain:
                      </Typography>
                      <Typography>{editedTenant.features.customDomain ? '✅ Enabled' : '❌ Disabled'}</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="bold">
                  Additional Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                      Login Username:
                    </Typography>
                    <Typography>{editedTenant.loginCredentials?.username || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                      Notes:
                    </Typography>
                    <Typography>{editedTenant.notes || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                      Referral Source:
                    </Typography>
                    <Typography>{editedTenant.referralSource || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                      Trial Ends At:
                    </Typography>
                    <Typography>{formatDate(editedTenant.trialEndsAt)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                      Is Active:
                    </Typography>
                    <Typography>{editedTenant.isActive ? '✅ Yes' : '❌ No'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                      Created At:
                    </Typography>
                    <Typography>{formatDate(editedTenant.createdAt)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary" sx={{ minWidth: '100px' }}>
                      Updated At:
                    </Typography>
                    <Typography>{formatDate(editedTenant.updatedAt)}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
      </Box>
    </TenantLayout>
  );
};

export default TenantProfile;