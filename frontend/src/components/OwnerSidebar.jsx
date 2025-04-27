import React from 'react';
import { ProSidebar as Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { FaUser, FaRegListAlt, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { MdAttachMoney } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { tenantLogout } from '../features/tenantAuthSlice';
import { ownerLogout } from '../features/ownerAuthSlice';

const OwnerSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(ownerLogout());
    navigate('/ownerlogin');
  };

  return (
    <Sidebar 
      backgroundColor="#6c757d" 
      style={{ 
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 1000, // Higher z-index for sidebar
        color: '#fff',
        width: '240px', 
      }}
    >
      <Menu iconShape="circle">
        {/* <MenuItem icon={<FaHome />} style={{ color: 'white' }} onClick={() => navigate('/owner/dashboard')}>
          Dashboard
        </MenuItem> */}
        <MenuItem icon={<FaHome />} style={{ color: 'white' }} onClick={() => navigate('/owner/client')}>
          Clients
        </MenuItem>
        <MenuItem icon={<FaUser />} style={{ color: 'white' }} onClick={() => navigate('/owner/payment')}>
          Payments
        </MenuItem>
        <MenuItem icon={<FaRegListAlt />} style={{ color: 'white' }} onClick={() => navigate('/owner/request')}>
          Requests
        </MenuItem>
        <MenuItem icon={<FaSignOutAlt />} style={{ color: 'white' }} onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default OwnerSidebar;