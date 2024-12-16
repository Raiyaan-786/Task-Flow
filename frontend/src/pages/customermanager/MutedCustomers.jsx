import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, IconButton, Modal, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import API from '../../api/api';
import CustomToolbar from '../../components/CustomToolbar';
import { Edit, Visibility } from '@mui/icons-material';

const MutedCustomers = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedCustomer, setSelectedCustomer] = useState(null); // For view/edit customer details
    const [editCustomerData, setEditCustomerData] = useState(null); // For filling data in edit modal
    const [openViewModal, setOpenViewModal] = useState(false); // To open the view modal
    const [openEditModal, setOpenEditModal] = useState(false); // To open the edit modal

    const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
        const savedModel = localStorage.getItem('columnVisibilityModel');
        return savedModel ? JSON.parse(savedModel) : {
            Sn: true,
            customerName: true,
            customerCode: true,
            billingName: true,
            companyName: true,
            email: true,
            mobileNo: true,
            whatsappNo: true,
            PAN: true,
            address: true,
            contactPerson: true,
            actions: true,
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

    const handleView = (customerId) => {
        const customer = customers.find(c => c._id === customerId);
        setSelectedCustomer(customer);
        setOpenViewModal(true); // Open view modal
    };

    const handleEditClick = (customerId) => {
        const customer = customers.find(c => c._id === customerId);
        setEditCustomerData(customer);
        setOpenEditModal(true); // Open edit modal
    };
    const handleSaveEdit = async () => {
        try {
            await API.put(`/customer/${editCustomerData._id}`, editCustomerData);
            // Refresh customer list after successful edit
            setCustomers(customers.map(c => (c._id === editCustomerData._id ? editCustomerData : c)));
            setOpenEditModal(false); // Close edit modal
        } catch (err) {
            setError('Failed to save customer details');
        }
    };

    const columns = [
        { field: "Sn", headerName: "S.No", flex: 0.5, headerAlign: "center", align: "center" },
        { field: "customerName", headerName: "Customer Name", flex: 1.5 },
        { field: "customerCode", headerName: "Customer Code", flex: 1, },
        { field: "billingName", headerName: "Billing Name", flex: 1.5, },
        { field: "companyName", headerName: "Company/Firm Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1.5 },
        { field: "mobileNo", headerName: "Mobile No", flex: 1 },
        { field: "whatsappNo", headerName: "WhatsApp No", flex: 1 },
        { field: "PAN", headerName: "PAN", flex: 1 },
        { field: "address", headerName: "Address", flex: 2 },
        { field: "contactPerson", headerName: "Contact Person", flex: 1 },
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
                    <Tooltip title="View">
                        <IconButton aria-label="view" onClick={() => handleView(row._id)}>
                            <Visibility />
                        </IconButton>
                    </Tooltip>
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
            {/* View Customer Modal */}
            <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
                <Box sx={{ padding: 2, width: 400, margin: 'auto', bgcolor: 'white', borderRadius: 2 }}>
                    <Typography variant="h6">Customer Details</Typography>
                    {selectedCustomer && (
                        <div>
                            <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
                            <p><strong>Email:</strong> {selectedCustomer.email}</p>
                            <p><strong>Mobile No:</strong> {selectedCustomer.mobileNo}</p>
                            <p><strong>Company:</strong> {selectedCustomer.companyName}</p>
                            <p><strong>Address:</strong> {selectedCustomer.address}</p>
                        </div>
                    )}
                    <Button onClick={() => setOpenViewModal(false)} variant="contained">Close</Button>
                </Box>
            </Modal>
            {/* Edit Customer Modal */}
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <Box sx={{ padding: 2, width: 400, margin: 'auto', bgcolor: 'white', borderRadius: 2 }}>
                    <Typography variant="h6">Edit Customer</Typography>
                    {editCustomerData && (
                        <div>
                            <TextField
                                label="Customer Name"
                                value={editCustomerData.customerName}
                                onChange={(e) => setEditCustomerData({ ...editCustomerData, customerName: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                value={editCustomerData.email}
                                onChange={(e) => setEditCustomerData({ ...editCustomerData, email: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Mobile No"
                                value={editCustomerData.mobileNo}
                                onChange={(e) => setEditCustomerData({ ...editCustomerData, mobileNo: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Company Name"
                                value={editCustomerData.companyName}
                                onChange={(e) => setEditCustomerData({ ...editCustomerData, companyName: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Address"
                                value={editCustomerData.address}
                                onChange={(e) => setEditCustomerData({ ...editCustomerData, address: e.target.value })}
                                fullWidth
                            />
                            <Button onClick={handleSaveEdit} variant="contained" sx={{ marginTop: 2 }}>Save</Button>
                            <Button onClick={() => setOpenEditModal(false)} variant="outlined" sx={{ marginTop: 2 }}>Cancel</Button>
                        </div>
                    )}
                </Box>
            </Modal>

        </Box>
    );
}

export default MutedCustomers;
