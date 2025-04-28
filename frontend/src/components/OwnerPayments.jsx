import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { tokens } from '../theme';
import API from '../api/api';
import OwnerLayout from './OwnerLayout';

const OwnerPayments = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments from backend
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get('/owner/getallpayments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayments(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch payments. Please try again.');
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Handle row click to navigate to payment details (placeholder route)
  const handleRowClick = (paymentId) => {
    navigate(`/owner/payment/${paymentId}`);
  };

  return (
    <OwnerLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          All Payments
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View details of all payment transactions in the system.
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

        {!loading && !error && (
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 2, boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: colors.primary[900] }}>
                  <TableCell>
                    <Typography fontWeight="bold">Tenant Image</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Tenant Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Plan Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Amount</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Status</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>No payments found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow
                      key={payment._id}
                      onClick={() => handleRowClick(payment._id)}
                      sx={{
                        '&:hover': { backgroundColor: colors.grey[900], cursor: 'pointer' },
                      }}
                    >
                      <TableCell>
                        <Avatar
                          src={payment.tenant?.image || 'https://via.placeholder.com/40'}
                          alt={payment.tenant?.name || 'Tenant'}
                          sx={{ width: 40, height: 40 }}
                        />
                      </TableCell>
                      <TableCell>{payment.tenant?.name || 'N/A'}</TableCell>
                      <TableCell>{payment.plan?.name || 'N/A'}</TableCell>
                      <TableCell>{payment.amount} {payment.currency}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </OwnerLayout>
  );
};

export default OwnerPayments;