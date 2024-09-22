import { Box, Fab, List, ListItem, ListItemButton, ListItemText, Stack, Tooltip, Typography } from '@mui/material'
import React from 'react'
import Layout from '../components/Layout/Layout'
import Task from '../components/Task'
import { Add} from '@mui/icons-material'

const taskData={
    "tasks": [
      {
        "title": "Complete Project Report",
        "description": "Finalize and submit the quarterly project report",
        "assignedTo": "John Doe",
        "createdBy": "Jane Smith",
        "date": "20-03-2024"
      },
      {
        "title": "Team Meeting",
        "description": "Discuss ongoing projects and set new goals",
        "assignedTo": "Entire Team",
        "createdBy": "John Doe",
        "date": "22-03-2024"
      },
      {
        "title": "Fix Bug in App",
        "description": "Resolve issue with login feature",
        "assignedTo": "Emily Chen",
        "createdBy": "David Lee",
        "date": "19-03-2024"
      },
      {
        "title": "Marketing Campaign",
        "description": "Develop social media strategy for new product launch",
        "assignedTo": "Marketing Team",
        "createdBy": "Sarah Taylor",
        "date": "25-03-2024"
      },
      {
        "title": "Training Session",
        "description": "Conduct training on new software features",
        "assignedTo": "Training Team",
        "createdBy": "Michael Brown",
        "date": "01-04-2024"
      }
    ]
  }
  
  

const Tasks = () => {
    return (
        <Layout>
            <Box pl={4} pr={3}>
                <Typography variant='h3' p={1}>Tasks</Typography>
                <Box  height={'55vh'} overflow={'auto'} >
                <List >
                    {taskData.tasks.map((tasks)=>(<Task tasks={tasks}/>))}   
                </List>
                </Box>
                <Tooltip title="create task" sx={{ position: 'fixed', bottom: 20, left: { xs: "calc(50% - 25px)", md:30 } }}>
                    <Fab  aria-label="add" size='large' sx={{ margin: '20px' }}>
                        <Add color='success'/>
                    </Fab>
                </Tooltip>
            </Box>
        </Layout>
    )
}

export default Tasks