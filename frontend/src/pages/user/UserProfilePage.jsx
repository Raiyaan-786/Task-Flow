import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar } from '@mui/material';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import API from '../../api/api';

const UserProfilePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the current logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  // If no user is logged in, redirect to login page
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // States for user profile data
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [address, setAddress] = useState(user?.address || '');
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || '');

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('address', address);

    if (profileImage) {
      formData.append('image', profileImage);  // Append image if selected
    }

    try {
      await API.put(`/auth/update/${user._id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',  // Ensure the content type is set to multipart/form-data
        },
      });
      alert('Profile updated successfully!');
      // Optionally, update the user data in localStorage after successful update
      localStorage.setItem('user', JSON.stringify({ ...user, name, email, mobile, address, image: imagePreview }));
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    }
  };

  return (
    <Box display={'flex'} flexDirection={'column'} height={'88%'} margin={'10px'} p={.1}>
      <Header title={'User Profile'} />
      <Box
        bgcolor={colors.primary[900]}
        flexGrow={1}
        mt="2px"
        display="flex"
        flexDirection="column"
        borderRadius={'10px'}
        p={3}
      >
        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            src={imagePreview || 'https://via.placeholder.com/150'}
            alt="Profile"
            sx={{ width: 100, height: 100 }}
          />
        </Box>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="profile-image-input"
        />
        <label htmlFor="profile-image-input">
          <Button variant="outlined" component="span" fullWidth>
            Change Profile Image
          </Button>
        </label>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Update Profile
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
