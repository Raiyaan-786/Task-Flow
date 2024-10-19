import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataConsultantList } from '../../data/mockData'; // Assuming this is where your mock data is located
import CustomToolbar from '../../components/CustomToolbar';
import { CheckCircle, Delete } from '@mui/icons-material'; // Import icons for approve and delete actions

const ConsultantList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const handleApprove = (id) => {
        console.log(`Approved consultant with ID: ${id}`);
        // Add your approve logic here
    };

    const handleDelete = (id) => {
        console.log(`Deleted consultant with ID: ${id}`);
        // Add your delete logic here
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
            field: "Name",
            headerName: "Name",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Mobile",
            headerName: "Mobile",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Email",
            headerName: "Email",
            flex: 2,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Address",
            headerName: "Address",
            flex: 2,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "Account",
            headerName: "Account No",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "IFSC",
            headerName: "IFSC Code",
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
                    <IconButton onClick={() => handleApprove(params.row.id)} color="primary">
                        <CheckCircle />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(params.row.id)} color="error">
                        <Delete />
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
                rows={mockDataConsultantList} // Use the new mock data here
                columns={columns} 
            />
        </Box>
    );
}

export default ConsultantList;
