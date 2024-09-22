import React from 'react'
import Layout from '../components/Layout/Layout'
import { Box, Typography } from '@mui/material'

const Home = () => {
  return (
    <Layout >
      <Box pl={5} >
        <Typography variant="h3">Home</Typography>
        <Box overflow={'auto'} height={400}>
            <Typography variant='h5'>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iusto aut dolorem neque alias soluta similique labore facilis explicabo expedita consectetur quam quaerat corporis ex eligendi, inventore consequuntur! Voluptas, reiciendis! Laborum in, praesentium quisquam earum distinctio accusamus rerum perspiciatis tenetur pariatur. Inventore eos aut unde magnam placeat odio similique eius adipisci a veritatis. Ea veritatis soluta, cum earum quasi deserunt mollitia nisi molestias! Earum illum veniam tempore temporibus quos necessitatibus numquam tenetur voluptatum ea? Iure voluptatibus dolores assumenda quos esse repellendus debitis consectetur sint sequi est! Modi possimus, laborum molestiae libero doloremque excepturi laboriosam dolor dolorem corrupti quam quod voluptates? Asperiores.
            </Typography>
        </Box>
      </Box>
    </Layout>
  )
}

export default Home