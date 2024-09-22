import { Breadcrumbs, Link, Typography } from '@mui/material'
import React from 'react'

const BreadCrumbs = () => {
  return (
<Breadcrumbs aria-label="breadcrumb" sx={{margin:'10px 40px'}}>
  <Link underline="hover" color="inherit" href="/">
    Home
  </Link>
  <Link
    underline="hover"
    color="inherit"
    href="/tasks"
  >
    Tasks
  </Link>
  <Typography sx={{ color: 'text.primary' }}>Task Page</Typography>
</Breadcrumbs>
  )
}

export default BreadCrumbs