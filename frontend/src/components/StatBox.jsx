import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React from 'react'
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Gauge, gaugeClasses } from "@mui/x-charts";



const StatBox = ({ title,value,icon,textcolor}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box display={'flex'} p={1} borderRight={'1px solid colors.grey[100]'} flexDirection={'column'}  alignItems={'center'} justifyContent={'center'}>
      
        <Typography variant="h4" color={textcolor} textAlign={'center'} fontWeight={'bold'}>{value}</Typography>
      <Box  display={'flex'}  alignItems={'center'} justifyContent={'center'} gap={0} >
        {/* {icon} */}
        <Typography textTransform={'uppercase'} variant="p" color={colors.grey[500]} fontWeight={400}>{title}</Typography>
      </Box>
    </Box>
  )
}

export default StatBox