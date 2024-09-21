import { Box, Fab, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import React from 'react'
import Layout from '../components/Layout/Layout'
import Task from '../components/Task'
import { Add, Delete } from '@mui/icons-material'


const Tasks = () => {
    return (
        <Layout>
            <Box p={3}>
                <Typography variant='h5' p={2}>Tasks</Typography>
                <List >
                    <ListItem >
                        <Fab color="primary" aria-label="add" size='large' sx={{margin:'8px'}}>
                            <Add />
                        </Fab>
                    </ListItem>
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                </List>
            </Box>
        </Layout>
    )
}

export default Tasks