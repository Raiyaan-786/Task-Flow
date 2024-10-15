import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Avatar, Box, Typography, useTheme } from "@mui/material"
import { tokens } from "../../theme"
import { mockDataWorkDashboard, } from '../../data/mockData'
import { AdminPanelSettingsOutlined, LockOpenOutlined, SecurityOutlined } from '@mui/icons-material'
import CustomToolbar from '../../components/CustomToolbar'

const WorkDashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        {
            field: "workName",
            headerName: "Work Name",
            flex: 1.5,
            renderCell: (params) => (
                <Box  sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h6" bgcolor={colors.teal[700]} sx={{ width: '100%', textAlign: 'center', height: '80%',
                        borderRadius:1,display:'flex',alignItems:'center',justifyContent:'center',color:colors.grey[100]
                     }}>{params.row.workName}</Typography>
                </Box>
            )
        },
        {
            field: "totalWorks",
            headerName: "Total Works",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "workDone",
            headerName: "Works Done",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "assignedWork",
            headerName: "Assigned Work",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "pickedUp",
            headerName: "Picked Up",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "customerVerification",
            headerName: "Customer Verification",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "readyForChecking",
            headerName: "Ready For Checking",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "holdWork",
            headerName: "Hold Work",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "evcPending",
            headerName: "EVC Pending",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1
        },
        {
            field: "cancel",
            headerName: "Cancel",
            type: "number",
            headerAlign: "center",
            align: "center",
            flex: 1,
        },
    ];
    return (
        <Box display={'flex'}
            sx={{
                height: '67vh',
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
            <DataGrid disableColumnMenu slots={{ toolbar: CustomToolbar }} rows={mockDataWorkDashboard} columns={columns} />
        </Box>
    )
}

export default WorkDashboard