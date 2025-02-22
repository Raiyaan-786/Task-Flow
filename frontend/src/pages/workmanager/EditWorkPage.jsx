import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Grid2, Typography } from '@mui/material';
import API from '../../api/api';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const EditWorkPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams(); // Get the work ID from the URL
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkDetails = async () => {
      try {
        const response = await API.get(`/getwork/${id}`);
        setWork(response.data.work);
        console.log(response.data.work) // Assuming response.data contains the work object
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch work details');
        setLoading(false);
      }
    };

    fetchWorkDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWork((prevWork) => ({
      ...prevWork,
      [name]: value, // Dynamically updating the field in the work object
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await API.put(`/updatework/${id}`, work, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Redirect back to the total works page after saving
      navigate('/');
    } catch (error) {
      setError('Failed to save changes');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box display={'flex'} flexDirection={'column'} height={'88%'} overflow={'auto'} margin={'10px'} p={0.1}>
      <Header title={'Work Profile'} />
      <Box
        bgcolor={colors.primary[900]}
        flexGrow={1}
        mt="2px"
        display="flex"
        flexDirection="row"
        borderRadius={'10px'}
      >

        <Box container display={'flex'} flexDirection={'column'} spacing={2} gap={2} padding={"10px 40px"} color={colors.grey[200]} flex='2' >
          <Grid2 size={12}>
            <Typography variant="h3" color={colors.grey[500]} fontWeight={'bold'} marginBottom={2}>Customer Details</Typography>
          </Grid2>


          {/* Customer Name */}

          <Grid2 size={6}>
            <TextField
              label="Customer Name"
              value={work.customer.customerName || ''} // Default to empty string if undefined
              variant="filled"
              onChange={handleInputChange}
              name="customer" // Field name for dynamic update
              fullWidth
            />
          </Grid2>
          {/* Billing Name */}

          <Grid2 size={6}>
            <TextField
              label="Billing Name"
              value={work.billingName || ''}
              variant="filled"
              onChange={handleInputChange}
              name="billingName"
              fullWidth
            />
          </Grid2>
          {/* Email */}

          <Grid2 size={6}>
            <TextField
              label="Email"
              value={work.customer.email || ''}
              variant="filled"
              onChange={handleInputChange}
              name="email"
              fullWidth
              disabled
            />
          </Grid2>

          {/* Mobile */}

          <Grid2 size={6}>
            <TextField
              label="Mobile"
              value={work.customer.mobileNo || ''}
              variant="filled"
              onChange={handleInputChange}
              name="mobile"
              fullWidth
            />
          </Grid2>

          {/* PAN */}

          <Grid2 size={6}>
            <TextField
              label="PAN"
              value={work.pan || ''}
              variant="filled"
              onChange={handleInputChange}
              name="pan"
              fullWidth
              disabled
            />
          </Grid2>

          {/* Address */}

          <Grid2 size={6}>
            <TextField
              label="Address"
              value={work.address || ''}
              variant="filled"
              onChange={handleInputChange}
              name="address"
              fullWidth
              multiline
              minRows={3}
              maxRows={3}
            />
          </Grid2>
        </Box>

        <Grid2 container spacing={2} gap={2} padding={"10px 40px"} color={colors.grey[200]} flex='4'>
          <Grid2 size={12}>
            <Typography variant="h3" color={colors.grey[500]} fontWeight={'bold'} marginBottom={2}>Work Details</Typography>
          </Grid2>

          <Grid2 size={6}>
            <TextField
              label="Service Type"
              value={work.service || ''}
              variant="filled"
              onChange={handleInputChange}
              name="service"
              fullWidth
              disabled
            />
          </Grid2>

          <Grid2 size={6}>
            <TextField
              label="Work Type"
              value={work.workType || ''}
              variant="filled"
              onChange={handleInputChange}
              name="workType"
              fullWidth
              disabled
            />
          </Grid2>

          <Grid2 size={6}>
            <TextField
              label="Assigned Employee ID"
              value={work.assignedEmployee._id || ''}
              variant="filled"
              onChange={handleInputChange}
              name="assignedEmployee"
              fullWidth
              disabled
            />
          </Grid2>

          <Grid2 size={6}>
            <TextField
              label="Employee Name"
              value={work.assignedEmployee.name || ''}
              variant="filled"
              onChange={handleInputChange}
              name="assignedEmployee"
              fullWidth
              disabled
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Month"
              value={work.month || ''}
              variant="filled"
              onChange={handleInputChange}
              name="month"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Quarter"
              value={work.quarter || ''}
              variant="filled"
              onChange={handleInputChange}
              name="quarter"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Financial Year"
              value={work.financialYear || ''}
              variant="filled"
              onChange={handleInputChange}
              name="financialYear"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Price"
              value={work.price || ''}
              variant="filled"
              onChange={handleInputChange}
              name="price"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Quantity"
              value={work.quantity || ''}
              variant="filled"
              onChange={handleInputChange}
              name="quantity"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Discount"
              value={work.discount || ''}
              variant="filled"
              onChange={handleInputChange}
              name="discount"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Reminder"
              value={work.reminder || ''}
              variant="filled"
              onChange={handleInputChange}
              name="reminder"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Payment Status"
              value={work.paymentStatus || ''}
              variant="filled"
              onChange={handleInputChange}
              name="paymentStatus"
              fullWidth
              disabled
            />
          </Grid2>
          <Grid2 size={4}>
            <TextField
              label="Update Payment Status"
              value={work.paymentStatus || ''}
              variant="filled"
              onChange={handleInputChange}
              name="paymentStatus"
              fullWidth

            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              label="Remark"
              value={work.remark || ''}
              variant="filled"
              onChange={handleInputChange}
              name="remark"
              fullWidth
              multiline
              minRows={3}
              maxRows={3}
            />
          </Grid2>

          <Box display="flex" justifyContent="flex-end" width="100%" mt={2} gap={2}>
            <Button variant="contained" onClick={() => navigate('/')} sx={{ mr: 1, bgcolor: colors.redAccent[500] }} >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveChanges} sx={{ bgcolor: colors.teal[300] }}>
              Save Changes
            </Button>
          </Box>
        </Grid2>

      </Box>
    </Box>
  );
};

export default EditWorkPage;
