import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Box, Button, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataTurnoverList } from '../../data/mockData';
import { PrintOutlined } from '@mui/icons-material';
import CustomToolbar from '../../components/CustomToolbar';

const TurnoverList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(mockDataTurnoverList); // State to hold filtered data

  const columns = [
    { field: "Sn", headerName: "Sn", flex: 0.5 },
    {
      field: "uid",
      headerName: "UID",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "company",
      headerName: "Company",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "types",
      headerName: "Types",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "pan",
      headerName: "PAN",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "fy",
      headerName: "Financial Year",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      type: "number",
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
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

  return (
      <Box display={'flex'} sx={{ height: '67vh' ,
        
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
          slots={{toolbar:CustomToolbar}}
          rows={data} 
          columns={columns}
        />
      </Box>
  );
};

export default TurnoverList;
