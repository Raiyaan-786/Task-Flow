import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, CircularProgress, Alert, useTheme, Typography } from '@mui/material';
import { tokens } from '../../../theme';
import API from '../../../api/api';
import CustomToolbar from '../../../components/CustomToolbar';

const CompletedWorks = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployeesAndWorks();
  }, []);

  const fetchEmployeesAndWorks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const [worksResponse, employeesResponse] = await Promise.all([
        API.get('/completed-works', { headers: { Authorization: `Bearer ${token}` } }),
        API.get('/auth/allusers', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const employeesMap = employeesResponse.data.users.reduce((acc, emp) => {
        acc[emp._id] = emp.name;
        return acc;
      }, {});

      const mappedWorks = worksResponse.data.map((work, index) => ({
        ...work,
        sn: index + 1,
        assignedEmployee: employeesMap[work.assignedEmployee] || 'Not Assigned',
        createdAt: formatDate(work.createdAt)
      }));
      console.log(worksResponse) //test
      setWorks(mappedWorks);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (typeof date !== 'string' || !Date.parse(date)) return 'Invalid Date';
    return new Date(date).toLocaleString();
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  const columns = [
    { field: 'sn', headerName: 'Sn', flex: 0.5, headerAlign: 'center', align: 'center' },
    { field: 'billingName', headerName: 'Billing Name', flex: 1.5 },
    { field: 'createdAt', headerName: 'Created At', flex: 1.5 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'mobile', headerName: 'Mobile', flex: 1.5 },
    { field: 'pan', headerName: 'PAN', flex: 1.5 },
    { field: 'address', headerName: 'Address', flex: 1.5 },
    { field: 'service', headerName: 'Service', flex: 1.5 },
    { field: 'workType', headerName: 'Work Type', flex: 1.5 },
    { field: 'quantity', headerName: 'Quantity', flex: 0.5 },
    { field: 'price', headerName: 'Price', flex: 1.5 },
    { field: 'discount', headerName: 'Discount', flex: 1.5 },
    { field: 'financialYear', headerName: 'Financial Year', flex: 1.5 },
    { field: 'month', headerName: 'Month', flex: 1.5 },
    { field: 'quarter', headerName: 'Quarter', flex: 0.1 },
    { field: 'assignedEmployee', headerName: 'Assigned Employee', flex: 1.5 },
    { field: 'currentStatus', headerName: 'Current Status', flex: 1.5 },
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
       loading={loading}
       slotProps={{
         loadingOverlay: {
           variant: 'skeleton',
           noRowsVariant: 'skeleton',
         },
       }}
        rows={works}
        columns={columns}
        pageSize={10}
        disableColumnMenu
        getRowId={(row) => row._id}
        slots={{ toolbar: CustomToolbar }}
      />
    </Box>
  );
};

export default CompletedWorks;
