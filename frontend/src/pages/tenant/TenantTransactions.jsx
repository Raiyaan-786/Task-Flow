import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Modal,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

const TenantTransactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Fetch all transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('tenanttoken');
        console.log("Tenant token:", token);
        if (!token) {
          setError("Please log in to view your transactions.");
          navigate('/tenantlogin');
          return;
        }
        const response = await API.get('/tenant/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          console.log("Fetched transactions:", response.data.transactions);
          setTransactions(response.data.transactions);
        } else {
          setError(response.data.message || 'Failed to fetch transactions');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching transactions');
        if (err.response?.status === 401) {
          navigate('/tenantlogin');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [navigate]);

  // Fetch receipt details when "View Receipt" is clicked
  const handleViewReceipt = async (paymentId) => {
    if (!paymentId) {
      setModalError("Error: Payment ID is missing.");
      return;
    }

    try {
      setModalOpen(true);
      setModalLoading(true);
      setModalError(null);
      setSelectedReceipt(null);

      const token = localStorage.getItem('tenanttoken');
      if (!token) {
        setModalError("Please log in to view your receipt.");
        navigate('/tenantlogin');
        return;
      }

      const response = await API.get(`/tenant/payments/receipt/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSelectedReceipt(response.data.payment);
      } else {
        setModalError(response.data.message || 'Failed to fetch receipt');
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'An error occurred while fetching the receipt');
      if (err.response?.status === 401) {
        navigate('/tenantlogin');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReceipt(null);
    setModalError(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        Your Transactions
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && transactions.length === 0 && (
        <Typography variant="h6" color="textSecondary" textAlign="center">
          No transactions found.
        </Typography>
      )}

      {!loading && !error && transactions.length > 0 && (
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Plan Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Billing Cycle</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                  <TableCell>
                    {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{transaction.plan?.tier || 'N/A'}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)} {transaction.currency}</TableCell>
                  <TableCell>{transaction.plan.billingCycle}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewReceipt(transaction._id)}
                      sx={{
                        textTransform: 'none',
                        borderColor: '#2563eb',
                        color: '#2563eb',
                        '&:hover': { borderColor: '#1e40af', color: '#1e40af' },
                      }}
                    >
                      View Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Displaying Receipt */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="receipt-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: { xs: '90%', sm: 500 },
            maxHeight: '80vh',
            overflowY: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="receipt-modal-title" variant="h5" fontWeight="bold" mb={3}>
            Payment Receipt
          </Typography>

          {modalLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {modalError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {modalError}
            </Alert>
          )}

          {!modalLoading && !modalError && selectedReceipt && (
            <Box>
              <Typography variant="body1" mb={1}>
                <strong>Transaction ID:</strong> {selectedReceipt._id}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Tenant Email:</strong> {selectedReceipt.tenant?.email || 'N/A'}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Plan:</strong> {selectedReceipt.plan?.tier || 'N/A'}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Amount:</strong> ${selectedReceipt.amount?.toFixed(2)} {selectedReceipt.currency}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Billing Cycle:</strong> {selectedReceipt.plan.billingCycle}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Transaction Date:</strong>{' '}
                {new Date(selectedReceipt.transactionDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Cardholder:</strong> {selectedReceipt.firstName} {selectedReceipt.lastName}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Card Number:</strong> {selectedReceipt.cardNumber} {/* Mask this in production */}
              </Typography>
              <Typography variant="body1" mb={1}>
                <strong>Expiry:</strong> {selectedReceipt.expiry}
              </Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default TenantTransactions;