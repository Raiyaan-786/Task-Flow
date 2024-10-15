import React from 'react'
import {DataGrid} from '@mui/x-data-grid'
import {Avatar, Box, Typography, useTheme} from "@mui/material"
import {tokens} from "../../theme"
import { mockDataEmployeeDashboard,} from '../../data/mockData'
import { AdminPanelSettingsOutlined, LockOpenOutlined, SecurityOutlined } from '@mui/icons-material'
import CustomToolbar from '../../components/CustomToolbar'

const EmployeeDashboard = () => {
  const theme = useTheme();
  const colors=tokens(theme.palette.mode);
  const columns =[
    // { field: "id", headerName: "ID" ,flex:.5
    {
      field: "name",
      headerName: "Name",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell:(params)=>(
        <Box display={'flex'} alignItems={'center'} gap={2} p={1} height={'100%'}>
          <Avatar src={params.row.image} sx={{width:'28px', height:'28px'}}/>
          <Typography variant='p'>{params.row.name}</Typography>
        </Box>
      )
    },
    {
      field: "access",
      headerName: "Access Level",
      flex:1.4,
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            width="90px"
            m="10px auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "admin"
                ? colors.teal[500]
                : access === "manager"
                ? colors.teal[600]
                : colors.teal[700]
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
    {
      field: "totalWorks",
      headerName: "Total Works",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex:1
    },
    {
      field: "workDone",
      headerName: "Works Done",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex:1
    },
    {
      field: "assignedWork",
      headerName: "Assigned Work",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex:1
    },
    {
      field: "pickedUp",
      headerName: "Picked Up",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex:1
    },
    {
      field: "customerVerification",
      headerName: "Customer Verification",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex:1
    },
    {
      field: "readyForChecking",
      headerName: "Ready For Checking",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex:1
    },
    {
      field: "holdWork",
      headerName: "Hold Work",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex:1
    },
    {
      field: "evcPending",
      headerName: "EVC Pending",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex:1
    },
    {
      field: "cancel",
      headerName: "Cancel",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex:1,
      // GridColumnHeaderSeparator:false
    },
  ];
  return (
      <Box display={'flex'} 
      sx={{
         height:'67vh',
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .name-column--cell": {
          color: colors.teal[300],
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: colors.primary[900],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.bgc[100],
         
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
        <DataGrid  disableColumnMenu  slots={{toolbar:CustomToolbar}} rows={mockDataEmployeeDashboard} columns={columns}/>
      </Box>
  )
}

export default EmployeeDashboard