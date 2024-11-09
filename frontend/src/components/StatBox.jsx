import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React from 'react'

const StatBox = ({ title, value, textcolor, handleStatBoxClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box sx={{
      cursor: 'pointer',
      display: 'flex',
      p: 1,
      borderRight: '1px solid colors.grey[100]',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    }} >
      <Typography variant="h4" color={textcolor} textAlign={'center'} fontWeight={'bold'}>{value}</Typography>
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={0} >
        <Typography textTransform={'uppercase'} variant="p" color={colors.grey[500]} fontWeight={400}>{title}</Typography>
      </Box>
    </Box>
  )
}

export default StatBox