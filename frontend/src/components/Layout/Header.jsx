import { Fitbit, Mail, Notifications } from '@mui/icons-material'
import { AppBar, styled, Toolbar, Typography, Box, Badge, Avatar, Menu, MenuItem} from '@mui/material'
import React, { useState } from 'react'

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between'
})
const Icons = styled(Box)(({ theme }) => ({
 display:'none',
 alignItems:'center',
 gap:'20px',
 [theme.breakpoints.up("sm")]:{display:'flex'}
}))
const UserBox = styled(Box)(({ theme }) => ({
 display:'flex',
 alignItems:'center',
 gap:'10px',
 [theme.breakpoints.up("sm")]:{display:'none'}
}))
const Header = () => {
  const [open,setOpen]=useState(false)
  return (
    <AppBar position='sticky' sx={{bgcolor:'#16423C'}}>
      <StyledToolbar>
        <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }} >LOGO</Typography>
        <Fitbit sx={{ display: { xs: 'block', sm: 'none' } }} />
        <Icons>
          <Badge badgeContent={4} color="error">
            <Mail />
          </Badge>
          <Badge badgeContent={4} color="error">
            <Notifications />
          </Badge>
          <Avatar sx={{width:30,height:30}} onClick={()=>setOpen(true)} src='https://www.koimoi.com/wp-content/new-galleries/2022/09/when-shah-rukh-khan-revealed-stalking-his-haters-01.jpg'/>
        </Icons>
        <UserBox>
          <Typography variant="span" >SRK</Typography>
          <Avatar src='https://www.koimoi.com/wp-content/new-galleries/2022/09/when-shah-rukh-khan-revealed-stalking-his-haters-01.jpg' sx={{width:30,height:30}} onClick={()=>setOpen(true)}/>
        </UserBox>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        onClose={()=>setOpen(false)}
        open={open}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </AppBar>
  )
}

export default Header