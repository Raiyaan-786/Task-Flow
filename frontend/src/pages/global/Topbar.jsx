import { useTheme } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { ColorModeContext, tokens } from '../../theme';
import { Box, IconButton, InputBase, Menu, MenuItem, Typography } from '@mui/material';
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutline,
  Search,
  SettingsOutlined,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // React Router navigation hook

  // State to control profile menu
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const isProfileMenuOpen = Boolean(anchorElProfile);

  // State to control notification menu
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const isNotificationMenuOpen = Boolean(anchorElNotification);

  // Handlers for profile menu
  const handleProfileMenuOpen = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorElProfile(null);
  };

  const handleProfileClick = () => {
    navigate('/userprofile'); // Navigate to the profile page
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Optional: Navigate to the login page after logout
  };

  // Handlers for notification menu
  const handleNotificationMenuOpen = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setAnchorElNotification(null);
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2} bgcolor={colors.primary[900]}>
      {/* Search bar */}
      <Box display="flex" gap={2} alignItems="center">
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <MenuOutlined />
        </IconButton>
        <Box display="flex" bgcolor={colors.bgc[100]} borderRadius="5px" height="30px">
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <Search />
          </IconButton>
        </Box>
      </Box>

      {/* Icon buttons */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? <DarkModeOutlined /> : <LightModeOutlined />}
        </IconButton>

        {/* Notifications Icon with Dropdown */}
        <IconButton onClick={handleNotificationMenuOpen}>
          <NotificationsOutlined />
        </IconButton>
        <Menu
          anchorEl={anchorElNotification}
          open={isNotificationMenuOpen}
          onClose={handleNotificationMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleNotificationMenuClose}>
            <Typography variant="body2">New comment on your post</Typography>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Typography variant="body2">Your profile was viewed</Typography>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Typography variant="body2">Update available for your app</Typography>
          </MenuItem>
        </Menu>

        {/* Settings Icon */}
        <IconButton onClick={() => navigate('/settings')}>
          <SettingsOutlined />
        </IconButton>

        {/* Profile Icon with Menu */}
        <IconButton onClick={handleProfileMenuOpen}>
          <PersonOutline />
        </IconButton>
        <Menu
          anchorEl={anchorElProfile}
          open={isProfileMenuOpen}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
