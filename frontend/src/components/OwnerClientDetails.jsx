import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Divider,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { tokens } from '../theme';
import API from '../api/api';
import OwnerLayout from './OwnerLayout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OwnerClientDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams(); // Use 'id' to match route '/owner/client/:id'
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch client details from backend
  useEffect(() => {
    const fetchClient = async () => {
      // Check for token
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        navigate('/ownerlogin');
        return;
      }

      try {
        console.log('Fetching client with ID:', id); // Debug
        console.log('Using token:', token); // Debug
        const response = await API.get(`/owner/getclient/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data); // Debug
        if (!response.data || Object.keys(response.data).length === 0) {
          setError('No client data returned from the server.');
          setLoading(false);
          return;
        }
        setClient(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err); // Debug
        console.error('Error Response:', err.response); // Debug
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in as an Owner.');
          localStorage.removeItem('token');
          navigate('/ownerlogin');
        } else if (err.response?.status === 403) {
          setError('Access denied. Owner role required.');
        } else if (err.response?.status === 404) {
          setError('Client not found.');
        } else {
          setError(err.response?.data?.error || 'Failed to fetch client details.');
        }
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, navigate]);

  return (
    <OwnerLayout>
      <Box sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/owner/client')}
            sx={{ mr: 2 }}
          >
            Back to Clients
          </Button>
          <Typography variant="h4">Client Details</Typography>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && client && (
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 2 }}>
            <Grid container spacing={3}>
              {/* Profile Section */}
              <Grid item xs={12} md={4} display="flex" justifyContent="center">
                <Box textAlign="center">
                  <Avatar
                    src={client.image || 'https://via.placeholder.com/150'}
                    alt={client.name}
                    sx={{ width: 150, height: 150, mb: 2 }}
                  />
                  <Typography variant="h5">{client.name || 'N/A'}</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {client.email || 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Phone:</strong> {client.phone || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Company Name:</strong> {client.companyName || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Company Logo:</strong>{' '}
                        {client.companyLogo ? (
                          <img
                            src={client.companyLogo}
                            alt="Company Logo"
                            style={{ maxWidth: '100px', maxHeight: '50px' }}
                          />
                        ) : (
                          'N/A'
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Notes:</strong> {client.notes || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Referral Source:</strong> {client.referralSource || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Active:</strong> {client.isActive ? 'Yes' : 'No'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Plan Details */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Plan Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tier:</strong> {client.plan?.tier || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Price:</strong> ${client.plan?.price?.toFixed(2) || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Billing Cycle:</strong> {client.plan?.billingCycle || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Status:</strong> {client.plan?.status || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Starts At:</strong>{' '}
                      {client.plan?.startsAt
                        ? new Date(client.plan.startsAt).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Renews At:</strong>{' '}
                      {client.plan?.renewsAt
                        ? new Date(client.plan.renewsAt).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Auto Renew:</strong> {client.plan?.isAutoRenew ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Trial Ends At:</strong>{' '}
                      {client.trialEndsAt
                        ? new Date(client.trialEndsAt).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Billing Information */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Billing Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Payment Method ID:</strong>{' '}
                      {client.billing?.paymentMethodId || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Last Payment:</strong>{' '}
                      {client.billing?.lastPayment
                        ? new Date(client.billing.lastPayment).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Next Billing Date:</strong>{' '}
                      {client.billing?.nextBillingDate
                        ? new Date(client.billing.nextBillingDate).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Tax ID:</strong> {client.billing?.taxId || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Invoice Email:</strong> {client.billing?.invoiceEmail || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Billing Address:</strong>{' '}
                      {client.billing?.billingAddress
                        ? `${client.billing.billingAddress.line1 || ''}, ${
                            client.billing.billingAddress.line2 || ''
                          }, ${client.billing.billingAddress.city || ''}, ${
                            client.billing.billingAddress.state || ''
                          }, ${client.billing.billingAddress.postalCode || ''}, ${
                            client.billing.billingAddress.country || ''
                          }`.trim()
                        : 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Features */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Features
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Can Export:</strong> {client.features?.canExport ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>API Access:</strong> {client.features?.apiAccess ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Priority Support:</strong>{' '}
                      {client.features?.prioritySupport ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Custom Domain:</strong>{' '}
                      {client.features?.customDomain ? 'Yes' : 'No'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Login Credentials */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Login Credentials
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Username:</strong> {client.loginCredentials?.username || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>
    </OwnerLayout>
  );
};

export default OwnerClientDetails;