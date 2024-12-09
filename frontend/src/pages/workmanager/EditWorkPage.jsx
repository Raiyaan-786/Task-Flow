import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import API from '../../api/api';

const EditWorkPage = () => {
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
    <Box sx={{ width: 400, margin: 'auto', padding: 2 }}>
      <Typography variant="h5" gutterBottom>Edit Work</Typography>

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
  );
};

export default EditWorkPage;
