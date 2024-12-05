import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, TextField, Typography, IconButton, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomToolbar from '../../components/CustomToolbar';
import API from '../../api/api';
import { tokens } from "../../theme";
import {Add, Delete, Edit} from '@mui/icons-material';

const CustomerGroup = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [groupName, setGroupName] = useState('');
    const [customers, setCustomers] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // States for UpdateCustomerGroup functionality
    const [groups, setGroups] = useState([]);
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
            const mappedGroups = response.data.groups.map((groups,index)=>({
                ...groups,
                sn:index+1,
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
        
// createdAt

        { field: "sn", headerName: "S.No", flex: 0.5, headerAlign: "center", align: "center" },
        { field: 'groupName', headerName: 'Group Name', flex: 1, headerAlign: "center", align: "center"  },
        { field: 'createdAt', headerName: 'Created At', flex: 1, headerAlign: "center", align: "center"  },
        { field: 'memberCount', headerName: 'Number of Members', flex: .8, headerAlign: "center", align: "center" },
        { field: 'updatedAt', headerName: 'Updated At', flex: 1, headerAlign: "center", align: "center" },
        {
            field: 'actions',
            headerName: 'Actions',
            headerAlign: "center",
            align: "center",
            renderCell: (params) => (
                <Box  display={'flex'} justifyContent={'space-evenly'} alignItems={'center'} 
                sx={{
                    height:'100%',
                    width:'100%',
                }}
                >

                <Button
                startIcon={<Edit/>}
                size='small'
                sx={{ bgcolor: '#007499',color:'white' }}
                onClick={() => { setEditGroupId(params.row.id); setNewGroupName(params.row.groupName); }}
                >
                Edit
                </Button>
                <Button
                    // variant="outlined" 
                    startIcon={<Delete/>}
                    size='small'
                    sx={{ bgcolor: '#007499',color:'white' }}
                    onClick={() => handleDeleteGroup(params.row.id)}
                >
                Delete
                </Button>
                </Box>
            ),
            flex: 1.5
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
             startIcon={<Add/>}
             sx={{ bgcolor: '#007499',color:'white',m:2}}
            >
              CREATE GROUP
            </Button>
            {loading ? (
                <p>Loading customers...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : (
                
                <DataGrid
                    disableColumnMenu
                    slots={{ toolbar: CustomToolbar }}
                    rows={groups}
                    columns={columns}
                    pageSize={10}
                />
            )}
        </Box>
    );
};

export default CustomerGroup;
