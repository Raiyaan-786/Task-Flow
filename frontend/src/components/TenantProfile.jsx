import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar, Typography, Divider } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../theme';
import API from '../api/api';
import TenantLayout from './TenantLayout';

const TenantProfilePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Get the current tenant from localStorage
  const tenant = JSON.parse(localStorage.getItem('tenant'));
  const token = localStorage.getItem('token');

  // If no tenant is logged in, redirect to login page
  useEffect(() => {
    if (!tenant) {
      navigate('/login');
    }
  }, [tenant, navigate]);

  // States for editable tenant profile data
  const [name, setName] = useState(tenant?.name || '');
  const [phone, setPhone] = useState(tenant?.phone || '');
  const [companyName, setCompanyName] = useState(tenant?.companyName || '');
  const [companyLogo, setCompanyLogo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(tenant?.image || tenant?.companyLogo || '');
  const [companyLogoPreview, setCompanyLogoPreview] = useState(tenant?.companyLogo || '');

  // Check if the plan is Free
  const isFreePlan = tenant?.plan?.tier?.toLowerCase() === 'free';

  // Handle profile image change
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

  // Handle company logo change
  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    setCompanyLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCompanyLogoPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);

    if (profileImage) {
      formData.append('image', profileImage); // Append profile image if selected
    }

    if (!isFreePlan) {
      formData.append('companyName', companyName);
      if (companyLogo) {
        formData.append('companyLogo', companyLogo); // Append company logo if selected
      }
    }

    try {
      await API.put(`/tenant/update/${tenant._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Tenant profile updated successfully!');
      // Update tenant data in localStorage
      localStorage.setItem(
        'tenant',
        JSON.stringify({
          ...tenant,
          name,
          phone,
          image: imagePreview,
          companyName: isFreePlan ? tenant.companyName : companyName,
          companyLogo: isFreePlan ? tenant.companyLogo : companyLogoPreview,
        })
      );
    } catch (error) {
      console.error(error);
      alert('Error updating tenant profile');
    }
  };

  return (
    <TenantLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tenant Profile
        </Typography>
        <Box
          bgcolor={colors.primary[900]}
          borderRadius={'10px'}
          p={3}
          display="flex"
          flexDirection="column"
        >
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <Typography variant="h5" gutterBottom>
              Basic Information
            </Typography>
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar
                src={imagePreview || 'https://via.placeholder.com/150'}
                alt="Tenant Profile"
                sx={{ width: 100, height: 100 }}
              />
            </Box>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              id="profile-image-input"
            />
            <label htmlFor="profile-image-input">
              <Button variant="outlined" component="span" fullWidth>
                Change Profile Image
              </Button>
            </label>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={tenant?.email || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />

            {/* Company Information Section */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom>
              Company Information
            </Typography>
            <TextField
              label="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: isFreePlan }}
              sx={{ backgroundColor: isFreePlan ? '#fff' : 'inherit' }}
            />
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar
                src={companyLogoPreview || 'https://via.placeholder.com/150'}
                alt="Company Logo"
                sx={{ width: 100, height: 100 }}
              />
            </Box>
            <input
              type="file"
              accept="image/*"
              onChange={handleCompanyLogoChange}
              style={{ display: 'none' }}
              id="company-logo-input"
              disabled={isFreePlan}
            />
            <label htmlFor="company-logo-input">
              <Button
                variant="outlined"
                component="span"
                fullWidth
                disabled={isFreePlan}
              >
                Change Company Logo
              </Button>
            </label>

            {/* Plan Information Section */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom>
              Plan Information
            </Typography>
            <TextField
              label="Subscription Plan"
              value={tenant?.plan?.tier || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="Start Date"
              value={
                tenant?.plan?.startsAt
                  ? new Date(tenant.plan.startsAt).toLocaleDateString()
                  : ''
              }
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="Renewal Date"
              value={
                tenant?.plan?.renewsAt
                  ? new Date(tenant.plan.renewsAt).toLocaleDateString()
                  : ''
              }
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />

            {/* Billing Information Section */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom>
              Billing Information
            </Typography>
            <TextField
              label="Address Line 1"
              value={tenant?.billing?.billingAddress?.line1 || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="City"
              value={tenant?.billing?.billingAddress?.city || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="State"
              value={tenant?.billing?.billingAddress?.state || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="Postal Code"
              value={tenant?.billing?.billingAddress?.postalCode || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="Country"
              value={tenant?.billing?.billingAddress?.country || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="Next Billing Date"
              value={
                tenant?.billing?.nextBillingDate
                  ? new Date(tenant.billing.nextBillingDate).toLocaleDateString()
                  : ''
              }
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="Invoice Email"
              value={tenant?.billing?.invoiceEmail || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />

            {/* Login Credentials Section */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom>
              Login Credentials
            </Typography>
            <TextField
              label="Username"
              value={tenant?.loginCredentials?.username || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="password"
              value={tenant?.loginCredentials?.password || ''}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />

            {/* Features Section */}
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom>
              Features
            </Typography>
            <TextField
              label="Can Export"
              value={tenant?.features?.canExport ? 'Yes' : 'No'}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="API Access"
              value={tenant?.features?.apiAccess ? 'Yes' : 'No'}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="Priority Support"
              value={tenant?.features?.prioritySupport ? 'Yes' : 'No'}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />
            <TextField
              label="Custom Domain"
              value={tenant?.features?.customDomain ? 'Yes' : 'No'}
              fullWidth
              margin="normal"
              InputProps={{ readOnly: true }}
              sx={{ backgroundColor: '#fff' }}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
              Update Profile
            </Button>
          </form>
        </Box>
      </Box>
    </TenantLayout>
  );
};

export default TenantProfilePage;