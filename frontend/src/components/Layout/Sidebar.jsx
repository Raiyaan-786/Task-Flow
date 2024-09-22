import { Apps, Folder, FormatListBulleted, Home, ModeNight, People, PersonAdd, Settings, } from '@mui/icons-material'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material'
import React from 'react'

const Sidebar = () => {
  return (
    <Box p={4} flex={1}  sx={{ height:'100vh', display: { xs: 'none', sm: 'block' }}} bgcolor={'#C4DAD2'}>
    <Box position={"fixed"} sx={{height:'100%'}} bgcolor={'#C4DAD2'}>
    <List>
      <ListItem disablePadding>
        <ListItemButton component="a" href='/'>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Homepage" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton component="a" href='/tasks'>
          <ListItemIcon>
            <FormatListBulleted />
          </ListItemIcon>
          <ListItemText primary="Tasks" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton component="a" href='/employee'>
          <ListItemIcon>
            <People/>
          </ListItemIcon>
          <ListItemText primary="Employee" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton component="a" href='/customer'>
          <ListItemIcon>
            <PersonAdd />
          </ListItemIcon>
          <ListItemText primary="Customers" />
        </ListItemButton>
      </ListItem>


      <ListItem disablePadding>
        <ListItemButton component="a" href='/apps'>
          <ListItemIcon>
            <Apps />
          </ListItemIcon>
          <ListItemText primary="Apps" />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton component="a" href='/filemanager'>
          <ListItemIcon>
            <Folder/>
          </ListItemIcon>
          <ListItemText primary="File Manager" />
        </ListItemButton>
      </ListItem>
     

      <ListItem disablePadding>
        <ListItemButton component="a" href='/settings'>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </ListItem>


      <ListItem disablePadding>
        <ListItemButton component="a" href='#profile'>
          <ListItemIcon>
            <ModeNight/>
          </ListItemIcon>
         <Switch onChange={e=>setMode(mode==='light'?'dark':'light')}/>
        </ListItemButton>
      </ListItem>
    </List>
    </Box>
  </Box>
  )
}

export default Sidebar