import { useTheme } from '@emotion/react';
import React from 'react'
import { tokens } from '../theme';
import { Box, Typography } from '@mui/material';

const Header = ({ title, subtitle }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <Box>
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "0 0 5px 0" }}
        >
          {title}
        </Typography>
        <Typography variant="h5" color={colors.teal[500]}>
          {subtitle}
        </Typography>
      </Box>
    );
}

export default Header