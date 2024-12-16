import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Typography, useTheme, Tooltip, Modal, Button, Grid2, TextField, Autocomplete } from '@mui/material';
import { tokens } from '../../theme';
import { Delete, Edit, NoAccounts, Visibility } from '@mui/icons-material';
import API from '../../api/api';
import CustomToolbar from '../../components/CustomToolbar'
import Header from '../../components/Header';

const EmployeeList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openViewModal, setOpenViewModal] = useState(false); // To open the view modal
  const [selectedEmployee, setSelectedEmployee] = useState(null); // For view/edit customer details
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editEmployeeData, setEditEmployeeData] = useState(null);

  const handleView = (employeeId) => {
    const employee = employees.find(c => c._id === employeeId);
    setSelectedEmployee(employee);
    setOpenViewModal(true); // Open view modal
  };

  const handleEditClick = (employeeId) => {
    const employee = employees.find(c => c._id === employeeId);
    setEditEmployeeData(employee);
    setOpenEditModal(true); // Open edit modal
  };
  const handleSaveEdit = async () => {
    try {
      await API.put(`/users/${editEmployeeData._id}`, editEmployeeData);
      setEmployees(employees.map(c => (c._id === editEmployeeData._id ? editEmployeeData : c)));
      setOpenEditModal(false); // Close edit modal
    } catch (err) {
      setError('Failed to save customer details');
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/allusers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const employeesData = response.data.users || [];
        setEmployees(employeesData.map((item, index) => ({ id: index + 1, ...item })));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = (id) => {
    console.log(`Delete employee with ID: ${id}`);
  };

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error: {error}</p>;

  const columns = [
    { field: 'id', headerName: 'Sn', flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: 'username', headerName: 'Username', flex: 1.5 },
    // { field: 'password', headerName: 'Password', flex: 1.5 },
    { field: 'name', headerName: 'Name', flex: 1.5 },
    { field: 'address', headerName: 'Address', flex: 1.5 },
    { field: 'mobile', headerName: 'Mobile', flex: 1.5 },
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'role', headerName: 'Role Name', flex: 1 },
    // { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
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

          <Tooltip title="Mute">
            <IconButton onClick={() => handleDelete(params.row.id)} >
              <NoAccounts />
            </IconButton>
          </Tooltip>

        </Box>
      ),
    },
  ];

  return (
    <Box
      display="flex"
      sx={{
        height: '67vh',
        width: '100%',
        '& .MuiDataGrid-root': { border: 'none' },
        '& .MuiDataGrid-cell': { borderBottom: 'none' },
        '& .MuiDataGrid-columnHeader': { backgroundColor: colors.primary[900], borderBottom: 'none' },
        '& .MuiDataGrid-virtualScroller': { backgroundColor: colors.bgc[100] },
        '& .MuiDataGrid-footerContainer': { borderTop: 'none', backgroundColor: colors.primary[900] },
      }}
    >
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Box sx={{ padding: 2, width: 400, margin: 'auto', bgcolor: 'white', borderRadius: 2 }}>
          <Typography variant="h4" fontWeight={'bold'}>Employee Details</Typography>
          {selectedEmployee && (
            <div>
              <p><strong>Name:</strong> {selectedEmployee.name}</p>
              <p><strong>Useraame:</strong> {selectedEmployee.username}</p>
              <p><strong>Department:</strong> {selectedEmployee.department}</p>
              <p><strong>Post Name:</strong> {selectedEmployee.postname}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Salary:</strong> {selectedEmployee.salary}</p>
              <p><strong>dateofjoining:</strong> {selectedEmployee.dateofjoining}</p>
              <p><strong>dateofleaving:</strong> {selectedEmployee.dateofleaving}</p>
              <p><strong>Mobile No:</strong> {selectedEmployee.mobile}</p>
              <p><strong>Address:</strong> {selectedEmployee.address}</p>
              <p><strong>Role:</strong> {selectedEmployee.role}</p>
              <p><strong>Status:</strong> {selectedEmployee.status}</p>
            </div>
          )}
          <Button onClick={() => setOpenViewModal(false)} variant="contained" sx={{ bgcolor: colors.teal[300] }}>Close</Button>
        </Box>
      </Modal>
       {/* Edit Employee Modal */}
       <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Box sx={{ padding: 2, width: "600px", height: '500px', overflow: 'auto', margin: 'auto', bgcolor: 'white', borderRadius: 2 ,bgcolor:colors.bgc[100]  }}>
                    <Header  title={'Edit Employee'} />
                    {editEmployeeData && (
                        <Grid2 container spacing={2} gap={2} padding={"10px 20px"} color={colors.grey[200]}>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>EMPLOYEE NAME</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editEmployeeData.name}
                                    variant="filled"
                                    onChange={(e) => setEditEmployeeData({ ...editEmployeeData, name: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>USERNAME</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editEmployeeData.username}
                                    variant="filled"
                                    onChange={(e) => setEditEmployeeData({ ...editEmployeeData, username: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>DEPARTMENT</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editEmployeeData.department}
                                    variant="filled"
                                    onChange={(e) => setEditEmployeeData({ ...editEmployeeData, department: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>POST NAME</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editEmployeeData.postname}
                                    variant="filled"
                                    onChange={(e) => setEditEmployeeData({ ...editEmployeeData, postname: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                            <Grid2 size={6} display={'flex'} alignItems={'center'}>
                                <label>MOBILE</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editEmployeeData.mobile}
                                    variant="filled"
                                    onChange={(e) => setEditEmployeeData({ ...editEmployeeData, mobile: e.target.value })}
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
                                <label>ADDRESS</label>
                            </Grid2>
                            <Grid2 size={6}>
                                <TextField
                                    value={editEmployeeData.address}
                                    multiline
                                    minRows={3}
                                    maxRows={3}
                                    variant="filled"
                                    onChange={(e) => setEditEmployeeData({ ...editEmployeeData, address: e.target.value })}
                                    fullWidth
                                />
                            </Grid2>
                          
                            <Button onClick={handleSaveEdit} variant="contained" sx={{bgcolor:colors.teal[300], marginTop: 2 }} >Save</Button>
                            <Button onClick={() => setOpenEditModal(false)} variant="outlined"  sx={{color:colors.grey[300], marginTop: 2 }}>Cancel</Button>
                        </Grid2>
                    )}
                </Box>
            </Modal>
      <DataGrid
        rows={employees}
        columns={columns}
        pageSize={10}
        disableColumnMenu
        slots={{ toolbar: CustomToolbar }}
      />
    </Box>
  );
};

export default EmployeeList;
