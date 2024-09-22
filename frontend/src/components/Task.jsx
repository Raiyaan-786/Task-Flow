import { Article, Delete, Image } from '@mui/icons-material'
import { Avatar, Box, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Typography } from '@mui/material'
import React from 'react'

const Task = ({tasks}) => {
    return (
        <Paper sx={{ margin: '20px'}} elevation={2}>
            <ListItem disablePadding>
                <ListItemButton component="a" href="/taskpage">
                    <ListItemAvatar>
                        <Avatar>
                            <Article/>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={tasks.title} secondary={tasks.date} />
                    <Delete />
                </ListItemButton>
            </ListItem>
        </Paper>
    )
}

export default Task