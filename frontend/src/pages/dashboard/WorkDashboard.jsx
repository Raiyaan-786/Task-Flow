import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CustomToolbar from '../../components/CustomToolbar';
import API from '../../api/api';

const WorkDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [workSummary, setWorkSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkSummary = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await API.get('/workdashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedData = response.data.map((item, index) => ({
          id: index, // Using index as ID, baad me dekhte hain isko 
          workName: item.workType,
          totalWorks: item.totalWorks,
          workDone: item.worksDone,
          assignedWork: item.assignedWork,
          pickedUp: item.pickedUp,
          customerVerification: item.customerVerification,
          readyForChecking: item.readyForChecking,
          holdWork: item.holdWork,
          evcPending: item.evcPending,
          cancel: item.cancel,
        }));
        setWorkSummary(fetchedData);
      } catch (err) {
        console.error('Error fetching work summary:', err);
        setError('Failed to fetch work summary. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkSummary();
  }, []);

  const columns = [
    {
      field: "workName",
      headerName: "Work Name",
      flex: 1.5,
      renderCell: (params) => (
        <Box sx={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" bgcolor={colors.teal[700]} sx={{
            width: '100%', textAlign: 'center', height: '80%',
            borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.grey[100]
          }}>
            {params.row.workName}
          </Typography>
        </Box>
      )
    },
    { field: "totalWorks", headerName: "Total Works", type: "number", headerAlign: "center", align: "center", flex: 1 },
    { field: "workDone", headerName: "Works Done", type: "number", headerAlign: "center", align: "center", flex: 1 },
    { field: "assignedWork", headerName: "Assigned Work", type: "number", headerAlign: "center", align: "center", flex: 1 },
    { field: "pickedUp", headerName: "Picked Up", type: "number", headerAlign: "center", align: "center", flex: 1 },
    { field: "customerVerification", headerName: "Customer Verification", type: "number", headerAlign: "center", align: "center", flex: 1 },
    { field: "readyForChecking", headerName: "Ready For Checking", type: "number", headerAlign: "center", align: "center", flex: 1 },
    { field: "holdWork", headerName: "Hold Work", type: "number", headerAlign: "center", align: "center", flex: 1 },
    { field: "evcPending", headerName: "EVC Pending", type: "number", headerAlign: "center", align: "center", flex: 1 },
    { field: "cancel", headerName: "Cancel", type: "number", headerAlign: "center", align: "center", flex: 1 },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box display={'flex'}
      sx={{
        height: '67vh',
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .name-column--cell": { color: colors.teal[300] },
        "& .MuiDataGrid-columnHeader": { backgroundColor: colors.primary[900], borderBottom: "none" },
        "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.bgc[100] },
        "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[900] },
        "& .MuiCheckbox-root": { color: `${colors.teal[200]} !important` },
      }}
    >
      <DataGrid disableColumnMenu slots={{ toolbar: CustomToolbar }} rows={workSummary} columns={columns} />
    </Box>
  );
};

export default WorkDashboard;
