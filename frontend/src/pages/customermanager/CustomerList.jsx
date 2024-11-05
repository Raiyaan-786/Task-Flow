import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import API from '../../api/api';
import CustomToolbar from '../../components/CustomToolbar';
import { Visibility } from '@mui/icons-material';

const CustomerList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No authentication token found. Please log in.');
                setLoading(false);
                return;
            }

            try {
                const response = await API.get('/getallcustomers', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const customersData = response.data.customers || [];
                // Map the customers to include a serial number
                const formattedData = customersData.map((customer, index) => ({
                    id: customer._id,
                    Sn: index + 1,  // Assign S.No based on index
                    ...customer,
                }));

                setCustomers(formattedData);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch customers');
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    const handleView = (id) => {
        console.log(`Viewing details for customer with ID: ${id}`);
        // Add additional view logic as needed
    };

    const columns = [
        { field: "Sn", headerName: "S.No", flex: 0.5, headerAlign: "center", align: "center" },
        { field: "customerName", headerName: "Customer Name", flex: 1.5, headerAlign: "center", align: "center" },
        { field: "customerCode", headerName: "Customer Code", flex: 1, headerAlign: "center", align: "center" },
        { field: "billingName", headerName: "Billing Name", flex: 1.5, headerAlign: "center", align: "center" },
        { field: "companyName", headerName: "Company/Firm Name", flex: 1, headerAlign: "center", align: "center" },
        { field: "email", headerName: "Email", flex: 1.5, headerAlign: "center", align: "center" },
        { field: "mobileNo", headerName: "Mobile No", flex: 1, headerAlign: "center", align: "center" },
        { field: "whatsappNo", headerName: "WhatsApp No", flex: 1, headerAlign: "center", align: "center" },
        { field: "PAN", headerName: "PAN", flex: 1, headerAlign: "center", align: "center" },
        { field: "address", headerName: "Address", flex: 2, headerAlign: "center", align: "center" },
        { field: "contactPerson", headerName: "Contact Person", flex: 1, headerAlign: "center", align: "center" },
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
        <Box sx={{
            height: '70vh',
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.primary[900],
                borderBottom: "none"
            },
            "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.bgc[100],
            },
            "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.primary[900],
            },
        }}>
            {loading ? (
                <p>Loading customers...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                <DataGrid
                    disableColumnMenu
                    slots={{ toolbar: CustomToolbar }}
                    rows={customers}
                    columns={columns}
                    pageSize={10}
                />
            )}
        </Box>
    );
}

export default CustomerList;
