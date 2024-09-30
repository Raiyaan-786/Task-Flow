import React from 'react'
import {DataGrid} from '@mui/x-data-grid'
import {Avatar, Box, Typography, useTheme} from "@mui/material"
import {tokens} from "../../theme"
import { mockDataUsers } from '../../data/mockData'
import Header from "../../components/Header"
import { AdminPanelSettingsOutlined, LockOpenOutlined, SecurityOutlined } from '@mui/icons-material'

const Users = () => {
  const theme = useTheme();
  const colors=tokens(theme.palette.mode);
  const columns =[
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell:(params)=>(
        <Box display={'flex'} alignItems={'center'} gap={2} p={1} height={'100%'}>
          <Avatar src={params.row.image} sx={{width:'28px', height:'28px'}}/>
          <Typography variant='h7'>{params.row.name}</Typography>
        </Box>
      )
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      flex: 1.2,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="50%"
            m="10px auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.teal[800]
                : access === "manager"
                ? colors.teal[700]
                : colors.teal[600]
            }
            borderRadius="4px"
          >
            {access === "admin" && <AdminPanelSettingsOutlined />}
            {access === "manager" && <SecurityOutlined />}
            {access === "user" && <LockOpenOutlined />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }} >
              {access}
            </Typography>
          </Box>
        );
      },
    },
  ];
  return (
    <Box p={2} m="20px" width={'87%'}>
      <Header title="USERS" subtitle="Manage Users"/>
      <Box m="40px 0 0 0" height="65vh"
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
        <DataGrid  rows={mockDataUsers} columns={columns}/>
      </Box>
    </Box>
  )
}

export default Users