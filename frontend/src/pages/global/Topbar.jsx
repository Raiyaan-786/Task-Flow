import { useTheme } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { ColorModeContext, tokens } from '../../theme';
import { Box, IconButton, InputBase, Menu, MenuItem } from '@mui/material';
import { DarkModeOutlined, LightModeOutlined, MenuOutlined, NotificationsOutlined, PersonOutline, Search, SettingsOutlined } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/authSlice';

const Topbar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  //redux
  const dispatch=useDispatch();

  // State to control menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Handlers for opening and closing the menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box display={'flex'} justifyContent={'space-between'} p={2} bgcolor={colors.primary[900]}>
      {/* search bar */}
      <Box display={'flex'} gap={2} alignItems={'center'}>
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <MenuOutlined />
        </IconButton>
        <Box display={'flex'} bgcolor={colors.bgc[100]} borderRadius={'5px'} height={'30px'}>
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <Search />
          </IconButton>
        </Box>
      </Box>

      {/* icon buttons */}
      <Box display={'flex'}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? <DarkModeOutlined /> : <LightModeOutlined />}
        </IconButton>
        <IconButton>
          <NotificationsOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>
        
        {/* Person Icon Button with Menu */}
        <IconButton onClick={handleMenuOpen}>
          <PersonOutline />
        </IconButton>

        {/* Menu for Profile and Logout */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Positioning the menu
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={()=>dispatch(logout())}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
