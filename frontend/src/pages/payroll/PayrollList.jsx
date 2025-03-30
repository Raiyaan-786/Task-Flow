import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataInvoiceList, mockDataPayrollList } from '../../data/mockData'; // Importing the mock data
import CustomToolbar from '../../components/CustomToolbar';
import { CurrencyRupeeRounded, RequestQuoteRounded, Visibility, VisibilityOutlined } from '@mui/icons-material';

const PayrollList = () => {
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
            field: "employee",
            headerName: "Employee Name",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "year",
            headerName: "Year",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "month",
            headerName: "Month",
            flex: 1.5,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "salary",
            headerName: "Salary",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "netPay",
            headerName: "Net Pay",
            flex: 1,
            headerAlign: "center",
            align: "center",
        },
        {
            field: "status",
            headerName: "Payment Status",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" bgcolor={colors.teal[600]} sx={{
                    width: '100%', textAlign: 'center', height: '60%',
                    borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.grey[100]
                  }}>
                    {params.row.status}
                  </Typography>
                </Box>
              )
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            headerAlign: "center",
            align: "center",
            renderCell: ({ row }) => (
                <Box display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}
                    sx={{
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Tooltip title="View">
                        <IconButton size='small'  aria-label="view" onClick={() => handleView(row._id)}>
                            <Visibility />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Pay">
                        <IconButton size='small' sx={{color:colors.greenAccent[400]}} aria-label="pay" onClick={() => handleEditClick(row._id)}>
                            <CurrencyRupeeRounded />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Payslip">
                        <IconButton size='small' sx={{color:colors.greenAccent[400]}} aria-label="payslip" onClick={() => handleEditClick(row._id)}>
                            <RequestQuoteRounded />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box display={'flex'} sx={{
            height: '67vh', "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .MuiDataGrid-columnHeader": { backgroundColor: colors.primary[900], borderBottom: "none" },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.bgc[100] },
            "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[900] },
        }}>
            <DataGrid
                disableColumnMenu
                slots={{ toolbar: CustomToolbar }}
                rows={mockDataPayrollList} // Use the new mock data here
                columns={columns}
            />
        </Box>
    );
}

export default PayrollList;
