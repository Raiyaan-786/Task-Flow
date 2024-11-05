import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import API from '../../api/api';

const CustomerGroup = () => {
    // States for CreateCustomerGroup functionality
    const [groupName, setGroupName] = useState('');
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // States for UpdateCustomerGroup functionality
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editGroupId, setEditGroupId] = useState(null);
    const [newGroupName, setNewGroupName] = useState('');

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
    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await API.get('/allgroups', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setGroups(response.data.groups);
            console.log(groups)
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

    // Handle creation of a new customer group
    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await API.post('/creategroup', {
                groupName: groupName,
                customerIds: selectedCustomers,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setMessage("Group created successfully!");
            setGroupName('');
            setSelectedCustomers([]);
            fetchGroups(); // Refresh groups after creation
        } catch (err) {
            setError("An error occurred while creating the group.");
            console.error(err);
        }
    };

    // Handle update of an existing group name
    const handleUpdateGroupName = async (groupId) => {
        if (!newGroupName) {
            alert("Please enter a new group name.");
            return;
        }

        try {
            await API.put(`/updategroup/${groupId}`, { groupName: newGroupName }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchGroups(); // Refresh the list after update
            setNewGroupName('');
            setEditGroupId(null);
            setMessage("Group name updated successfully!");
        } catch (err) {
            setError("An error occurred while updating the group name.");
            console.error(err);
        }
    };

    // Handle group deletion
    const handleDeleteGroup = async (groupId) => {
        if (window.confirm("Are you sure you want to delete this group?")) {
            try {
                await API.delete(`/deletegroup/${groupId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                fetchGroups(); // Refresh the list after deletion
                setMessage("Group deleted successfully!");
            } catch (err) {
                setError("An error occurred while deleting the group.");
                console.error(err);
            }
        }
    };

    // Columns for DataGrid, including "Number of Members"
    const columns = [
        { field: 'groupName', headerName: 'Group Name', flex: 1 },
        { field: 'memberCount', headerName: 'Number of Members', flex: 0.5 },
        {
            field: 'edit',
            headerName: 'Edit',
            renderCell: (params) => (
                <Button 
                    variant='contained' 
                    sx={{ bgcolor: '#007499' }}  
                    onClick={() => { setEditGroupId(params.row.id); setNewGroupName(params.row.groupName); }}
                >
                    Edit
                </Button>
            ),
            flex: 0.5
        },
        {
            field: 'delete',
            headerName: 'Delete',
            renderCell: (params) => (
                <Button 
                    variant='contained' 
                    color="error" 
                    onClick={() => handleDeleteGroup(params.row.id)}
                >
                    Delete
                </Button>
            ),
            flex: 0.5
        }
    ];

    // Rows for DataGrid, calculating the number of members per group
    const rows = groups.map(group => ({
        id: group._id,
        groupName: group.groupName,
        memberCount: group.customers ? group.customers.length : 0, // Assuming customerIds is an array of IDs in each group
    }));

    return (
        <Grid container spacing={2} p={2}>
            {/* Left side: Create Customer Group */}
            <Grid item xs={12} md={5} height={'65vh'} overflow={'auto'}>
                <Typography variant="h5" gutterBottom>
                    Create a New Customer Group
                </Typography>
                <form onSubmit={handleCreateGroup}>
                    <TextField
                        size='small'
                        label="Group Name"
                        fullWidth
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                    <Box mt={2}>
                        <Typography>Select Customers:</Typography>
                        <ul>
                            {customers.map((customer) => (
                                <li key={customer._id}>
                                    <span>{customer.customerName}</span>
                                    <Button sx={{ ml:1, mb:1 }} variant='outlined' onClick={() => setSelectedCustomers(prev => [...prev, customer._id])}>
                                        Add
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </Box>
                    <Box mt={2}>
                        <Typography>Selected Customers:</Typography>
                        <ul>
                            {selectedCustomers.map((customerId) => {
                                const customer = customers.find(c => c._id === customerId);
                                return (
                                    <li key={customerId}>
                                        {customer ? customer.customerName : 'Unknown Customer'}
                                        <Button sx={{ ml:1, mb:2 }} variant='contained' color="error" onClick={() => setSelectedCustomers(prev => prev.filter(id => id !== customerId))}>
                                            Remove
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    </Box>
                    <Box mt={2}>
                        <Button type="submit" variant="contained">
                            Create Group
                        </Button>
                    </Box>
                    {message && <Typography color="primary">{message}</Typography>}
                </form>
            </Grid>

            {/* Right side: Update Customer Groups */}
            <Grid item xs={12} md={7} height={'65vh'} overflow={'auto'}>
                <Typography variant="h5" gutterBottom>
                    Update Customer Groups
                </Typography>
                <Box mt={2} height={400}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                    />
                </Box>

                {/* Edit Group Name Input */}
                {editGroupId && (
                    <Box mt={2}>
                        <TextField
                            size='small'
                            label="New Group Name"
                            fullWidth
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <Box mt={1}>
                            <Button variant="contained" onClick={() => handleUpdateGroupName(editGroupId)}>
                                Update Group Name
                            </Button>
                            <Button variant='outlined' onClick={() => setEditGroupId(null)} sx={{ ml: 1 }}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
                {error && <Typography color="error">{error}</Typography>}
            </Grid>
        </Grid>
    );
};

export default CustomerGroup;
