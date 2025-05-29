import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Divider,
  Tabs,
  Tab,
  styled,
  Grid2,
  Skeleton,
  Alert,
  MenuItem
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { useSelector, useDispatch } from 'react-redux';
import { login, setSelectedUser } from '../../features/authSlice';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const UserProfilePage = () => {
  const RoundedTabs = styled(Tabs)({
    padding: "10px",
    minHeight: "40px",
    "& .MuiTabs-indicator": {
      display: "none",
    },
  });

  const RoundedTab = styled(Tab)(({ theme }) => ({
    marginRight: "5px",
    textTransform: "none",
    fontWeight: 400,
    borderRadius: "10px",
    minHeight: "35px",
    padding: "0px 10px",
    color: "obsidian",
    "&.Mui-selected": {
      backgroundColor: colors.blueHighlight[900],
      color: "white",
    },
  }));

  const { user, token, selectedUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Local states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || '');
  const [confirmedImage, setConfirmedImage] = useState(user?.image || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Fetch user data only on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!user || !token) {
          navigate('/login');
          return;
        }
        console.log('Fetching user data for ID:', user._id);
        setLoading(true);
        const response = await API.get(`/auth/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.user) {
          const fetchedUser = response.data.user;
          console.log('Fetched user data:', fetchedUser);
          dispatch(setSelectedUser({
            name: fetchedUser.name || '',
            username: fetchedUser.username || '',
            email: fetchedUser.email || '',
            mobile: fetchedUser.mobile || '',
            address: fetchedUser.address || '',
            department: fetchedUser.department || '',
            postname: fetchedUser.postname || '',
            dateofjoining: fetchedUser.dateofjoining ? new Date(fetchedUser.dateofjoining).toISOString().split('T')[0] : '',
            role: fetchedUser.role || 'Employee',
            status: fetchedUser.status || 'Active',
            image: fetchedUser.image || ''
          }));
          if (!profileImage) {
            setImagePreview(fetchedUser.image || '');
            setConfirmedImage(fetchedUser.image || '');
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.response?.data?.error || 'Failed to fetch user data');
        if (err.response?.status === 401 || err.response?.status === 403) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, user?._id, token, dispatch]);

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected image:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Image preview set:', reader.result.slice(0, 50) + '...');
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Error reading the selected image. Please try again.');
        setProfileImage(null);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No file selected');
    }
  };

  // Handle profile image submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileImage) {
      alert('No profile image selected.');
      return;
    }

    try {
      const imageFormData = new FormData();
      imageFormData.append('image', profileImage);
      imageFormData.append('name', selectedUser.name);
      imageFormData.append('email', selectedUser.email);
      imageFormData.append('mobile', selectedUser.mobile);
      imageFormData.append('address', selectedUser.address);

      console.log('Uploading to /auth/update/:id:', {
        imageName: profileImage.name,
        size: profileImage.size,
        type: profileImage.type,
        additionalFields: { name: selectedUser.name, email: selectedUser.email, mobile: selectedUser.mobile, address: selectedUser.address }
      });

      const response = await API.put(`/auth/update/${user._id}`, imageFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Backend response:', response.data);

      const updatedImage = response.data.image || response.data.user?.image || imagePreview;
      setConfirmedImage(updatedImage);
      setImagePreview(updatedImage);
      dispatch(setSelectedUser({ ...selectedUser, image: updatedImage }));
      dispatch(login({ user: { ...user, image: updatedImage }, token }));
      alert('Image updated successfully!');
      setProfileImage(null);
    } catch (error) {
      console.error('Error updating image:', error);
      console.log('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert('Error updating image: ' + (error.response?.data?.message || error.message));
      setImagePreview(confirmedImage);
      setProfileImage(null);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    try {
      const loginResponse = await API.post('/auth/login', {
        email: user.email,
        password: currentPassword,
        tenantId: user?.tenantId,
      });
      if (!loginResponse.data.token) {
        setPasswordError('Current password is incorrect.');
        return;
      }

      const response = await API.put(`/auth/users/${user._id}`, {
        password: newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setPasswordSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error.response?.data?.message || 'Failed to update password. Please try again.');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setImagePreview(confirmedImage);
    setProfileImage(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  // Handle delete profile image
  const handleDeleteProfileImage = async () => {
    if (!window.confirm('Are you sure you want to delete your profile image?')) return;
    
    const previousImage = confirmedImage; // Store current image for rollback
    setImagePreview(''); // Optimistically update UI
    setConfirmedImage('');
    setProfileImage(null);
    dispatch(setSelectedUser({ ...selectedUser, image: '' }));

    try {
      const response = await API.put(`/auth/users/image/${user._id}`, { image: '' }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data.success) {
        dispatch(login({ user: { ...user, image: '' }, token }));
        alert('Profile image deleted successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to delete profile image');
      }
    } catch (error) {
      console.error('Error deleting profile image:', error);
      // Revert state on failure
      setImagePreview(previousImage);
      setConfirmedImage(previousImage);
      dispatch(setSelectedUser({ ...selectedUser, image: previousImage }));
      alert('Error deleting profile image: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  if (loading) return (
    <Box sx={{ p: 3, bgcolor: colors.foreground[100], height: "100vh", overflow: "auto"}}>
      <Box sx={{ height: 335, position: "relative" }}>
        <Skeleton variant="rectangular" width="100%" height={180} sx={{ borderRadius: 3, mr: 1, ml: 1 }} />
        <Box sx={{ height: 210, top: "110px", position: "absolute", width: "100%", zIndex: 999, display: 'flex' }}>
          <Skeleton variant="circular" width={210} height={210} sx={{ border: "4px solid white", marginLeft: 5 }} />
          <Box sx={{ pl: 2, width: "500px", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Skeleton variant="text" width={200} height={40} />
            <Skeleton variant="text" width={150} height={20} />
          </Box>
          <Box sx={{ mr: 5, width: "500px", display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rectangular" width={60} height={35} />
            <Skeleton variant="rectangular" width={60} height={35} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ ml: 5, mt: 2 }}>
        <Skeleton variant="rectangular" width={300} height={40} />
      </Box>
      <Divider variant="middle" sx={{ mb: 1, mt: 1 }} />
      <Box sx={{ ml: 8, mt: 2 }}>
        <Grid2 container spacing={2} gap={2}>
          <Grid2 size={4}><Skeleton variant="text" width={100} height={30} /></Grid2>
          <Grid2 size={6}><Skeleton variant="rectangular" width="100%" height={40} /></Grid2>
          <Grid2 size={4}><Skeleton variant="text" width={100} height={30} /></Grid2>
          <Grid2 size={4}><Skeleton variant="circular" width={60} height={60} /></Grid2>
          <Grid2 size={2}><Skeleton variant="rectangular" width={100} height={30} /></Grid2>
          <Grid2 size={4}><Skeleton variant="text" width={100} height={30} /></Grid2>
          <Grid2 size={6}><Skeleton variant="rectangular" width="100%" height={40} /></Grid2>
        </Grid2>
      </Box>
    </Box>
  );
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">User Profile</Typography>
      <Typography color="error">{error}</Typography>
    </Box>
  );
  if (!user) return null;

  return (
    <Box sx={{ height: "100vh", overflow: "auto", bgcolor: colors.foreground[100] }}>
      <Box bgcolor={colors.foreground[100]} display="flex" flexDirection="column">
        <Box bgcolor={colors.foreground[100]} sx={{ height: 335, position: "relative" }}>
          <Box sx={{ borderRadius: 2, m: 1, height: 190, backgroundImage: `url("/login_background1.jpg")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <Box
            bgcolor="transparent"
            sx={{ height: 210, top: "130px", position: "absolute", width: "100%", zIndex: 999, display: 'flex' }}
          >
            <Avatar
              src={confirmedImage}
              alt="Profile"
              sx={{ width: 200, height: 200, border: "4px solid white", marginLeft: 5 }}
            />
            <Box sx={{ pl: 2, width: "500px", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" fontWeight={700} color="initial">{selectedUser?.name}</Typography>
              <Typography variant="h6" color={colors.grey[500]}>{selectedUser?.email}</Typography>
            </Box>
            <Box sx={{ mr: 5, width: "500px", display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 2 }}>
              <Button variant="outlined" color="primary" sx={{ height: '35px', width: '60px', textTransform: 'none' }} onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" sx={{ height: '35px', width: '60px', bgcolor: colors.blueHighlight[900], textTransform: 'none' }} onClick={handleProfileSubmit}>
                Save
              </Button>
            </Box>
          </Box>
        </Box>
        <RoundedTabs value={tabValue} onChange={handleTabChange} sx={{ ml: 5 }}>
          <RoundedTab label="Basic Info" />
          <RoundedTab label="Employee Details" />
          <RoundedTab label="Contact Info" />
          <RoundedTab label="Change Password" />
        </RoundedTabs>
        <Divider variant="middle" sx={{ mb: 1, mt: 1 }} />
        <form onSubmit={handleProfileSubmit}>
          <TabPanel value={tabValue} index={0}>
            <Grid2 container spacing={2} gap={1} color={colors.grey[200]} ml={8}>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Name</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={selectedUser?.name || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Username</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={selectedUser?.username || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Profile Image</label>
              </Grid2>
              <Grid2 size={4}>
                <Avatar src={imagePreview} alt="Profile" sx={{ width: 40, height: 40 }} />
              </Grid2>
              <Grid2 size={2} sx={{ alignItems: 'center', justifyContent: "end", display: 'flex' }}>
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} id="profile-image-input" />
                <label htmlFor="profile-image-input">
                  <Button sx={{ textTransform: 'none' }} size="small" variant="outlined" component="span">Update</Button>
                </label>
                <Button
                  sx={{ textTransform: 'none', ml: 1 }}
                  size="small"
                  variant="outlined"
                  onClick={handleDeleteProfileImage}
                  disabled={!confirmedImage}
                >
                  Delete
                </Button>
              </Grid2>
            </Grid2>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Grid2 container spacing={5} gap={1} color={colors.grey[200]} ml={8}>
              <Grid2 size={2} display={"flex"} alignItems={"center"}>
                <label>Department</label>
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  value={selectedUser?.department || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                />
              </Grid2>
              <Grid2 ml={2} size={2} display={"flex"} alignItems={"center"}>
                <label>Post Name</label>
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  value={selectedUser?.postname || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                />
              </Grid2>
              <Grid2 size={2} display={"flex"} alignItems={"center"}>
                <label>Role</label>
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  value={selectedUser?.role || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                />
              </Grid2>
              <Grid2 ml={2} size={2} display={"flex"} alignItems={"center"}>
                <label>Status</label>
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  value={selectedUser?.status || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                />
              </Grid2>
              <Grid2 size={2} display={"flex"} alignItems={"center"}>
                <label>Date of Joining</label>
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  type="date"
                  value={selectedUser?.dateofjoining || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid2>
              <Grid2 ml={2} size={2} display={"flex"} alignItems={"center"}>
                <label>Address</label>
              </Grid2>
              <Grid2 size={4}>
                <TextField
                  value={selectedUser?.address || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                />
              </Grid2>
            </Grid2>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Grid2 container spacing={2} gap={2} color={colors.grey[200]} ml={8}>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Email</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={selectedUser?.email || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                />
              </Grid2>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <label>Mobile</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={selectedUser?.mobile || ''}
                  size="small"
                  fullWidth
                  margin="normal"
                  disabled
                  sx={{ backgroundColor: "#fff" }}
                />
              </Grid2>
            </Grid2>
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <Grid2 container spacing={2} gap={2} color={colors.grey[200]} ml={8}>
              <Grid2 size={4} display={"flex"} alignItems={"center"}>
                <Typography variant="h6">Change Password</Typography>
              </Grid2>
              <Grid2 size={6}>
                {passwordError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {passwordError}
                  </Alert>
                )}
                {passwordSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {passwordSuccess}
                  </Alert>
                )}
                <form onSubmit={handlePasswordSubmit}>
                  <TextField
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    size="small"
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    size="small"
                  />
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                    size="small"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2, bgcolor: colors.blueHighlight[900] }}
                  >
                    Change Password
                  </Button>
                </form>
              </Grid2>
            </Grid2>
          </TabPanel>
        </form>
      </Box>
    </Box>
  );
};

export default UserProfilePage;