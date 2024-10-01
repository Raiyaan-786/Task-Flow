import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import React from 'react'
import { TrendingDown, TrendingUp } from "@mui/icons-material";



const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box width="100%" m="0 30px" >
      <Box display="flex"  flexDirection={'column'} justifyContent={'space-between'}  height={'70px'}>
        <Typography
          variant="p"
          fontWeight="bold"
          sx={{ color: colors.grey[100] }}
        >
          {title}
        </Typography>

        <Box display="flex" justifyContent="space-between" mt="2px" alignItems={'center'}>
          <Typography fontWeight={600} variant="h4" sx={{ color: colors.grey[100] }}>
            {subtitle}
          </Typography>
          <Box display={'flex'} alignContent={'center'}>
          <Typography variant="p" sx={{ color: colors.grey[100] }} >{increase}</Typography>
            {icon==='increase'?<TrendingUp/>:<TrendingDown/>}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default StatBox