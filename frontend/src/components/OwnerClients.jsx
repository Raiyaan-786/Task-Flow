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

const OwnerClients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clients from backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get('/owner/getallclients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch clients. Please try again.');
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Handle row click to navigate to client details
  const handleRowClick = (clientId) => {
    navigate(`/owner/client/${clientId}`);
  };

  return (
    <OwnerLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          All Clients
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          View details of all registered clients in the system.
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
                    <Typography fontWeight="bold">Image</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Phone</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">Plan Tier</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography>No clients found.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow
                      key={client._id}
                      onClick={() => handleRowClick(client._id)}
                      sx={{
                        '&:hover': { backgroundColor: colors.grey[900], cursor: 'pointer' },
                      }}
                    >
                      <TableCell>
                        <Avatar
                          src={client.image || 'https://via.placeholder.com/40'}
                          alt={client.name}
                          sx={{ width: 40, height: 40 }}
                        />
                      </TableCell>
                      <TableCell>{client.name || 'N/A'}</TableCell>
                      <TableCell>{client.phone || 'N/A'}</TableCell>
                      <TableCell>{client.plan?.tier || 'N/A'}</TableCell>
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

export default OwnerClients;