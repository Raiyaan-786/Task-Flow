import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Button,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { tokens } from '../theme'; // Adjust path as needed
import API from '../api/api'; // Adjust path as needed
import OwnerLayout from './OwnerLayout'; // Adjust path as needed

const OwnerPaymentDetails = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { paymentId } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Fetch payment details from backend
  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/ownerlogin');
          return;
        }
        const response = await API.get(`/owner/payments/${paymentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayment(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch payment details.');
        setLoading(false);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchPayment();
  }, [paymentId, navigate]);

  // Handle back navigation
  const handleBack = () => {
    navigate('/owner/payment');
  };

  return (
    <OwnerLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Payment Details
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View detailed information about the selected payment.
        </Typography>

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

        {!loading && !error && payment && (
          <Paper sx={{ p: 3, mt: 3, borderRadius: 2, boxShadow: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={payment.tenant?.image || 'https://via.placeholder.com/60'}
                    alt={`Profile image of ${payment.tenant?.name || 'unknown tenant'}`}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {payment.tenant?.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {payment.tenant?.email || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight="bold">
                  Payment ID
                </Typography>
                <Typography variant="body1">{payment._id}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight="bold">
                  Plan
                </Typography>
                <Typography variant="body1">{payment.plan?.name || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {payment.plan?.price || 'N/A'} {payment.currency || 'USD'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight="bold">
                  Amount
                </Typography>
                <Typography variant="body1">
                  {payment.amount} {payment.currency || 'USD'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight="bold">
                  Status
                </Typography>
                <Typography variant="body1">{payment.status || 'N/A'}</Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleBack}
                sx={{
                  backgroundColor: colors.primary[500],
                  '&:hover': { backgroundColor: colors.primary[700] },
                }}
              >
                Back to Payments
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </OwnerLayout>
  );
};

export default OwnerPaymentDetails;