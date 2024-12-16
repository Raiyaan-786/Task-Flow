import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import API from '../../api/api';
import CustomToolbar from '../../components/CustomToolbar';
import { Edit, Visibility } from '@mui/icons-material';

const UpdateCustomer = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
        const savedModel = localStorage.getItem('columnVisibilityModel');
        return savedModel ? JSON.parse(savedModel) : {
            Sn:true,
            customerName:true,
            customerCode:true,
            billingName:true,
            companyName:true,
            email:true,
            mobileNo:true,
            whatsappNo:true,
            PAN:true,
            address:true,
            contactPerson:true,
            actions:true,
        };
      });
      const handleColumnVisibilityChange = (newModel) => {
        setColumnVisibilityModel(newModel);
        localStorage.setItem('columnVisibilityModel', JSON.stringify(newModel));
      };

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
                const formattedData = customersData.map((customer, index) => ({
                    id: customer._id,
                    Sn: index + 1,
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
        { field: "customerName", headerName: "Customer Name", flex: 1.5},
        { field: "customerCode", headerName: "Customer Code", flex: 1,},
        { field: "billingName", headerName: "Billing Name", flex: 1.5,},
        { field: "companyName", headerName: "Company/Firm Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1.5},
        { field: "mobileNo", headerName: "Mobile No", flex: 1 },
        { field: "whatsappNo", headerName: "WhatsApp No", flex: 1},
        { field: "PAN", headerName: "PAN", flex: 1 },
        { field: "address", headerName: "Address", flex: 2 },
        { field: "contactPerson", headerName: "Contact Person", flex: 1},
        {
            field: "actions",
            flex: 1.5,
            headerName: "Actions",
            headerAlign: "center",
            align: "center",
            renderCell: ({ row }) => (
                <Box display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}
                    sx={{
                        height: '100%',
                        width: '100%',
                    }}
                >   
                   <Tooltip title="Edit">
                    <IconButton aria-label="edit" onClick={() => handleEditClick(row._id)}>
                        <Edit />
                    </IconButton>
                   </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box display="flex" sx={{ height: '67vh', width: '100%', '& .MuiDataGrid-root': { border: 'none' }, '& .MuiDataGrid-cell': { borderBottom: 'none' }, '& .MuiDataGrid-columnHeader': { backgroundColor: colors.primary[900], borderBottom: 'none' }, '& .MuiDataGrid-virtualScroller': { backgroundColor: colors.bgc[100] }, '& .MuiDataGrid-footerContainer': { borderTop: 'none', backgroundColor: colors.primary[900] } }}>

            <DataGrid
                rows={customers}
                columns={columns}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={handleColumnVisibilityChange}
                pageSize={10}
                loading={loading}
                slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
                disableColumnMenu
                getRowId={(row) => row._id}
                slots={{ toolbar: CustomToolbar }}
            />

        </Box>
    );
}

export default UpdateCustomer;
