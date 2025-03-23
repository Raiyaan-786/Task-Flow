import React from 'react';
import { Box } from '@mui/material';
import Lottie from 'lottie-react';
import animationData from '../assets/loading-spinner.json';

const Preloader = () => {
  return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="white">
      <Lottie animationData={animationData} style={{ width: 150, height: 150 }} />
    </Box>
  );
};

export default Preloader;
