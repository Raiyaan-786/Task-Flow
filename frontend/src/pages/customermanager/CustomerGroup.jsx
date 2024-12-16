import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, useTheme, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomToolbar from '../../components/CustomToolbar';
import API from '../../api/api';
import { tokens } from "../../theme";
import { Add, Delete, Edit, Visibility } from '@mui/icons-material';

const CustomerGroup = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [open, setOpen] = useState(false); //for modal opening and closing
    const [groupName, setGroupName] = useState('');
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // States for UpdateCustomerGroup functionality
    const [groups, setGroups] = useState([]);
    const [groupAdmin, setGroupAdmin] = useState('');

    // experimental code starts 
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState(null); // For delete confirmation
    const [editGroupData, setEditGroupData] = useState({ groupName: '', customers: [] }); // For editing group

    const [openViewModal, setOpenViewModal] = useState(false);
    const [groupCustomers, setGroupCustomers] = useState([]); // Store customers of a group
    const [currentGroupName, setCurrentGroupName] = useState(''); // store group name of the group to view

    // experimental code ends

    // Fetch all customers
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await API.get('/getallcustomers', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setCustomers(response.data.customers);
            } catch (err) {
                setError("An error occurred while fetching customers.");
                console.error(err);
            }
        };

        fetchCustomers();
    }, []);

    // Fetch all groups
    const formatDate = (date) => {
        if (typeof date !== 'string' || !Date.parse(date)) return 'Invalid Date';
        return new Date(date).toLocaleString();
    };
    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await API.get('/allgroups', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const mappedGroups = response.data.groups.map((groups, index) => ({
                ...groups,
                sn: index + 1,
                createdAt: formatDate(groups.createdAt),
                updatedAt: formatDate(groups.updatedAt),
                id: groups._id,
                groupName: groups.groupName,
                memberCount: groups.customers ? groups.customers.length : 0, // Assuming customerIds is an array of IDs in each group

            }))
            setGroups(mappedGroups);
            // console.log(mappedGroups)
        } catch (err) {
            setError("An error occurred while fetching groups.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    // Update handleCreateGroup function
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupAdmin) {
            setError("Please select a group admin.");
            return;
        }
        if (selectedCustomers.length === 0) {
            setError("Please select at least one customer.");
            return;
        }

        try {
            await API.post('/creategroup', {
                groupName: groupName,
                customerIds: selectedCustomers,
                groupAdmin: groupAdmin, // Make sure this is the admin ID
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setGroupName('');
            setSelectedCustomers([]);
            setGroupAdmin('');
            fetchGroups(); // Refresh groups after creation
        } catch (err) {
            setError("An error occurred while creating the group.");
            console.error(err);
        }
    };


    // Handle update of an existing group name
    const handleEditGroup = (groupId) => {
        const groupToEdit = groups.find(group => group.id === groupId);
        setEditGroupData({
            groupName: groupToEdit.groupName,
            customers: groupToEdit.customers, // This will contain the customer IDs already in the group
        });
        setGroupAdmin(groupToEdit.groupAdmin); // Set the current admin
        setOpenEditModal(true); // Open the modal
    };

    const handleCustomerChange = (e, customerId) => {
        const updatedCustomers = e.target.checked
            ? [...editGroupData.customers, customerId]  // Add customer if checked
            : editGroupData.customers.filter(id => id !== customerId); // Remove customer if unchecked

        setEditGroupData({
            ...editGroupData,
            customers: updatedCustomers,  // Update the customers list in the state
        });
    };


    // Handle updating the group with the selected admin and other details
    const handleUpdateGroup = async (e, groupId) => {
        e.preventDefault();

        if (!groupAdmin) {
            setError("Please select a group admin.");
            return;
        }

        try {
            // Send the updated group data to the backend
            await API.put(`/updategroup/${groupId}`, {
                groupName: editGroupData.groupName,
                customerIds: editGroupData.customers,  // Send the updated list of customer IDs
                groupAdmin: groupAdmin,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // Refresh the groups after the update
            fetchGroups();
            setOpenEditModal(false);  // Close the modal
        } catch (err) {
            setError("An error occurred while updating the group.");
            console.error(err);
        }
    };



    // Handle group deletion
    const handleDeleteGroup = async (groupId) => {
        try {
            await API.delete(`/deletegroup/${groupId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchGroups(); // Refresh groups after deletion
            //    setMessage("Group deleted successfully!");
        } catch (err) {
            setError("An error occurred while deleting the group.");
            console.error(err);
        } finally {
            setOpenDeleteModal(false); // Close the modal after deletion
        }
    };
    // handle group view
    const handleViewCustomers = async (groupId) => {
        try {
            const response = await API.get('/allgroups', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // Find the specific group by its ID
            const group = response.data.groups.find(group => group._id === groupId);

            if (group) {
                setCurrentGroupName(group.groupName)
                setGroupCustomers(group.customers); // Assuming the group object has a 'customers' field
                setOpenViewModal(true); // Open the modal to show customers
            } else {
                setError("Group not found.");
            }
        } catch (err) {
            setError("An error occurred while fetching group customers.");
            console.error(err);
        }
    };


    // Columns for DataGrid, including "Number of Members"
    const columns = [

        // createdAt

        { field: "sn", headerName: "S.No", flex: 0.5, headerAlign: "center", align: "center" },
        { field: 'groupName', headerName: 'Group Name', flex: 1, headerAlign: "center", align: "center" },
        { field: 'createdAt', headerName: 'Created At', flex: 1, headerAlign: "center", align: "center" },
        { field: 'memberCount', headerName: 'Number of Members', flex: .8, headerAlign: "center", align: "center" },
        { field: 'updatedAt', headerName: 'Updated At', flex: 1, headerAlign: "center", align: "center" },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Box display={'flex'} justifyContent={'space-evenly'} alignItems={'center'}
                    sx={{
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <IconButton aria-label="view-customers" onClick={() => handleViewCustomers(params.row.id)}>
                        <Visibility />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={() => handleEditGroup(params.row.id)}>
                        <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => { setGroupToDelete(params.row.id); setOpenDeleteModal(true); }}>
                        <Delete />
                    </IconButton>
                </Box>
            ),
            flex: .8
        }
    ];

    return (
        <Box sx={{
            height: '66vh',
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
            <Button
                startIcon={<Add />}
                sx={{ bgcolor: '#007499', color: 'white', m: 1.5 }}
                onClick={() => setOpen(true)}
            >
                CREATE GROUP
            </Button>
            <Modal
                open={openViewModal}
                onClose={() => setOpenViewModal(false)}
                aria-labelledby="view-customers-modal"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40vw',
                        bgcolor: 'white',
                        borderRadius: '15px',
                        padding: '20px',
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6">List of Customers in {currentGroupName}</Typography>
                    <Box
                        sx={{
                            height: '200px',
                            overflowY: 'auto',
                            border: '1px solid #ccc',
                            padding: '10px',
                            borderRadius: '5px',
                            width: '100%',
                        }}
                    >
                        {groupCustomers.length === 0 ? (
                            <Typography>No customers in this group.</Typography>
                        ) : (
                            groupCustomers.map((customer) => (
                                <Box key={customer._id} display="flex" alignItems="center" gap="10px" sx={{ mb: 1 }}>
                                    <Typography>{customer.customerName}</Typography>
                                </Box>
                            ))
                        )}
                    </Box>
                    <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                        <Button onClick={() => setOpenViewModal(false)} variant="outlined">Close</Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                aria-labelledby="edit-group-modal"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40vw',
                        bgcolor: 'white',
                        borderRadius: '15px',
                        padding: '20px',
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6">Edit Group</Typography>
                    <form
                        onSubmit={(e) => handleUpdateGroup(e, editGroupData.id)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}
                    >
                        <TextField
                            fullWidth
                            label="Group Name"
                            value={editGroupData.groupName}
                            onChange={(e) => setEditGroupData({ ...editGroupData, groupName: e.target.value })}
                            required
                        />
                        <Typography variant="body1" sx={{ mt: 1 }}>Select Customers:</Typography>
                        <Box
                            sx={{
                                height: '200px',
                                overflowY: 'auto',
                                border: '1px solid #ccc',
                                padding: '10px',
                                borderRadius: '5px',
                            }}
                        >
                            {customers.map(customer => (
                                <div key={customer._id}>
                                    <input
                                        type="checkbox"
                                        id={`customer-${customer._id}`}
                                        checked={editGroupData.customers.includes(customer._id)}  // Check if customer is in the list
                                        onChange={(e) => handleCustomerChange(e, customer._id)}  // Handle checkbox change
                                    />
                                    <label htmlFor={`customer-${customer._id}`}>{customer.customerName}</label>
                                </div>
                            ))}


                        </Box>

                        <Typography variant="body1" sx={{ mt: 2 }}>Select Group Admin:</Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={groupAdmin}
                            onChange={(e) => setGroupAdmin(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            required
                        >
                            <option value="" disabled>
                                -- Select Admin --
                            </option>
                            {customers.map((customer) => (
                                <option key={customer._id} value={customer._id}>
                                    {customer.customerName}
                                </option>
                            ))}
                        </TextField>
                        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                            <Button onClick={() => setOpenEditModal(false)} variant="outlined">Cancel</Button>
                            <Button type="submit" variant="contained" sx={{ bgcolor: '#007499', color: 'white' }}>
                                Save Changes
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>


            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                aria-labelledby="delete-group-modal"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '300px',
                        height: '200px',
                        bgcolor: 'white',
                        borderRadius: '15px',
                        padding: '20px',
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h5" fontWeight={400} textAlign={'center'}>Are you sure you want to delete this group?</Typography>
                    <Box display="flex" justifyContent="space-between" sx={{ width: '70%', mt: 2 }} >
                        <Button onClick={() => setOpenDeleteModal(false)} variant="outlined">Cancel</Button>
                        <Button onClick={() => handleDeleteGroup(groupToDelete)} variant="contained" sx={{ bgcolor: '#d32f2f', color: 'white' }}>
                            Delete
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                disableAutoFocus
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40vw',
                        bgcolor: 'white',
                        borderRadius: '15px',
                        padding: '20px',
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        Create Customer Group
                    </Typography>
                    <form
                        onSubmit={handleCreateGroup}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                            width: '100%',
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            label="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Select Customers:
                        </Typography>
                        <Box
                            sx={{
                                height: '200px',
                                overflowY: 'auto',
                                border: '1px solid #ccc',
                                padding: '10px',
                                borderRadius: '5px',
                            }}
                        >
                            {customers.map((customer) => (
                                <Box key={customer._id} display="flex" alignItems="center" gap="10px" sx={{ mb: 1 }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCustomers.includes(customer._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedCustomers((prev) => [...prev, customer._id]);
                                            } else {
                                                setSelectedCustomers((prev) => prev.filter((id) => id !== customer._id));
                                            }
                                        }}
                                    />
                                    <Typography>{customer.customerName}</Typography>
                                </Box>
                            ))}
                        </Box>

                        <Typography variant="body1" sx={{ mt: 2 }}>
                            Select Group Admin:
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            size="small"
                            value={groupAdmin}
                            onChange={(e) => setGroupAdmin(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            required
                        >
                            <option value="" disabled>
                                -- Select Admin --
                            </option>
                            {customers.map((customer) => (
                                <option key={customer._id} value={customer._id}>
                                    {customer.customerName}
                                </option>
                            ))}
                        </TextField>
                        <Box display="flex" justifyContent="space-between" sx={{ mt: 2 }}>
                            <Button
                                onClick={() => setOpen(false)}
                                variant="outlined"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ bgcolor: '#007499', color: 'white' }}
                            >
                                Create
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>


            <DataGrid
                loading={loading}
                slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
                disableColumnMenu
                slots={{ toolbar: CustomToolbar }}
                rows={groups}
                columns={columns}
                pageSize={10}
            />
        </Box>
    );
};

export default CustomerGroup;
