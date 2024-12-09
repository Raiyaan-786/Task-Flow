import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
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
        setWork(response.data);
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
    setWork({ ...work, [name]: value });
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
    <Box display={'flex'} flexDirection={'column'} height={'88%'} margin={'10px'} p={.1}>
      <Header title={'Work Profile'}/>
      <Box
        bgcolor={colors.primary[900]}
        flexGrow={1}
        mt="2px"
        display="flex"
        flexDirection="column"
        borderRadius={'10px'}
      >
      <TextField
        label="Billing Name"
        name="billingName"
        value={work?.billingName || ''}
        onChange={handleInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Service"
        name="service"
        value={work?.service || ''}
        onChange={handleInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Work Type"
        name="workType"
        value={work?.workType || ''}
        onChange={handleInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      {/* Add more fields here */}

      <Box display="flex" justifyContent="flex-end">
        <Button onClick={() => navigate('/')} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default EditWorkPage;
