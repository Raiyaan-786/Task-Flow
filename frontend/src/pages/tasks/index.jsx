import React from 'react'
import {DataGrid} from '@mui/x-data-grid'
import {Box, Button, IconButton, Link, Typography, useTheme} from "@mui/material"
import {tokens} from "../../theme"
import { mockDataTasks} from '../../data/mockData'
import Header from "../../components/Header"
import { AdminPanelSettingsOutlined, AutorenewOutlined, BrandingWatermark, LockOpenOutlined, SecurityOutlined, Visibility } from '@mui/icons-material'

const Tasks = () => {
  const theme = useTheme();
  const colors=tokens(theme.palette.mode);
  const columns =[
    { field: "id", headerName: "Task ID" },
    {
      field: "user",
      headerName: "User",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "project",
      headerName: "Task",
      flex:1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      // icon:<BrandingWatermark/>,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row: { status } }) => (
        <Box
        display="flex"
        alignItems="center"
        gap='4px'
        color={
          status === "Approved"
          ? "orange"
          : status === "Complete"
          ? colors.greenAccent[500]
          : status === "In Progress"
          ? colors.pink[500]
          : status === "Pending"
          ? colors.teal[500]
          : status === "Rejected"
          ? colors.grey[500]
          :colors.teal[500]
        }
        >
        <AutorenewOutlined/> {status}
        <Typography  component={'span'} textAlign={'center'}>
        </Typography>
        </Box>
      ),
      },
      {
        field:"taskid",
        headerName: "View",
        flex: .5,
        renderCell:(params)=>(
          <Box>
            <Button href={`/tasks/taskpage/${params.row.taskid}`} >
            <IconButton>

            <Visibility/>
            </IconButton>
            </Button>
          </Box>
       
        )
      },
  ];
  return (
    <Box p={2} m="20px" >
      <Header title="TASKS" subtitle="Manage Tasks"/>
      <Box m="40px 0 0 0" height="65vh" width={'100%'}
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .name-column--cell": {
          color: colors.teal[500],
        },
       
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: colors.primary[900],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[700],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.primary[900],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.teal[200]} !important`,
        },
      }}
      >
        <DataGrid  rows={mockDataTasks} columns={columns}/>
      </Box>
    </Box>
  )
}

export default Tasks