import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Grid2 } from '@mui/material';
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
        setWork(response.data.work); // Assuming response.data contains the work object
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
        flexDirection="column"
        borderRadius={'10px'}
      >
        {work && (
          <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>
            {/* Customer */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>CUSTOMER</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.customer || ''} // Default to empty string if undefined
                variant="filled"
                onChange={handleInputChange}
                name="customer" // Field name for dynamic update
                fullWidth
              />
            </Grid2>

            {/* Billing Name */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>BILLING NAME</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.billingName || ''}
                variant="filled"
                onChange={handleInputChange}
                name="billingName"
                fullWidth
              />
            </Grid2>

            {/* Email */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>EMAIL</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.email || ''}
                variant="filled"
                onChange={handleInputChange}
                name="email"
                fullWidth
              />
            </Grid2>

            {/* Mobile */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>MOBILE</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.mobile || ''}
                variant="filled"
                onChange={handleInputChange}
                name="mobile"
                fullWidth
              />
            </Grid2>

            {/* PAN */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>PAN</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.pan || ''}
                variant="filled"
                onChange={handleInputChange}
                name="pan"
                fullWidth
              />
            </Grid2>

            {/* Address */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>ADDRESS</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.address || ''}
                variant="filled"
                onChange={handleInputChange}
                name="address"
                fullWidth
              />
            </Grid2>

            {/* Service */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>SERVICE</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.service || ''}
                variant="filled"
                onChange={handleInputChange}
                name="service"
                fullWidth
              />
            </Grid2>

            {/* Work Type */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>WORK TYPE</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.workType || ''}
                variant="filled"
                onChange={handleInputChange}
                name="workType"
                fullWidth
              />
            </Grid2>

            {/* Assigned Employee */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>ASSIGNED EMPLOYEE</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.assignedEmployee || ''}
                variant="filled"
                onChange={handleInputChange}
                name="assignedEmployee"
                fullWidth
              />
            </Grid2>

            {/* Month */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>MONTH</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.month || ''}
                variant="filled"
                onChange={handleInputChange}
                name="month"
                fullWidth
              />
            </Grid2>

            {/* Quarter */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>QUARTER</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.quarter || ''}
                variant="filled"
                onChange={handleInputChange}
                name="quarter"
                fullWidth
              />
            </Grid2>

            {/* Financial Year */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>FINANCIAL YEAR</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.financialYear || ''}
                variant="filled"
                onChange={handleInputChange}
                name="financialYear"
                fullWidth
              />
            </Grid2>

            {/* Price */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>PRICE</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.price || ''}
                variant="filled"
                onChange={handleInputChange}
                name="price"
                fullWidth
              />
            </Grid2>

            {/* Quantity */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>QUANTITY</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.quantity || ''}
                variant="filled"
                onChange={handleInputChange}
                name="quantity"
                fullWidth
              />
            </Grid2>

            {/* Discount */}
            <Grid2 size={6} display={'flex'} alignItems={'center'}>
              <label>DISCOUNT</label>
            </Grid2>
            <Grid2 size={6}>
              <TextField
                value={work.discount || ''}
                variant="filled"
                onChange={handleInputChange}
                name="discount"
                fullWidth
              />
            </Grid2>

            <Box display="flex" justifyContent="flex-end" width="100%" mt={2}>
              <Button onClick={() => navigate('/')} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </Box>
          </Grid2>
        )}
      </Box>
    </Box>
  );
};

export default EditWorkPage;
