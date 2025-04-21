import React from 'react';
import { Button, styled } from '@mui/material';
import { tokens } from '../theme';
// Assuming theme file is available

const ModernButton = styled(Button)(({ theme }) => {
  const colors = tokens(theme.palette.mode) || {};
  const getColor = (colorKey, index, fallback) => colors[colorKey]?.[index] || fallback;

  return {
    // Base styles
    minWidth: '120px',
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '12px',
    backgroundColor: getColor('blueAccent', 600, '#1976d2'), // Solid blue from MUI default
    color: '#fff',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Subtle shadow
    transition: 'all 0.3s ease', // Smooth transitions

    // Hover state
    '&:hover': {
      backgroundColor: getColor('blueAccent', 500, '#2196f3'), // Lighter blue on hover
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
      transform: 'translateY(-2px)', // Slight lift effect
    },

    // Active/pressed state
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
    },

    // Disabled state
    '&.Mui-disabled': {
      backgroundColor: getColor('grey', 300, '#e0e0e0'), // Lighter gray
      color: '#fff',
      opacity: 0.6,
      boxShadow: 'none',
    },
  };
});

export default ModernButton;