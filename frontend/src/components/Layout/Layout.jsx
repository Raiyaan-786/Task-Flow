import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box, Stack, Typography } from '@mui/material'
import BreadCrumbs from '../BreadCrumbs'

const Layout = ({ children }) => {
  return (
    <Box >
      <Header />
      <Stack direction="row" spacing={2} justifyContent={'space-between'}>
        <Sidebar />
        <Box flex={6} >
          <BreadCrumbs/>
          {children}
        </Box>
      </Stack>
    </Box>
  )
}

export default Layout