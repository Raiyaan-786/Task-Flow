import { useTheme } from '@emotion/react'
import React, { useContext } from 'react'
import { ColorModeContext, tokens } from '../../theme';
import { Box, IconButton, InputBase } from '@mui/material';
import { DarkModeOutlined, LightModeOutlined, MenuOutlined, NotificationsOutlined, PersonOutline, Search, SettingsOutlined} from '@mui/icons-material';

const Topbar = ({isCollapsed,setIsCollapsed}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext)
  return (
    <Box display={'flex'} justifyContent={'space-between'} p={2} bgcolor={colors.primary[900]}>
      <IconButton onClick={()=>setIsCollapsed(!isCollapsed)}><MenuOutlined /></IconButton>
      {/* search bar */}
      <Box display={'flex'} bgcolor={colors.primary[600]} borderRadius={'3px'} >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder='Search' />
        <IconButton type='button' sx={{ p: 1 }}><Search /></IconButton>
      </Box>
      {/* icon buttons */}
      <Box display={'flex'}>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode==='dark'?<DarkModeOutlined/>: <LightModeOutlined />}
         
        </IconButton>
        <IconButton>
          <NotificationsOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>
        <IconButton>
          <PersonOutline />
        </IconButton>
      </Box>

    </Box>
  )
}

export default Topbar