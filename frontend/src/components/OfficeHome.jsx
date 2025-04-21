import React from 'react';
import { ProSidebar as Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { FaUser, FaRegListAlt, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { tenantLogout } from '../features/tenantAuthSlice';

const OfficeHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(tenantLogout());
    navigate('/tenantlogin');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar with grey background */}
      <Sidebar backgroundColor="#6c757d" style={{ color: '#fff' }}>
        <Menu iconShape="circle">
          <MenuItem 
            icon={<FaHome />} 
            style={{ color: 'white' }} 
            onClick={() => navigate('/office')}
          >
            Dashboard
          </MenuItem>
          <MenuItem 
            icon={<FaUser />} 
            style={{ color: 'white' }} 
            onClick={() => navigate('/office/profile')}
          >
            Profile
          </MenuItem>
          <MenuItem 
            icon={<FaRegListAlt />} 
            style={{ color: 'white' }} 
            onClick={() => navigate('/office/plan')}
          >
            Plan
          </MenuItem>
          <MenuItem 
            icon={<FaCog />} 
            style={{ color: 'white' }} 
            onClick={() => navigate('/office/settings')}
          >
            Settings
          </MenuItem>
          <MenuItem 
            icon={<FaSignOutAlt />} 
            style={{ color: 'white' }} 
            onClick={handleLogout}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>

      {/* Main Content */}
      <div style={{ padding: '20px', flex: 1, background: '#f0f2f5' }}>
        <h1>Office Management System</h1>
        <p>Welcome! Please use the sidebar to navigate through your dashboard.</p>
      </div>
    </div>
  );
};

export default OfficeHome;