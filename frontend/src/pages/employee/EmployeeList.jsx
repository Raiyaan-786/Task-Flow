// import React, { useEffect, useState } from 'react'
// import API from '../../api/api'; 
// const EmployeeList = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         setError('No authentication token found. Please log in.');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await API.get('/auth/allusers', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setEmployees(response.data.users);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Failed to fetch users');
//         console.log(err);
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   if (loading) {
//     return <p>Loading employees...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }
//   console.log(employees)
//   return (
//     <div>EmployeeList</div>
//   )
// }

// export default EmployeeList
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { Delete, Edit } from '@mui/icons-material';
import API from '../../api/api';

const EmployeeList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleEdit = (id) => {
    console.log(`Edit employee with ID: ${id}`);
  };

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
      renderCell: (params) => (
        <Box display="flex" justifyContent="center">
          <IconButton onClick={() => handleEdit(params.row.id)} color="primary">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <Delete />
          </IconButton>
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
      <DataGrid
        rows={employees}
        columns={columns}
        pageSize={10}
        disableColumnMenu
      />
    </Box>
  );
};

export default EmployeeList;
