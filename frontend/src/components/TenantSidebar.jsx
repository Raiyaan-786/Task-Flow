import React from 'react';
import { ProSidebar as Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { FaUser, FaRegListAlt, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { MdAttachMoney } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { tenantLogout } from '../features/tenantAuthSlice';

const TenantSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(tenantLogout());
    navigate('/tenantlogin');
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
        <MenuItem icon={<FaHome />} style={{ color: 'white' }} onClick={() => navigate('/tenant')}>
          Dashboard
        </MenuItem>
        <MenuItem icon={<FaUser />} style={{ color: 'white' }} onClick={() => navigate('/tenant/profile')}>
          Profile
        </MenuItem>
        <MenuItem icon={<FaRegListAlt />} style={{ color: 'white' }} onClick={() => navigate('/tenant/plan')}>
          Plan
        </MenuItem>
        <MenuItem icon={<MdAttachMoney />} style={{ color: 'white' }} onClick={() => navigate('/tenant/transactions')}>
          Transactions
        </MenuItem>
        <MenuItem icon={<FaCog />} style={{ color: 'white' }} onClick={() => navigate('/tenant/settings')}>
          Settings
        </MenuItem>
        <MenuItem icon={<FaSignOutAlt />} style={{ color: 'white' }} onClick={handleLogout}>
          Logout
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default TenantSidebar;