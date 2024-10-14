import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React from 'react'
import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Gauge, gaugeClasses } from "@mui/x-charts";



const StatBox = ({ title,value,icon}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box display={'flex'} p={2} borderRight={'1px solid colors.grey[100]'} flexDirection={'column'}  alignItems={'center'} justifyContent={'center'}>
      
        <Typography p={.5} variant="h4" color={colors.grey[200]} textAlign={'center'} fontWeight={'bold'}>{value}</Typography>
      <Box  display={'flex'}  alignItems={'center'} justifyContent={'center'} gap={1} >
        {/* {icon} */}
        <Typography  variant="h6" color={colors.grey[300]} fontWeight={300}>{title}</Typography>
      </Box>
    </Box>
  )
}

export default StatBox