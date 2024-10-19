import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataDuplicateCustomerList } from '../../data/mockData'; // Assuming this is where your mock data is located
import CustomToolbar from '../../components/CustomToolbar';
import { Visibility } from '@mui/icons-material'; // Import the visibility icon for viewing

const DuplicateCustomer = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const handleView = (id) => {
        console.log(`Viewing details for customer with ID: ${id}`);
        // Add your view logic here
    };

    const columns = [
        {
            field: "Sn",
            headerName: "S.No",
            flex: 0.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Uid",
            headerName: "UID",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Name",
            headerName: "Name",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Code",
            headerName: "Code",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Group name",
            headerName: "Group Name",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "mobile",
            headerName: "Mobile",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "PAN",
            headerName: "PAN",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Date",
            headerName: "Date",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Box display="flex" justifyContent="center">
                    <IconButton onClick={() => handleView(params.row.id)} color="primary">
                        <Visibility />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box display={'flex'} sx={{ height: '67vh', "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .MuiDataGrid-columnHeader": { backgroundColor: colors.primary[900], borderBottom: "none" },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.bgc[100] },
            "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[900] },
        }}>
            <DataGrid 
                disableColumnMenu 
                slots={{ toolbar: CustomToolbar }} 
                rows={mockDataDuplicateCustomerList} // Use the new mock data here
                columns={columns} 
            />
        </Box>
    );
}

export default DuplicateCustomer;
