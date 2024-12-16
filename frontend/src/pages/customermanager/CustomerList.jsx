import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Autocomplete, Box, Button, Checkbox, FormControlLabel, Grid2, IconButton, Modal, TextField, Tooltip, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import API from '../../api/api';
import CustomToolbar from '../../components/CustomToolbar';
import { Edit, Visibility } from '@mui/icons-material';
import Header from '../../components/Header';

const CustomerList = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [firmNames, setFirmNames] = useState([]);

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
        const fetchFirmNames = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await API.get("/companyNames", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFirmNames(response.data.firmNames || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch firm names");
            }
        };

        fetchFirmNames();
    }, []);

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
            <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box sx={{ padding: 2, width: 400, margin: 'auto', bgcolor: 'white', borderRadius: 2 }}>
                    <Typography variant="h6">Customer Details</Typography>
                    {selectedCustomer && (
                        <div>
                            <p><strong>Name:</strong> {selectedCustomer.customerName}</p>
                            <p><strong>Code:</strong> {selectedCustomer.customerCode}</p>
                            <p><strong>Company/Firm Name:</strong> {selectedCustomer.companyName}</p>
                            <p><strong>Billing Name:</strong> {selectedCustomer.billingName}</p>
                            <p><strong>Email:</strong> {selectedCustomer.email}</p>
                            <p><strong>Mobile No:</strong> {selectedCustomer.mobileNo}</p>
                            <p><strong>Whatsapp No:</strong> {selectedCustomer.whatsappNo}</p>
                            <p><strong>PAN:</strong> {selectedCustomer.PAN}</p>
                            <p><strong>Aadhaar No:</strong> {selectedCustomer.AadharNo}</p>
                            <p><strong>Address:</strong> {selectedCustomer.address}</p>
                            <p><strong>Contact Person Name:</strong> {selectedCustomer.contactPersonName}</p>
                            <p><strong>Contact Person Phone:</strong> {selectedCustomer.contactPersonPhone}</p>
                            {/* <p><strong>Group Name:</strong> {selectedCustomer.groupName}</p> */}
                        </div>
                    )}
                    <Button onClick={() => setOpenViewModal(false)} variant="contained" sx={{ bgcolor: colors.teal[300] }}>Close</Button>
                </Box>
            </Modal>
            {/* Edit Customer Modal */}
            <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Box sx={{ padding: 2, width: "600px", height: '500px', overflow: 'auto', margin: 'auto', bgcolor: 'white', borderRadius: 2 ,bgcolor:colors.bgc[100]  }}>
                    <Header  title={'Edit Customer'} />
                    {editCustomerData && (
                        <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>CUSTOMER NAME</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editCustomerData.customerName}
                                    variant="filled"
                                    onChange={(e) => setEditCustomerData({ ...editCustomerData, customerName: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>CUSTOMER CODE</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editCustomerData.customerCode}
                                    variant="filled"
                                    onChange={(e) => setEditCustomerData({ ...editCustomerData, customerCode: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>AADHAAR NUMBER</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editCustomerData.AadharNo}
                                    variant="filled"
                                    onChange={(e) => setEditCustomerData({ ...editCustomerData, AadharNo: e.target.value })}
                                    type="number"
                                    sx={{
                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                            display: 'none'
                                        },
                                        '& input[type=number]': {
                                            MozAppearance: 'textfield'
                                        },
                                    }}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>BILLING NAME</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editCustomerData.billingName}
                                    variant="filled"
                                    onChange={(e) => setEditCustomerData({ ...editCustomerData, billingName: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>MOBILE</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editCustomerData.mobileNo}
                                    variant="filled"
                                    onChange={(e) => setEditCustomerData({ ...editCustomerData, mobileNo: e.target.value })}
                                    fullWidth
                                    type="number"
                                    sx={{
                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                            display: 'none'
                                        },
                                        '& input[type=number]': {
                                            MozAppearance: 'textfield'
                                        },
                                    }
                                    }
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>WHATSAPP NO.</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editCustomerData.whatsappNo}
                                    variant="filled"
                                    onChange={(e) => setEditCustomerData({
                                        ...editCustomerData,
                                        whatsappNo: editCustomerData.sameAsMobileNo ? editCustomerData.mobileNo : e.target.value
                                    })}
                                    fullWidth
                                    type="number"
                                    sx={{
                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                            display: 'none'
                                        },
                                        '& input[type=number]': {
                                            MozAppearance: 'textfield'
                                        },
                                    }}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={editCustomerData.sameAsMobileNo}
                                            onChange={(e) => setEditCustomerData({
                                                ...editCustomerData,
                                                sameAsMobileNo: e.target.checked,
                                                whatsappNo: e.target.checked ? editCustomerData.mobileNo : editCustomerData.whatsappNo
                                            })}
                                        />
                                    }
                                    label="Same as Mobile"
                                />
                            </Grid2>

                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>ADDRESS</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editCustomerData.address}
                                    multiline
                                    minRows={3}
                                    maxRows={3}
                                    variant="filled"
                                    onChange={(e) => setEditCustomerData({ ...editCustomerData, address: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>COMPANY/FIRM NAME</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <Autocomplete
                                    disablePortal
                                    options={firmNames}
                                    size="small"
                                    freeSolo // Allow typing any value (free-text entry)
                                    value={editCustomerData.companyName}
                                    onChange={(event, newValue) => setEditCustomerData({ ...editCustomerData, companyName: newValue })}
                                    renderInput={(params) => <TextField variant="filled" {...params} placeholder="ENTER COMPANY/FIRM NAME" />}
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>CONTACT PERSON NAME</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editCustomerData.contactPersonName}
                                    variant="filled"
                                    onChange={(e) => setEditCustomerData({ ...editCustomerData, contactPersonName: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>CONTACT PERSON PHONE</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editCustomerData.contactPersonPhone}
                                    variant="filled"
                                    onChange={(e) => setEditCustomerData({ ...editCustomerData, contactPersonPhone: e.target.value })}
                                    fullWidth
                                    type="number"
                                    sx={{
                                        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                            display: 'none'
                                        },
                                        '& input[type=number]': {
                                            MozAppearance: 'textfield'
                                        },
                                    }
                                    }
                                />
                            </Grid2>

                            <Button onClick={handleSaveEdit} variant="contained" sx={{bgcolor:colors.teal[300], marginTop: 2 }} >Save</Button>
                            <Button onClick={() => setOpenEditModal(false)} variant="outlined"  sx={{color:colors.grey[300], marginTop: 2 }}>Cancel</Button>
                        </Grid2>
                    )}
                </Box>
            </Modal>

        </Box>
    );
}

export default CustomerList;
