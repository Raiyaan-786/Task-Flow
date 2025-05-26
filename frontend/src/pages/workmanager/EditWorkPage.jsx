import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Grid2, Typography, FormControl, Select, MenuItem } from '@mui/material';
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
        bgcolor={colors.foreground[100]}
        flexGrow={1}
        mt="2px"
        display="flex"
        flexDirection="row"
        borderRadius={'10px'}
         boxShadow={1}
      >

        <Box container display={'flex'} flexDirection={'column'} spacing={2} gap={2} padding={"25px 40px"} color={colors.grey[200]} flex='2' >
          <Grid2 size={12}>
            <Typography variant="h3"  fontWeight={600} textAlign={'center'} marginBottom={2}>Customer Details</Typography>
          </Grid2>


          {/* Customer Name */}

          <Grid2 size={6}>
            <TextField
              label="Customer Name"
              value={work.customer.customerName || ''} // Default to empty string if undefined
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
              onChange={handleInputChange}
              name="address"
              fullWidth
              multiline
              minRows={3}
              maxRows={3}
            />
          </Grid2>
        </Box>

        <Grid2 container spacing={2} gap={2} padding={"25px 40px"} color={colors.grey[200]} flex='4'>
          <Grid2 size={12}>
            <Typography variant="h3" textAlign={'center'}  fontWeight={600} marginBottom={2}>Work Details</Typography>
          </Grid2>

          <Grid2 size={6}>
            <TextField
              label="Service Type"
              value={work.service || ''}
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
              onChange={handleInputChange}
              name="month"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Quarter"
              value={work.quarter || ''}
              variant="outlined"
              onChange={handleInputChange}
              name="quarter"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Financial Year"
              value={work.financialYear || ''}
              variant="outlined"
              onChange={handleInputChange}
              name="financialYear"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Price"
              value={work.price || ''}
              variant="outlined"
              onChange={handleInputChange}
              name="price"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Quantity"
              value={work.quantity || ''}
              variant="outlined"
              onChange={handleInputChange}
              name="quantity"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Discount"
              value={work.discount || ''}
              variant="outlined"
              onChange={handleInputChange}
              name="discount"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Reminder"
              value={work.reminder || ''}
              variant="outlined"
              onChange={handleInputChange}
              name="reminder"
              fullWidth
            />
          </Grid2>

          <Grid2 size={4}>
            <TextField
              label="Payment Status"
              value={work.paymentStatus || ''}
              variant="outlined"
              onChange={handleInputChange}
              name="paymentStatus"
              fullWidth
              disabled
            />
          </Grid2>
          <Grid2 size={4}>
            <FormControl fullWidth variant='filled'>
              <Select
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                variant="outlined"
                name="paymentStatus" // Add name to track the field
                value={work.paymentStatus || ''}
                onChange={(e) => handleInputChange({ target: { name: "paymentStatus", value: e.target.value } })}
              >
                {["Pending", "Received", "Partly Received", "Invoice Generated", "Advance Payment"].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={12}>
            <TextField
              label="Remark"
              value={work.remark || ''}
             variant="outlined"
              onChange={handleInputChange}
              name="remark"
              fullWidth
              multiline
              minRows={3}
              maxRows={3}
            />
          </Grid2>

          <Box display="flex" justifyContent="flex-end" width="100%" mt={2} gap={2}>
            <Button variant="outlined" onClick={() => navigate('/')} sx={{ mr: 1,textTransform:'none',fontSize:'.8rem' }} >
              Cancel
            </Button>
            <Button className='gradient-button' variant="contained" onClick={handleSaveChanges} sx={{ bgcolor: colors.teal[300],textTransform:'none',fontSize:'.8rem' }}>
              Save Changes
            </Button>
          </Box>
        </Grid2>

      </Box>
    </Box>
  );
};

export default EditWorkPage;
