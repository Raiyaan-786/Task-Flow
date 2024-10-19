import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataWorkList } from '../../data/mockData';
import CustomToolbar from '../../components/CustomToolbar';
import { CheckCircleOutline, EditOutlined, ShareOutlined } from '@mui/icons-material';

const WorkList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(mockDataWorkList); // State to hold filtered data

  const handleFinish = (id) => {
    console.log(`Finish clicked for Row ID: ${id}`);
    // Add your finish logic here
  };

  const handleEdit = (id) => {
    console.log(`Edit clicked for Row ID: ${id}`);
    // Add your edit logic here
  };

  const handleShare = (id) => {
    console.log(`Share clicked for Row ID: ${id}`);
    // Add your share logic here
  };

  const columns = [
    { field: "Sn", headerName: "Sn", flex: 0.5 },
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center">
          <IconButton size="small" color="primary" onClick={() => handleFinish(params.row.id)}>
            <CheckCircleOutline />
          </IconButton>
          <IconButton size="small" color="secondary" onClick={() => handleEdit(params.row.id)}>
            <EditOutlined />
          </IconButton>
          <IconButton size="small" color="success" onClick={() => handleShare(params.row.id)}>
            <ShareOutlined />
          </IconButton>
        </Box>
      ),
    },
    { field: "status", headerName: "Status", headerAlign: "center", align: "center", flex: 1 },
    { field: "work", headerName: "Work", headerAlign: "center", align: "center", flex: 1 },
    { field: "name", headerName: "Name", headerAlign: "center", align: "center", flex: 1 },
    { field: "mobile", headerName: "Mobile (Indian)", headerAlign: "center", align: "center", flex: 1 },
    { field: "date", headerName: "Date", headerAlign: "center", align: "center", flex: 1 },
    { field: "modifyDate", headerName: "Modify Date", headerAlign: "center", align: "center", flex: 1 },
    { field: "assign", headerName: "Assign", headerAlign: "center", align: "center", flex: 1 },
    { field: "Remark", headerName: "Remark", headerAlign: "center", align: "center", flex: 1 },
    { field: "Reminder", headerName: "Reminder", headerAlign: "center", align: "center", flex: 1 },
    { field: "fy", headerName: "Financial Year", headerAlign: "center", align: "center", flex: 1 },
  ];

  return (
    <Box display={'flex'} sx={{
      height: '67vh',
      "& .MuiDataGrid-root": { border: "none" },
      "& .MuiDataGrid-cell": { borderBottom: "none" },
      "& .MuiDataGrid-columnHeader": { backgroundColor: colors.primary[900], borderBottom: "none" },
      "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.bgc[100] },
      "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[900] },
      "& .MuiCheckbox-root": { color: `${colors.teal[200]} !important` },
    }}>
      <DataGrid
        disableColumnMenu
        slots={{ toolbar: CustomToolbar }}
        rows={data} // Use the filtered data
        columns={columns}
      />
    </Box>
  );
};

export default WorkList;
