import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataInvoiceList } from '../../data/mockData'; // Importing the mock data
import CustomToolbar from '../../components/CustomToolbar';
import { PrintOutlined, Visibility } from '@mui/icons-material'; // Import the visibility icon for viewing

const InvoiceList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const handleView = (id) => {
        console.log(`Viewing details for invoice with ID: ${id}`);
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
            field: "invoice",
            headerName: "Invoice",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "partyName",
            headerName: "Party Name",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "workName",
            headerName: "Work Name",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "fy",
            headerName: "FY",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "price",
            headerName: "Price",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "qty",
            headerName: "Qty",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "discount",
            headerName: "Discount",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "tax",
            headerName: "Tax",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "taxAmt",
            headerName: "Tax Amt",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "total",
            headerName: "Total",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "mode",
            headerName: "Mode",
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
                        <PrintOutlined/>
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
                rows={mockDataInvoiceList} // Use the new mock data here
                columns={columns} 
            />
        </Box>
    );
}

export default InvoiceList;
