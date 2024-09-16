import { AccountCircle, Mail, Notifications } from '@mui/icons-material'
import { AppBar, Avatar, Badge, IconButton, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'

const Navbar = () => {
    const [value, setValue] = useState(0)
    return (
        <div>
            <AppBar>
                <Toolbar >

                    <Typography variant="h4" >LOGO</Typography>
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit" sx={{ marginLeft: 'auto' }}>
                        <Badge badgeContent={4} color="error">
                            <Mail />
                        </Badge>
                    </IconButton>
                    <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                    >
                        <Badge badgeContent={17} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>

                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="primary-search-account-menu"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        {/* <AccountCircle /> */}
                        <Avatar alt="Travis Howard" src="https://i.pinimg.com/236x/26/e6/5a/26e65ae26c57c8660640ced6952d94e4.jpg" />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar