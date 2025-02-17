// import React from 'react'
// import Header from '../../components/Header'
// import { Box } from '@mui/material'
// import { tokens } from '../../theme';
// import { useTheme } from '@emotion/react';

// const Settings = () => {
//     const theme = useTheme();
//     const colors = tokens(theme.palette.mode);
//     return (
//         <Box display={'flex'} flexDirection={'column'} height={'88%'} margin={'10px'} p={.1}>
//             <Header title={'Settings'} />
//             <Box
//                 bgcolor={colors.primary[900]}
//                 flexGrow={1}
//                 mt="2px"
//                 display="flex"
//                 flexDirection="column"
//                 borderRadius={'10px'}
//             >
//                 ge
//             </Box>
//         </Box>
//     )
// }

import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Switch, Button } from '@mui/material';
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';
import Header from '../../components/Header';

const Settings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for toggling dark mode (example for Appearance section)
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Box display={'flex'} flexDirection={'column'} height={'88%'} margin={'10px'} p={0.1}>
      <Header title={'Settings'} />
      <Box
        bgcolor={colors.primary[900]}
        flexGrow={1}
        mt="2px"
        display="flex"
        flexDirection="column"
        borderRadius={'10px'}
        p={3}
      >
        <List>
          {/* Account Section */}
          <Typography variant="h6">Account</Typography>
          <ListItem button>
            <ListItemText primary="Change Email" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Update Password" />
          </ListItem>
          <Divider />

          {/* Notification Section */}
          <Typography variant="h6" sx={{ mt: 2 }}>Notification</Typography>
          <ListItem>
            <ListItemText primary="Enable Email Notifications" />
            <Switch defaultChecked />
          </ListItem>
          <ListItem>
            <ListItemText primary="Push Notifications" />
            <Switch />
          </ListItem>
          <Divider />

          {/* Appearance Section */}
          <Typography variant="h6" sx={{ mt: 2 }}>Appearance</Typography>
          <ListItem>
            <ListItemText primary="Dark Mode" />
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </ListItem>
          <Divider />

          {/* Privacy & Security Section */}
          <Typography variant="h6" sx={{ mt: 2 }}>Privacy & Security</Typography>
          <ListItem button>
            <ListItemText primary="Manage Privacy Settings" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Two-Factor Authentication" />
          </ListItem>
          <Divider />

          {/* Help & Support Section */}
          <Typography variant="h6" sx={{ mt: 2 }}>Help & Support</Typography>
          <ListItem button>
            <ListItemText primary="FAQs" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Contact Support" />
          </ListItem>
          <Divider />

          {/* About Section */}
          <Typography variant="h6" sx={{ mt: 2 }}>About</Typography>
          <ListItem button>
            <ListItemText primary="App Version 1.0.0" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Terms & Conditions" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Privacy Policy" />
          </ListItem>
        </List>
        <Button variant="contained" color="error" fullWidth sx={{ mt: 3 }}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};



export default Settings