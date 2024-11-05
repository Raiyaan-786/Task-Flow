import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { PrintOutlined } from '@mui/icons-material';
import CustomToolbar from '../../components/CustomToolbar';
import API from '../../api/api';

const TurnoverList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch turnover data from backend
  const fetchTurnovers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const response = await API.get('/getallturnovers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.turnovers) {
        // Map data to fit DataGrid's expected row structure
        const formattedData = response.data.turnovers.map((turnover, index) => ({
          id: index, // Ensure unique ID
          Sn: index + 1,
          uid: turnover.customer._id,
          company: turnover.companyName,
          name: turnover.name,
          types: turnover.types,
          pan: turnover.pan,
          address: turnover.address,
          fy: turnover.financialYear,
          amount: turnover.turnover,
          date: turnover.date,
        }));
        setData(formattedData);
      } else {
        setError('No turnover data found.');
      }
    } catch (err) {
      console.error('Error fetching turnovers:', err);
      setError('Failed to fetch turnover data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnovers();
  }, []);

  const columns = [
    { field: "Sn", headerName: "Sn", flex: 0.5 },
    { field: "uid", headerName: "UID", headerAlign: "center", align: "center", flex: 1 },
    { field: "company", headerName: "Company", headerAlign: "center", align: "center", flex: 1 },
    { field: "name", headerName: "Name", headerAlign: "center", align: "center", flex: 1 },
    { field: "types", headerName: "Types", headerAlign: "center", align: "center", flex: 1 },
    { field: "pan", headerName: "PAN", headerAlign: "center", align: "center", flex: 1 },
    { field: "address", headerName: "Address", headerAlign: "center", align: "center", flex: 1.5 },
    { field: "fy", headerName: "Financial Year", headerAlign: "center", align: "center", flex: 1 },
    { field: "amount", headerName: "Amount", headerAlign: "center", align: "center", flex: 1, type: "number" },
    { field: "date", headerName: "Date", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: () => (
        <IconButton variant="contained" color="primary">
          <PrintOutlined />
        </IconButton>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Box
      display="flex"
      sx={{
        height: '67vh',
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: colors.primary[900],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.bgc[100],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.primary[900],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.teal[200]} !important`,
        },
      }}
    >
      <DataGrid
        disableColumnMenu
        rows={data}
        columns={columns}
        components={{ Toolbar: CustomToolbar }}
      />
    </Box>
  );
};

export default TurnoverList;
