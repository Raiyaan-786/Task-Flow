import React from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import { Box, Stack } from '@mui/material'

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Stack direction="row" spacing={2} justifyContent={'space-between'}>
        <Sidebar />
        <Box flex={6} bgcolor={'pink'}>{children}</Box>
      </Stack>
    </>
  )
}

export default Layout