import { Box, Fab, List, ListItem, ListItemButton, ListItemText, Stack, Tooltip, Typography } from '@mui/material'
import React from 'react'
import Layout from '../components/Layout/Layout'
import Task from '../components/Task'
import { Add, Delete } from '@mui/icons-material'


const Tasks = () => {
    return (
        <Layout>
            <Box p={3} >
                <Typography variant='h3' p={2}>Tasks</Typography>
                <Box  height={'60vh'} overflow={'auto'} >
                <List >
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                </List>
                </Box>
                <Tooltip title="createtask" sx={{ position: 'fixed', bottom: 20, left: { xs: "calc(50% - 25px)", md:30 } }}>
                    <Fab color="primary" aria-label="add" size='large' sx={{ margin: '20px' }}>
                        <Add />
                    </Fab>
                </Tooltip>
            </Box>
        </Layout>
    )
}

export default Tasks