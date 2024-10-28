import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Autocomplete, Avatar, Box, styled, Tab, Tabs, TextField, Typography, useTheme } from "@mui/material"
import { tokens } from "../../theme"
import { mockDataEmployeeDashboard, } from '../../data/mockData'
import { AdminPanelSettingsOutlined, LockOpenOutlined, SecurityOutlined } from '@mui/icons-material'
import CustomToolbar from '../../components/CustomToolbar'

const RoundedTabs = styled(Tabs)({
    padding: '0 15px',
    minHeight: '40px',
    '& .MuiTabs-indicator': {
        display: 'none', // Remove the default indicator
    },
});

const RoundedTab = styled(Tab)(({ theme }) => ({
    marginRight: '5px',
    textTransform: 'none',
    fontWeight: 400,
    borderRadius: '10px',
    minHeight: '35px',
    padding: '0px 10px',
    color: 'obsidian',
    // color: '#999999',
    '&.Mui-selected': {
        backgroundColor: '#007499',
        color: 'white',
    },
}));


const CustomerDashboard = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        // { field: "id", headerName: "ID" ,flex:.5
        {
            field: "name",
            headerName: "Name",
            flex: 2,
            cellClassName: "name-column--cell",
            renderCell: (params) => (
                <Box display={'flex'} alignItems={'center'} gap={2} p={1} height={'100%'}>
                    <Avatar src={params.row.image} sx={{ width: '28px', height: '28px' }} />
                    <Typography variant='p'>{params.row.name}</Typography>
                </Box>
            )
        },
        {
            field: "access",
            headerName: "Access Level",
            flex: 1.4,
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
            // GridColumnHeaderSeparator:false
        },
    ];

    //placeholder options for the autocomplete
    const options = [
        { label: 'Anil Kumar', id: 1 },
        { label: 'Sneha Patel', id: 2 },
    ];
    return (
        <Box>
            <Autocomplete
                disablePortal
                options={options}
                sx={{ p: 2 }}
                size='small'

                renderInput={(params) => <TextField {...params} label="Select Customer" />}
            />
            {/* Rounded Tabs */}
            <RoundedTabs value={selectedTab} onChange={handleTabChange} >
                <RoundedTab label="By Customer" />
                <RoundedTab label="By Group" />
            </RoundedTabs>
            {/* Render All Tab Panels Once */}
            <Box p='0 1px' flexGrow={1} position="relative" display="flex" flexDirection="column" height={'100%'}>
                <Box display={selectedTab === 0 ? 'block' : 'none'} flexGrow={1} height={'100%'} bgcolor={'red'}>
                    <Box display={'flex'}
                        sx={{
                            height: '60vh',
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
                        <DataGrid disableColumnMenu rows={mockDataEmployeeDashboard} columns={columns} />
                    </Box>
                </Box>
                <Box display={selectedTab === 1 ? 'block' : 'none'} flexGrow={1} height={'100%'} >
                    <Box display={'flex'}
                        sx={{
                            height: '60vh',
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
                        <DataGrid disableColumnMenu rows={mockDataEmployeeDashboard} columns={columns} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default CustomerDashboard